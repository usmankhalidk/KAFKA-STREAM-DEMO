const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8081 }); // WebSocket server

wss.broadcast = (data) => {
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
};

// Keep a reference to use when API receives data
module.exports = { wss };
