const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(express.static(path.join(__dirname, "../public")));

app.get("/health", (req, res) => {
  res.json({ status: "ok", message: "BC WildWatch backend running" });
});

app.listen(PORT, () => {
  console.log(`BC WildWatch running on http://localhost:${PORT}`);
});