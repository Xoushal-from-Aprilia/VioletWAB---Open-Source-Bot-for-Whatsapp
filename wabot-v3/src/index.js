import makeWASocket, {
  useMultiFileAuthState,
  DisconnectReason,
  fetchLatestBaileysVersion,
  makeCacheableSignalKeyStore,
} from "@whiskeysockets/baileys";
import pino from "pino";
import qrcode from "qrcode-terminal";
import QRCode from "qrcode";
import { handleMessage } from "./handler.js";
import { PREFIX, BOT_NAME, WEB_PORT } from "./config.js";
import { state, addLog, broadcastStatus } from "./state.js";
import { startWebServer } from "./web/server.js";

const logger = pino({ level: "silent" });

// Avvia il server web
startWebServer(WEB_PORT);

async function startBot() {
  const { state: authState, saveCreds } = await useMultiFileAuthState("auth_info_baileys");
  const { version } = await fetchLatestBaileysVersion();

  console.log(`\n╔════════════════════════════════╗`);
  console.log(`║   ${BOT_NAME.padEnd(28)}║`);
  console.log(`║   Prefix: ${PREFIX.padEnd(22)}║`);
  console.log(`║   Pannello: http://localhost:${WEB_PORT.toString().padEnd(4)}║`);
  console.log(`╚════════════════════════════════╝\n`);

  addLog("info", `Bot avviato — prefisso: ${PREFIX}`);

  const sock = makeWASocket({
    version,
    logger,
    printQRInTerminal: false,
    auth: {
      creds: authState.creds,
      keys: makeCacheableSignalKeyStore(authState.keys, logger),
    },
    msgRetryCounterMap: {},
    generateHighQualityLinkPreview: false,
  });

  state.sock = sock;

  sock.ev.on("connection.update", async (update) => {
    const { connection, lastDisconnect, qr } = update;

    if (qr) {
      console.log("📱 Scansiona il QR su WhatsApp o dal pannello web:\n");
      qrcode.generate(qr, { small: true });
      state.qrCode = await QRCode.toDataURL(qr);
      state.connected = false;
      broadcastStatus();
      if (global.wsBroadcast) {
        global.wsBroadcast(JSON.stringify({ type: "qr", data: state.qrCode }));
      }
    }

    if (connection === "close") {
      state.connected = false;
      state.qrCode = null;
      const shouldReconnect =
        lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
      addLog("warn", "Connessione chiusa" + (shouldReconnect ? " — riconnessione..." : " — logout"));
      broadcastStatus();
      if (shouldReconnect) setTimeout(startBot, 3000);
      else process.exit(0);
    }

    if (connection === "open") {
      state.connected = true;
      state.qrCode = null;
      state.connectedAt = new Date();
      addLog("success", `✅ Bot connesso come ${sock.user?.name || sock.user?.id}`);
      broadcastStatus();

      // Aggiorna lista gruppi
      try {
        const groups = await sock.groupFetchAllParticipating();
        state.groups = Object.values(groups).map(g => ({
          id: g.id,
          name: g.subject,
          participants: g.participants.length,
        }));
      } catch {}
    }
  });

  sock.ev.on("creds.update", saveCreds);

  sock.ev.on("messages.upsert", async ({ messages, type }) => {
    if (type !== "notify") return;
    for (const msg of messages) {
      if (!msg.message) continue;
      if (msg.key.fromMe) continue;
      state.messagesReceived++;
      await handleMessage(sock, msg);
    }
  });
}

startBot().catch(console.error);
