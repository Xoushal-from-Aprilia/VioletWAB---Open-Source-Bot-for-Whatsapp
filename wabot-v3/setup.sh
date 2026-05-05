#!/data/data/com.termux/files/usr/bin/bash

# ================================================================
#  TermuxBot - Script di installazione per Termux
# ================================================================

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo ""
echo -e "${GREEN}╔════════════════════════════════╗${NC}"
echo -e "${GREEN}║     TermuxBot - Setup          ║${NC}"
echo -e "${GREEN}╚════════════════════════════════╝${NC}"
echo ""

# ── Aggiorna Termux ──────────────────────────────────────────
echo -e "${YELLOW}[1/4] Aggiornamento pacchetti Termux...${NC}"
pkg update -y && pkg upgrade -y

# ── Installa Node.js ─────────────────────────────────────────
echo -e "${YELLOW}[2/4] Installazione Node.js...${NC}"
pkg install nodejs -y

# ── Installa dipendenze di sistema necessarie per Baileys ────
echo -e "${YELLOW}[3/4] Installazione dipendenze sistema...${NC}"
pkg install git python -y

# ── Installa dipendenze npm ──────────────────────────────────
echo -e "${YELLOW}[4/4] Installazione dipendenze npm...${NC}"
npm install

echo ""
echo -e "${GREEN}✅ Installazione completata!${NC}"
echo ""
echo -e "${YELLOW}📱 PRIMA DI AVVIARE:${NC}"
echo "   Apri src/config.js e inserisci il tuo numero in ADMINS"
echo "   Esempio: \"393491234567\"  (senza +, senza spazi)"
echo ""
echo -e "${GREEN}▶️  Per avviare il bot:${NC}  npm start"
echo ""
