const express = require("express");
const router = express.Router();

const {
  getDashboardData,
  getAdminReports,
  updateReportStatus,
  deleteReport
} = require("../controllers/adminController");

router.get("/dashboard", getDashboardData);
router.get("/reports", getAdminReports);
router.patch("/reports/:id/status", updateReportStatus);
router.delete("/reports/:id", deleteReport);

module.exports = router;