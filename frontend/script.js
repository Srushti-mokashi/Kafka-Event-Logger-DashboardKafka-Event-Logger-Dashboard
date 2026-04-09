// Switch between local backend and deployed backend
const API_URL =
window.location.hostname === "localhost" ||
window.location.hostname === "127.0.0.1"
? "http://localhost:3000/api"
: "https://kafka-event-logger-dashboardkafka-event.onrender.com/api";


// DOM Elements
const eventForm = document.getElementById("eventForm");
const eventsTable = document.getElementById("eventsTable");
const submitBtn = document.getElementById("submitBtn");

const totalEventsEl = document.getElementById("totalEvents");
const signupCountEl = document.getElementById("signupCount");
const orderCountEl = document.getElementById("orderCount");
const paymentCountEl = document.getElementById("paymentCount");

let typeChart;
let timelineChart;


// Fetch and display events
const fetchEvents = async () => {

try {

const response = await axios.get(`${API_URL}/events`);
const events = response.data;

eventsTable.innerHTML = "";

// If no events
if (!events || events.length === 0) {

eventsTable.innerHTML =
'<tr><td colspan="4" class="loading">No events recorded yet.</td></tr>';

return;
}


// Metrics counters
let signup = 0;
let orders = 0;
let payments = 0;

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

<td style="color:var(--text-muted); font-size:0.8rem;">
${new Date(event.created_at).toLocaleString()}
</td>
`;

eventsTable.appendChild(row);


// Count metrics
if(event.event_type.includes("signup")) signup++;
if(event.event_type.includes("order")) orders++;
if(event.event_type.includes("payment")) payments++;

});


// Update dashboard metrics
if(totalEventsEl) totalEventsEl.innerText = events.length;
if(signupCountEl) signupCountEl.innerText = signup;
if(orderCountEl) orderCountEl.innerText = orders;
if(paymentCountEl) paymentCountEl.innerText = payments;


// Update charts
renderCharts(events);

}

catch (error) {

console.error("Error fetching events:", error);

eventsTable.innerHTML =
'<tr><td colspan="4" class="loading">Error loading events</td></tr>';

}

};


// Format event type
const formatEventType = (type) => {

return type.replace(/_/g, " ").toUpperCase();

};


// Badge color helper
const getBadgeClass = (type) => {

if(type.includes("signup")) return "badge-purple";
if(type.includes("order")) return "badge-green";
if(type.includes("payment")) return "badge-green";

return "badge-blue";

};


// Submit new event
eventForm.addEventListener("submit", async (e) => {

e.preventDefault();

const event_type = document.getElementById("event_type").value;
const user_id = document.getElementById("user_id").value;

submitBtn.innerText = "Producing...";
submitBtn.disabled = true;

try {

await axios.post(`${API_URL}/events`, {
event_type,
user_id
});

eventForm.reset();

// refresh after Kafka consumer processes event
setTimeout(fetchEvents, 1200);

}

catch(error){

console.error("Error producing event:", error);

alert("Server may be waking up. Please try again.");

}

finally{

submitBtn.innerText = "Produce Event";
submitBtn.disabled = false;

}

});


// Chart rendering
function renderCharts(events){

const typeCounts = {};
const timelineCounts = {};

events.forEach((event)=>{

const type = event.event_type;

typeCounts[type] = (typeCounts[type] || 0) + 1;

const time = new Date(event.created_at).toLocaleTimeString();

timelineCounts[time] = (timelineCounts[time] || 0) + 1;

});


const typeLabels = Object.keys(typeCounts);
const typeData = Object.values(typeCounts);

const timeLabels = Object.keys(timelineCounts);
const timeData = Object.values(timelineCounts);


// Destroy previous charts
if(typeChart) typeChart.destroy();
if(timelineChart) timelineChart.destroy();


const ctx1 = document.getElementById("eventTypeChart").getContext("2d");
const ctx2 = document.getElementById("eventTimelineChart").getContext("2d");


// Event Type Chart
typeChart = new Chart(ctx1, {

type:"pie",

data:{
labels:typeLabels,

datasets:[{
label:"Events",
data:typeData,
backgroundColor:[
"#6366f1",
"#22c55e",
"#f59e0b",
"#ef4444",
"#8b5cf6"
]
}]
}

});


// Timeline Chart
timelineChart = new Chart(ctx2, {

type:"line",

data:{
labels:timeLabels,

datasets:[{
label:"Events Over Time",
data:timeData,
borderColor:"#22c55e",
backgroundColor:"rgba(34,197,94,0.2)",
tension:0.4
}]
},

options:{
scales:{
y:{
beginAtZero:true
}
}
}

});

}


// Initial load
fetchEvents();


// Auto refresh every 5s
setInterval(fetchEvents,5000);
