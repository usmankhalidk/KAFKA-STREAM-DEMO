const { Kafka } = require('kafkajs');
const insertData = require('./db');
require('dotenv').config();

const kafka = new Kafka({
  clientId: 'consumer-app',
  brokers: [process.env.KAFKA_BROKER],
});

const consumer = kafka.consumer({ groupId: 'pg-group' });

const run = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: 'new-records', fromBeginning: true });
  await consumer.run({
    eachMessage: async ({ message }) => {
      const data = JSON.parse(message.value.toString());
      await insertData(data);
      console.log('Inserted into PostgreSQL:', data);
    },
  });
};

run().catch(console.error);