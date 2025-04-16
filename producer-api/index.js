const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');  // Import the cors package
const { wss } = require('./ws');
require('dotenv').config();
const sendMessage = require('./kafka');

const app = express();

// Enable CORS for all origins (or you can restrict it to specific origins)
app.use(cors());

app.use(bodyParser.json());

app.post('/api/data', async (req, res) => {
  const { name, email } = req.body;

  try {
    // Send data to Kafka
    await sendMessage({ name, email });

    // Broadcast to all connected WebSocket clients
    wss.broadcast({ name, email });

    res.status(200).json({ message: 'Data sent to Kafka!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error sending data' });
  }
});

app.listen(4153, () => console.log('Producer API running on http://localhost:4153'));
