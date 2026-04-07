const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { connectProducer } = require("./kafka/producer");
const { runConsumer } = require("./kafka/consumer");
const eventRoutes = require("./routes/events");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

app.use("/api", eventRoutes);

app.get("/", (req, res) => {
    res.json({ message: "Kafka Event Logger Dashboard API running" });
});

const init = async () => {

    console.log("Starting Kafka Event Logger System");

    if (process.env.ENABLE_KAFKA === "true") {
        try {
            await connectProducer();
            console.log("Kafka Producer connected");

            runConsumer().catch(err =>
                console.error("Kafka Consumer Error:", err)
            );

        } catch (err) {
            console.log("Kafka not available. Running API without Kafka.");
        }
    } else {
        console.log("Kafka disabled. Running API only.");
    }

    app.listen(PORT, () => {
        console.log("Server running on port " + PORT);
    });

};

init();