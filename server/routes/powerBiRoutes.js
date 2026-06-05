const express = require("express");
const router = express.Router();

const {
  getSightingsForPowerBI,
  getIncidentsForPowerBI,
  getSummaryForPowerBI
} = require("../controllers/powerBiController");

router.get("/sightings", getSightingsForPowerBI);
router.get("/incidents", getIncidentsForPowerBI);
router.get("/summary", getSummaryForPowerBI);

module.exports = router;