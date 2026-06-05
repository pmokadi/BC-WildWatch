const express = require("express");
const path = require("path");
const cors = require("cors");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

const connectDB = require("./config/db");
const Sighting = require("./models/Sighting");
const Incident = require("./models/Incident");

const authRoutes = require("./routes/authRoutes");
const reportRoutes = require("./routes/reportRoutes");
const adminRoutes = require("./routes/adminRoutes");
const powerBiRoutes = require("./routes/powerBiRoutes");

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "../public")));

app.get("/health", (req, res) => {
  res.json({ status: "ok", message: "BC WildWatch backend running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/powerbi", powerBiRoutes);

app.get("/api/sightings", async (req, res) => {
  try {
    const sightings = await Sighting.find().sort({ createdAt: -1 });
    res.json(sightings);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch sightings" });
  }
});

app.get("/api/incidents", async (req, res) => {
  try {
    const incidents = await Incident.find().sort({ createdAt: -1 });
    res.json(incidents);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch incidents" });
  }
});

app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`BC WildWatch running on http://localhost:${PORT}`);
  });
});
