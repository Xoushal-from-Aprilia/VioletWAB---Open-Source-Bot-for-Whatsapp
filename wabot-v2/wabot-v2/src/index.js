import makeWASocket, {
  useMultiFileAuthState,
  DisconnectReason,
  fetchLatestBaileysVersion,
  makeCacheableSignalKeyStore,
} from "@whiskeysockets/baileys";
import pino from "pino";
import qrcode from "qrcode-terminal";
import { handleMessage } from "./handler.js";
import { PREFIX, BOT_NAME } from "./config.js";

const logger = pino({ level: "silent" });

async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState("auth_info_baileys");
  const { version } = await fetchLatestBaileysVersion();

  console.log(`\n╔════════════════════════════════╗`);
  console.log(`║   ${BOT_NAME.padEnd(28)}║`);
  console.log(`║   Prefix: ${PREFIX.padEnd(22)}║`);
  console.log(`╚════════════════════════════════╝\n`);

  const sock = makeWASocket({
    version,
    logger,
    printQRInTerminal: false,
    auth: {
      creds: state.creds,
      keys: makeCacheableSignalKeyStore(state.keys, logger),
    },
    msgRetryCounterMap: {},
    generateHighQualityLinkPreview: false,
  });

  sock.ev.on("connection.update", async (update) => {
    const { connection, lastDisconnect, qr } = update;

    if (qr) {
      console.log("📱 Scansiona il QR code con WhatsApp:\n");
      qrcode.generate(qr, { small: true });
    }

    if (connection === "close") {
      const shouldReconnect =
        lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
      if (shouldReconnect) {
        console.log("🔄 Riconnessione in corso...");
        setTimeout(startBot, 3000);
      } else {
        console.log("🚪 Disconnesso. Elimina auth_info_baileys e riavvia.");
        process.exit(0);
      }
    }

    if (connection === "open") {
      console.log(`\n✅ Bot connesso! Usa il prefisso "${PREFIX}" per i comandi.\n`);
    }
  });

  sock.ev.on("creds.update", saveCreds);

  sock.ev.on("messages.upsert", async ({ messages, type }) => {
    if (type !== "notify") return;
    for (const msg of messages) {
      if (!msg.message) continue;
      if (msg.key.fromMe) continue;
      await handleMessage(sock, msg);
    }
  });
}

startBot().catch(console.error);
