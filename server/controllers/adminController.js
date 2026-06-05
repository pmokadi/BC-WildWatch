const Sighting = require("../models/Sighting");
const Incident = require("../models/Incident");

const getDashboardData = async (req, res) => {
  try {
    const totalSightings = await Sighting.countDocuments();
    const totalIncidents = await Incident.countDocuments();

    const pendingSightings = await Sighting.countDocuments({ status: "Pending" });
    const reviewedSightings = await Sighting.countDocuments({ status: "Reviewed" });
    const resolvedSightings = await Sighting.countDocuments({ status: "Resolved" });

    const openIncidents = await Incident.countDocuments({ status: "Open" });
    const inProgressIncidents = await Incident.countDocuments({ status: "In Progress" });
    const resolvedIncidents = await Incident.countDocuments({ status: "Resolved" });

    return res.status(200).json({
      success: true,
      message: "Dashboard data fetched successfully",
      data: {
        totalReports: totalSightings + totalIncidents,
        totalSightings,
        totalIncidents,
        pendingReports: pendingSightings + openIncidents + inProgressIncidents,
        reviewedReports: reviewedSightings,
        resolvedReports: resolvedSightings + resolvedIncidents
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error while fetching dashboard data",
      error: error.message
    });
  }
};

const getAdminReports = async (req, res) => {
  try {
    const sightings = await Sighting.find().sort({ createdAt: -1 });
    const incidents = await Incident.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "Admin reports fetched successfully",
      data: {
        sightings,
        incidents
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error while fetching admin reports",
      error: error.message
    });
  }
};

const updateReportStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, reportType } = req.body;

    if (!status || !reportType) {
      return res.status(400).json({
        success: false,
        message: "Status and reportType are required"
      });
    }

    let updatedReport = null;

    if (reportType === "sighting") {
      updatedReport = await Sighting.findByIdAndUpdate(
        id,
        { status },
        { new: true }
      );
    } else if (reportType === "incident") {
      updatedReport = await Incident.findByIdAndUpdate(
        id,
        { status },
        { new: true }
      );
    } else {
      return res.status(400).json({
        success: false,
        message: "Invalid reportType"
      });
    }

    if (!updatedReport) {
      return res.status(404).json({
        success: false,
        message: "Report not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Report status updated successfully",
      data: updatedReport
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error while updating report status",
      error: error.message
    });
  }
};

const deleteReport = async (req, res) => {
  try {
    const { id } = req.params;
    const { reportType } = req.body;

    if (!reportType) {
      return res.status(400).json({
        success: false,
        message: "reportType is required"
      });
    }

    let deletedReport = null;

    if (reportType === "sighting") {
      deletedReport = await Sighting.findByIdAndDelete(id);
    } else if (reportType === "incident") {
      deletedReport = await Incident.findByIdAndDelete(id);
    } else {
      return res.status(400).json({
        success: false,
        message: "Invalid reportType"
      });
    }

    if (!deletedReport) {
      return res.status(404).json({
        success: false,
        message: "Report not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Report deleted successfully"
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error while deleting report",
      error: error.message
    });
  }
};

module.exports = {
  getDashboardData,
  getAdminReports,
  updateReportStatus,
  deleteReport
};