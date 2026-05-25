const express = require("express");
const path = require("path");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
require("dotenv").config({ path: require("path").join(__dirname, "../.env") });
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");

const app = express();
const PORT = process.env.PORT || 8080;

// Rate limiting - max 100 requests per 15 minutes
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests, please try again later",
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(limiter);
app.use(express.static(path.join(__dirname, "../public")));

// Routes
app.use("/api/auth", authRoutes);

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok", message: "BC WildWatch backend running" });
});

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`BC WildWatch running on http://localhost:${PORT}`);
  });
});