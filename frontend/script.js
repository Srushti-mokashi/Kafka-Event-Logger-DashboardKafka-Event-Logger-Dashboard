// Switch between local backend and deployed backend
const API_URL =
    window.location.hostname === "localhost" ||
        window.location.hostname === "127.0.0.1"
        ? "http://localhost:3000/api"
        : "https://kafka-event-logger-dashboardkafka-event.onrender.com/api/"

// DOM Elements
const eventForm = document.getElementById("eventForm");
const eventsTable = document.getElementById("eventsTable");
const submitBtn = document.getElementById("submitBtn");

// Fetch and display events
const fetchEvents = async () => {
    try {
        const response = await axios.get(`${API_URL}/events`);
        const events = response.data;

        eventsTable.innerHTML = "";

        if (!events || events.length === 0) {
            eventsTable.innerHTML =
                '<tr><td colspan="4" style="text-align:center;">No events recorded yet.</td></tr>';
            return;
        }

        events.forEach((event) => {
            const row = document.createElement("tr");

            row.innerHTML = `
        <td>#${event.id}</td>
        <td>
          <span class="badge ${getBadgeClass(event.event_type)}">
            ${formatEventType(event.event_type)}
          </span>
        </td>
        <td>${event.user_id}</td>
        <td style="color: var(--text-muted); font-size:0.8rem;">
          ${new Date(event.created_at).toLocaleString()}
        </td>
      `;

            eventsTable.appendChild(row);
        });
    } catch (error) {
        console.error("Error fetching events:", error);
    }
};

// Format event type
const formatEventType = (type) => {
    return type.replace(/_/g, " ").toUpperCase();
};

// Badge color helper
const getBadgeClass = (type) => {
    if (type.includes("signup")) return "badge-purple";
    if (type.includes("order")) return "badge-green";
    if (type.includes("payment")) return "badge-green";
    return "badge-blue";
};

// Form submit handler
eventForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const event_type = document.getElementById("event_type").value;
    const user_id = document.getElementById("user_id").value;

    submitBtn.innerText = "📡 Producing...";
    submitBtn.disabled = true;

    try {
        await axios.post(`${API_URL}/events`, { event_type, user_id });

        eventForm.reset();

        console.log("Event produced");

        setTimeout(fetchEvents, 1500);
    } catch (error) {
        console.error("Error producing event:", error);
        alert("Failed to send event. Backend may be sleeping.");
    } finally {
        submitBtn.innerText = "Produce Event";
        submitBtn.disabled = false;
    }
});

// Initial load
fetchEvents();

// Auto refresh
setInterval(fetchEvents, 5000);