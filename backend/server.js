const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { connectProducer } = require('./kafka/producer');
const { runConsumer } = require('./kafka/consumer');
const eventRoutes = require('./routes/events');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cors());

// Serve static frontend files if needed
// const path = require('path');
// app.use(express.static(path.join(__dirname, '../frontend')));

// API Routes
app.use('/api', eventRoutes);

// Add a test GET / route
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to Kafka Event Logger Dashboard API' });
});

// Initialization function
const init = async () => {
    try {
        console.log('🚀 Starting the Kafka Event Logger System...');

        // Connect Kafka Producer
        await connectProducer();

        // Start Kafka Consumer asynchronously
        runConsumer().catch(err => console.error('❌ Kafka Consumer Error:', err));

        // Start Express Server
        app.listen(PORT, () => {
            console.log(`📡 Backend server is running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('❌ Initialization failed:', error);
    }
};

// Start the application
init();
