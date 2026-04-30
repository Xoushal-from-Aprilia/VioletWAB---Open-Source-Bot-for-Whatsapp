# 🤖 TermuxBot — WhatsApp Bot su Termux

Bot WhatsApp self-hosted per Android, con sistema di moderazione a prefisso. Gira completamente su Termux senza server esterni.

---

## 📦 Installazione

### 1. Installa Termux
Scarica **Termux** da [F-Droid](https://f-droid.org/packages/com.termux/) (NON dal Play Store, è deprecato).

### 2. Copia i file sul telefono
Copia la cartella `wabot/` in Termux. Puoi farlo con:
```bash
# Via USB: copia la cartella in /sdcard/wabot, poi da Termux:
cp -r /sdcard/wabot ~/wabot
cd ~/wabot
```

### 3. Configura il tuo numero admin
Apri `src/config.js` e modifica:
```js
export const ADMINS = [
  "393491234567",   // il tuo numero (senza + e senza spazi)
];
```

### 4. Avvia il setup
```bash
chmod +x setup.sh
bash setup.sh
```

### 5. Avvia il bot
```bash
npm start
```

Apparirà un **QR code** nel terminale. Aprì WhatsApp → Dispositivi collegati → Collega un dispositivo → scansiona il QR.

---

## 📋 Comandi disponibili

| Comando | Alias | Descrizione | Admin? |
|---|---|---|---|
| `!help` | `!h`, `!menu` | Lista comandi | ❌ |
| `!ping` | `!p` | Latenza bot | ❌ |
| `!info` | `!about` | Info bot e sistema | ❌ |
| `!bot` | `!status` | Stato bot | ❌ |
| `!kick @utente` | `!remove` | Rimuovi dal gruppo | ✅ |
| `!warn @utente [motivo]` | `!w` | Avverti utente (kick a 3 warn) | ✅ |
| `!warns @utente` | `!warnlist` | Controlla warn | ❌ |
| `!clearwarns @utente` | `!cw` | Azzera warn | ✅ |
| `!mute` | `!lock` | Silenzia gruppo | ✅ |
| `!unmute` | `!unlock` | Riapri gruppo | ✅ |
| `!tagall [msg]` | `!everyone` | Menziona tutti | ✅ |
| `!sticker` | `!s` | Immagine → sticker | ❌ |

> **Admin?** = richiede che il tuo numero sia in `ADMINS` dentro `src/config.js`

---

## 🔄 Tenere il bot attivo in background

### Opzione 1 — Sessioni multiple Termux
Swipe da sinistra → **New Session**. Il bot continua a girare.

### Opzione 2 — nohup (resistente alla chiusura)
```bash
nohup npm start > bot.log 2>&1 &
echo "PID: $!"
```
Per fermarlo: `kill <PID>`

### Opzione 3 — tmux (consigliata)
```bash
pkg install tmux
tmux new -s bot
npm start
# Ctrl+B poi D per staccarti, il bot resta attivo
# tmux attach -t bot  per rientrare
```

---

## 🗂️ Struttura file

```
wabot/
├── src/
│   ├── index.js          # Entry point, gestione connessione
│   ├── handler.js        # Interpreta i messaggi in arrivo
│   ├── config.js         # ⚙️ Configurazione (MODIFICA QUI)
│   ├── commands/
│   │   ├── index.js      # Registry comandi
│   │   ├── help.js
│   │   ├── ping.js
│   │   ├── kick.js
│   │   ├── warn.js       # Sistema warn con auto-kick
│   │   ├── warns.js
│   │   ├── clearwarns.js
│   │   ├── mute.js
│   │   ├── unmute.js
│   │   ├── tagall.js
│   │   ├── sticker.js
│   │   └── bot.js
│   └── utils/
│       └── helpers.js    # Funzioni condivise
├── auth_info_baileys/    # Sessione WhatsApp (auto-generata)
├── warns.json            # DB warn (auto-generato)
├── package.json
├── setup.sh
└── README.md
```

---

## ➕ Aggiungere un nuovo comando

1. Crea `src/commands/miocomando.js`:
```js
export default {
  name: "miocomando",
  aliases: ["mc"],
  description: "Descrizione breve",
  usage: "miocomando [argomenti]",
  category: "Generale",

  async execute({ reply, args, sock, jid, senderNumber, isGroup, msg }) {
    await reply(`Hai scritto: ${args.join(" ")}`);
  },
};
```

2. Aggiungilo in `src/commands/index.js`:
```js
import miocomandoCmd from "./miocomando.js";
// ...
const commandList = [
  // ...
  miocomandoCmd,
];
```

---

## ❓ FAQ

**Il QR non appare / scade?**  
Aspetta qualche secondo. Se scade, riavvia con `npm start`.

**"Session not found" dopo riavvio?**  
La sessione è salvata in `auth_info_baileys/`. Finché non la cancelli, non serve ri-scansionare.

**Il bot viene bannato?**  
Usa il bot in modo responsabile. Evita spam, delay già incluso (2s cooldown).

**Cambiare prefisso da `!` a qualcos'altro?**  
Modifica `PREFIX` in `src/config.js`.
