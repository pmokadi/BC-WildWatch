const express = require("express");
const path = require("path");
require("dotenv").config({ path: require("path").join(__dirname, "../.env") });
const connectDB = require("./config/db");

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(express.static(path.join(__dirname, "../public")));

app.get("/health", (req, res) => {
  res.json({ status: "ok", message: "BC WildWatch backend running" });
});

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`BC WildWatch running on http://localhost:${PORT}`);
  });
});