const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Master database object holding live data streams
let latestSensorData = {
  waterLevel: 65,
  flowRate: 14.2,
  leakDetected: false,
  motorStatus: "OFF",
  predictedHoursLeft: 4.1 
};

// AI Prediction Algorithm: computes hours left based on consumption velocity
function calculateAIPrediction(level, flow) {
  if (level <= 0) return 0;
  if (flow <= 0) return 24; // If no water flows, assume it safely lasts a day
  
  let hoursLeft = (level * 0.9) / (flow * 0.15);
  return parseFloat(hoursLeft.toFixed(1)); // round to 1 decimal place (e.g., 4.1)
}

// 1. GET ROUTE: React Frontend checks this to display numbers on the cards
app.get('/api/data', (req, res) => {
  // Automatically update the AI calculation right before sending data to dashboard
  latestSensorData.predictedHoursLeft = calculateAIPrediction(
    latestSensorData.waterLevel, 
    latestSensorData.flowRate
  );
  res.json(latestSensorData); 
});

// 2. POST ROUTE: ESP32 Hardware updates real sensor metrics here
app.post('/api/update', (req, res) => {
  latestSensorData = {
    waterLevel: req.body.waterLevel ?? latestSensorData.waterLevel,
    flowRate: req.body.flowRate ?? latestSensorData.flowRate,
    leakDetected: req.body.leakDetected ?? latestSensorData.leakDetected,
    motorStatus: req.body.motorStatus ?? latestSensorData.motorStatus
  };
  console.log("📥 Hardware Update Sync Complete:", latestSensorData);
  res.send("Data received!");
});

// 3. POST ROUTE: Frontend Dashboard tells the server to turn motor ON or OFF
app.post('/api/motor', (req, res) => {
  const { status } = req.body;
  latestSensorData.motorStatus = status;
  console.log(`🔌 Control Command: Relay changed to ${status}`);
  res.json({ success: true, currentStatus: latestSensorData.motorStatus });
});

app.listen(PORT, () => {
  console.log(`🚀 AquaMind Core actively listening on http://localhost:${PORT}`);
});