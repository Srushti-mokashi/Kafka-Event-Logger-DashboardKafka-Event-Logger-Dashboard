# Kafka Event Logger Dashboard

## Real-Time Event Streaming & Monitoring System
This project is a real-time event monitoring dashboard built using Apache Kafka.
It simulates how modern backend systems track and analyze events such as user actions, orders, and payments.
The system allows users to produce events, stream them through Kafka, store them, and visualize analytics in real time.

## This type of architecture is commonly used in:

E-commerce platforms
Payment systems
User activity tracking
Microservices monitoring
System observability dashboards

## The dashboard helps visualize how event-driven architectures work in real production systems.
System Architecture
The project follows an event-driven architecture.

User Action
   ↓
Frontend Dashboard
   ↓
API Server
   ↓
Kafka Producer
   ↓
Kafka Topic
   ↓
Kafka Consumer
   ↓
Database / Storage
   ↓
Analytics Dashboard

This architecture allows real-time streaming and processing of events.

##Screenshots & Feature Explanation

## 1️⃣ Event Counters (counts.png)

This section displays real-time metrics summarizing system activity.

Displayed metrics include:

Total Events – Total number of events processed by the system.
User Signups – Number of new users registered.
Orders – Number of orders placed by users.
Payments – Number of successful payment transactions.

Purpose:

Provides quick insight into system activity
Helps monitor system behavior in real time
Similar to monitoring dashboards used by backend teams.

## 2️⃣ Main Dashboard (dashboard1.png)

The main dashboard acts as the central control panel for monitoring Kafka events.

Key components:

Event statistics cards
Event production panel
Analytics charts
Recent event logs

This page gives a complete overview of the system state.

## 3️⃣ Analytics Dashboard (dashboard2.png)

This section visualizes event data using charts and graphs.

It helps developers and system engineers analyze:

Event distribution
Event frequency
System activity trends

Analytics dashboards are commonly used in:

System monitoring tools
DevOps dashboards
Observability platforms

## 4️⃣ System Architecture Diagram (diagram.png)

This diagram explains the internal workflow of the system.

Main components:

Frontend

Interactive dashboard where users trigger events.

Backend API

Handles incoming requests and communicates with Kafka.

Kafka Producer

Sends event messages to Kafka topics.

Kafka Broker

Kafka server that manages message queues.

Kafka Consumer

Reads messages from topics and processes them.

Storage / Analytics

Processed data is stored and visualized in the dashboard.

This architecture demonstrates event-driven system design, widely used in modern distributed systems.

## 5️⃣ Event Timeline Graph (events-timeline.png)

This graph shows how events occur over time.

The timeline helps analyze:

System activity patterns
Event spikes
Traffic behavior

Use cases:

Detecting unusual system activity
Monitoring application usage
Performance analysis

## 6️⃣ Produce Event Panel (produce-event.png)

This feature allows users to simulate system events manually.

Fields include:

Event Type
Select the type of event (order, signup, login, etc.)
User ID
Identifier for the user generating the event.
Produce Event Button
Sends the event to Kafka.

Behind the scenes:

Event is created
Kafka producer publishes the message
Kafka topic receives the event
Consumers process the event
Dashboard updates in real time

## 7️⃣ Event Type Selection (produce-event-type.png)

This dropdown allows selecting different types of system events.

Examples:

user_signup
order_placed
item_added_to_cart
payment_success
user_login

Each event represents a real-world user action inside a system.

## 8️⃣ Recent Events Table (recent-events.png)

This section displays the latest events processed by the system.

Each row includes:

Event ID
Event Type
User ID
Timestamp

Purpose:

Track system activity
Debug event processing
Monitor real-time event flow

This is similar to log monitoring dashboards used by support engineers.

## Key Technologies Used

Apache Kafka
Distributed event streaming platform used for real-time data pipelines.
Node.js / Backend API
Handles event creation and communication with Kafka.
React / Frontend
Builds the interactive dashboard UI.
Chart.js
Used to visualize analytics data with charts.
REST APIs
Used for communication between frontend and backend.
Real-World Applications

## This system demonstrates concepts used in:
Microservices architecture
Real-time analytics
Event-driven systems
System monitoring tools
Distributed system debugging

Companies like Uber, Netflix, LinkedIn, and Amazon use similar event streaming systems.


## This project demonstrates skills in:

Event-driven architecture
Kafka event streaming
Backend API development
Real-time data visualization
System monitoring
Distributed system design


## Live links
frontend : https://kafka-event-logger-dashboard-kafka.vercel.app
backend : https://kafka-event-logger-dashboardkafka-event.onrender.com
databse : neon (postgreSQL)
