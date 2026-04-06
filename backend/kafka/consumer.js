const { Kafka } = require('kafkajs');
const db = require('../database/db'); // MySQL connection pool
require('dotenv').config();

// Initialize the Kafka client
const kafka = new Kafka({
    clientId: process.env.KAFKA_CLIENT_ID || 'event-logger-app',
    brokers: [process.env.KAFKA_BROKER || 'localhost:9092'],
});

const consumer = kafka.consumer({ groupId: 'event-logger-group' });

// Function to start the consumer
const runConsumer = async () => {
    try {
        await consumer.connect();
        console.log('✅ Kafka Consumer connected successfully');

        // Subscribe to the topic
        await consumer.subscribe({ 
            topic: process.env.KAFKA_TOPIC || 'events_topic', 
            fromBeginning: true 
        });

        // Run the consumer and process each message
        await consumer.run({
            eachMessage: async ({ topic, partition, message }) => {
                const event = JSON.parse(message.value.toString());
                console.log(`📩 Received event: ${event.event_type} for user ${event.user_id}`);

                // Save to MySQL
                try {
                    await db.query(
                        'INSERT INTO events (event_type, user_id) VALUES (?, ?)',
                        [event.event_type, event.user_id]
                    );
                    console.log('💾 Event saved to MySQL successfully');
                } catch (dbError) {
                    console.error('❌ Error saving event to database:', dbError);
                }
            },
        });
    } catch (error) {
        console.error('❌ Failed to run Kafka Consumer:', error);
    }
};

module.exports = { runConsumer };
