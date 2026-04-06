const API_URL = 'http://localhost:3000/api';

// DOM Elements
const eventForm = document.getElementById('eventForm');
const eventsTable = document.getElementById('eventsTable');
const submitBtn = document.getElementById('submitBtn');

// Function to fetch and display recent events
const fetchEvents = async () => {
    try {
        const response = await axios.get(`${API_URL}/events`);
        const events = response.data;

        // Clear the table
        eventsTable.innerHTML = '';

        if (events.length === 0) {
            eventsTable.innerHTML = '<tr><td colspan="4" style="text-align: center;">No events recorded yet.</td></tr>';
            return;
        }

        // Inject events into table
        events.forEach(event => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>#${event.id}</td>
                <td><span class="badge ${getBadgeClass(event.event_type)}">${formatEventType(event.event_type)}</span></td>
                <td>${event.user_id}</td>
                <td style="color: var(--text-muted); font-size: 0.8rem;">${new Date(event.timestamp).toLocaleString()}</td>
            `;
            eventsTable.appendChild(row);
        });
    } catch (error) {
        console.error('❌ Error fetching events:', error);
        // Do not crash the UI, just log the error
    }
};

// Helper to format event type labels
const formatEventType = (type) => {
    return type.replace(/_/g, ' ').toUpperCase();
};

// Helper to assign colors to event types
const getBadgeClass = (type) => {
    if (type.includes('signup')) return 'badge-purple';
    if (type.includes('order')) return 'badge-green';
    if (type.includes('payment')) return 'badge-green';
    return 'badge-blue';
};

// Handle form submission to produce events
eventForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const event_type = document.getElementById('event_type').value;
    const user_id = document.getElementById('user_id').value;

    // UI Feedback: Disable button
    submitBtn.innerText = '📡 Producing...';
    submitBtn.disabled = true;

    try {
        // Send POST request to backend
        await axios.post(`${API_URL}/events`, { event_type, user_id });

        // Clear form
        eventForm.reset();

        // UI Feedback: Success (Optional)
        console.log('✅ Event successfully sent to Kafka producer');

        // Fetch events after a short delay (to let consumer process)
        setTimeout(fetchEvents, 1500);

    } catch (error) {
        console.error('❌ Error producing event:', error);
        alert('Failed to send event. Is the backend running?');
    } finally {
        // Reset UI
        submitBtn.innerText = 'Produce Event';
        submitBtn.disabled = false;
    }
});

// Initial Fetch and Auto-refresh every 5 seconds
fetchEvents();
setInterval(fetchEvents, 5000);
