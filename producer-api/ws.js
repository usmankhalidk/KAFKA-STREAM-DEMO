const WebSocket = require('ws');
const { Pool } = require('pg');
require('dotenv').config();

// Set up PostgreSQL connection
const pool = new Pool({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
});

// WebSocket Server
const wss = new WebSocket.Server({ port: 8081 });

// Function to broadcast message to all connected WebSocket clients
wss.broadcast = function broadcast(data) {
  wss.clients.forEach(function each(client) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
};

// Fetch all data from the database
async function getAllData() {
  try {
    const result = await pool.query('SELECT * FROM records'); // Replace with your table/query
    return result.rows;
  } catch (err) {
    console.error('Error fetching data from database:', err);
    return [];
  }
}

// When a client connects to the WebSocket server
wss.on('connection', async (ws) => {
  // Fetch existing data from database and send it to the client
  const allData = await getAllData();
  allData.forEach((data) => {
    ws.send(JSON.stringify(data));
  });

  // Listen for new messages
  ws.on('message', (message) => {
    console.log('received: %s', message);
    // You can handle the incoming data here and send it to Kafka or store it in the database
  });
});

module.exports = { wss };
