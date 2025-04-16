const { Client } = require('pg');
require('dotenv').config();

const client = new Client({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
});

client.connect();

const insertData = async (data) => {
  await client.query('CREATE TABLE IF NOT EXISTS records(id SERIAL PRIMARY KEY, name TEXT, email TEXT);');
  await client.query('INSERT INTO records(name, email) VALUES($1, $2)', [data.name, data.email]);
};

module.exports = insertData;
