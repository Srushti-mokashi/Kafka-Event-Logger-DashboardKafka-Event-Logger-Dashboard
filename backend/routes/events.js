const express = require('express');
const router = express.Router();
const producer = require('../kafka/producer'); // Kafka producer logic
const db = require('../database/db'); // MySQL connection pool

// POST /api/events - Trigger Kafka producer to send an event
router.post('/events', async (req, res) => {
    const { event_type, user_id } = req.body;

    // Validate inputs
    if (!event_type || !user_id) {
        return res.status(400).json({ error: 'event_type and user_id are required' });
    }

    try {
        const event = { event_type, user_id, timestamp: new Date() };

        // Send the event to Kafka
        await producer.sendEvent(event);

        return res.status(202).json({ message: 'Event successfully produced to Kafka' });
    } catch (error) {
        console.error('❌ API Error producing event:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

// GET /api/events - Fetch stored events from MySQL database
router.get('/events', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM events ORDER BY timestamp DESC LIMIT 50');
        return res.status(200).json(rows);
    } catch (error) {
        console.error('❌ API Error fetching events:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
