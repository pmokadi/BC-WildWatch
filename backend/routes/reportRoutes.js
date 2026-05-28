const express = require("express");
const router = express.Router();
const {
  createSightingReport,
  createIncidentReport,
  getAllReports
} = require("../controllers/reportController");

router.post("/sighting", createSightingReport);
router.post("/incident", createIncidentReport);
router.get("/", getAllReports);

module.exports = router;