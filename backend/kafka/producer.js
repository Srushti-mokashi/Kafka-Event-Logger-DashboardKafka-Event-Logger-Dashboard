const { Kafka } = require('kafkajs');
require('dotenv').config();

// Initialize the Kafka client
const kafka = new Kafka({
    clientId: process.env.KAFKA_CLIENT_ID || 'event-logger-app',
    brokers: [process.env.KAFKA_BROKER || 'localhost:9092'],
});

const producer = kafka.producer();

// Connect the producer
const connectProducer = async () => {
    try {
        await producer.connect();
        console.log('✅ Kafka Producer connected successfully');
    } catch (error) {
        console.error('❌ Failed to connect Kafka Producer:', error);
    }
};

// Function to send a message to the topic
const sendEvent = async (event) => {
    try {
        await producer.send({
            topic: process.env.KAFKA_TOPIC || 'events_topic',
            messages: [
                { value: JSON.stringify(event) },
            ],
        });
        console.log(`📡 Event produced: ${event.event_type} for user ${event.user_id}`);
    } catch (error) {
        console.error('❌ Error producing event:', error);
    }
};

module.exports = { connectProducer, sendEvent };
