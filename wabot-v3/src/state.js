// ── Stato globale condiviso tra bot e server web ─────────────
export const state = {
  sock: null,
  qrCode: null,
  connected: false,
  connectedAt: null,
  messagesReceived: 0,
  commandsExecuted: 0,
  logs: [],
  groups: [],
};

export function addLog(level, message) {
  const entry = {
    time: new Date().toISOString(),
    level,
    message,
  };
  state.logs.unshift(entry);
  if (state.logs.length > 200) state.logs.pop();

  // Broadcast ai client WebSocket
  if (global.wsBroadcast) global.wsBroadcast(JSON.stringify({ type: "log", data: entry }));
}

export function broadcastStatus() {
  if (!global.wsBroadcast) return;
  global.wsBroadcast(JSON.stringify({
    type: "status",
    data: {
      connected: state.connected,
      qrCode: state.qrCode,
      messagesReceived: state.messagesReceived,
      commandsExecuted: state.commandsExecuted,
      uptime: process.uptime(),
      memory: process.memoryUsage().rss,
    }
  }));
}
