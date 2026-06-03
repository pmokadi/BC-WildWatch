const express = require("express");
const path = require("path");
require("dotenv").config({ path: require("path").join(__dirname, "../.env") });
const connectDB = require("./config/db");
const Sighting = require("./models/Sighting");
const Incident = require("./models/Incident");

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(express.static(path.join(__dirname, "../public")));

app.get("/health", (req, res) => {
  res.json({ status: "ok", message: "BC WildWatch backend running" });
});

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

app.get("/api/reports", async (req, res) => {
  try {
    const [sightings, incidents] = await Promise.all([
      Sighting.find().sort({ createdAt: -1 }),
      Incident.find().sort({ createdAt: -1 })
    ]);

    const tagged = [
      ...sightings.map(s => ({ ...s.toObject(), reportType: "Sighting" })),
      ...incidents.map(i => ({ ...i.toObject(), reportType: "Incident" }))
    ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.json(tagged);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch reports" });
  }
});

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`BC WildWatch running on http://localhost:${PORT}`);
  });
});