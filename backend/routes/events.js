const express = require("express");
const router = express.Router();
const producer = require("../kafka/producer");
const db = require("../database/db");


// POST /api/events
router.post("/events", async (req, res) => {
    const { event_type, user_id } = req.body;

    if (!event_type || !user_id) {
        return res.status(400).json({
            error: "event_type and user_id are required"
        });
    }

    try {

        const created_at = new Date();

        // Send event to Kafka
        await producer.sendEvent({
            event_type,
            user_id,
            created_at
        });

        // Store event in PostgreSQL
        await db.query(
            "INSERT INTO events (event_type, user_id, created_at) VALUES ($1,$2,$3)",
            [event_type, user_id, created_at]
        );

        res.status(201).json({
            message: "Event stored successfully"
        });

    } catch (error) {
        console.error("POST /events error:", error);
        res.status(500).json({
            error: "Internal Server Error"
        });
    }
});


// GET /api/events
router.get("/events", async (req, res) => {
    try {

        const rows = await db.query(
            "SELECT id, event_type, user_id, created_at FROM events ORDER BY created_at DESC LIMIT 50"
        );

        res.status(200).json(rows);

    } catch (error) {
        console.error("GET /events error:", error);
        res.status(500).json({
            error: "Internal Server Error"
        });
    }
});


module.exports = router;

