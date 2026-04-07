const express = require("express");
const router = express.Router();
const producer = require("../kafka/producer"); // Kafka producer
const db = require("../database/db"); // PostgreSQL connection

// POST /api/events
router.post("/events", async (req, res) => {
    const { event_type, user_id } = req.body;

    if (!event_type || !user_id) {
        return res.status(400).json({
            error: "event_type and user_id are required"
        });
    }

    try {
        const event = {
            event_type,
            user_id,
            timestamp: new Date()
        };

        // Send event to Kafka
        await producer.sendEvent(event);

        // Store event in PostgreSQL
        await db.query(
            "INSERT INTO events (event_type, user_id, timestamp) VALUES ($1, $2, $3)",
            [event_type, user_id, event.timestamp]
        );

        res.status(202).json({
            message: "Event successfully produced and stored"
        });

    } catch (error) {
        console.error("API Error producing event:", error);
        res.status(500).json({
            error: "Internal Server Error"
        });
    }
});


// GET /api/events
router.get("/events", async (req, res) => {
    try {

        const rows = await db.query(
            "SELECT id, event_type, user_id, timestamp AS created_at FROM events ORDER BY timestamp DESC LIMIT 50"
        );

        res.status(200).json(rows);

    } catch (error) {
        console.error("API Error fetching events:", error);
        res.status(500).json({
            error: "Internal Server Error"
        });
    }
});

module.exports = router;

