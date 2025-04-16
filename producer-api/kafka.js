const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'producer-app',
  brokers: [process.env.KAFKA_BROKER]
});

const producer = kafka.producer();

const sendMessage = async (message) => {
  await producer.connect();
  await producer.send({
    topic: 'new-records',
    messages: [{ value: JSON.stringify(message) }],
  });
  await producer.disconnect();
};

module.exports = sendMessage;