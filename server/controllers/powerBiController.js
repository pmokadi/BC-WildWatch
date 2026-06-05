const Sighting = require("../models/Sighting");
const Incident = require("../models/Incident");

const getSightingsForPowerBI = async (req, res) => {
  try {
    const sightings = await Sighting.find().sort({ createdAt: -1 });

    const formatted = sightings.map((item) => ({
      id: item._id,
      species: item.species || null,
      location: item.location || null,
      campus: item.campus || null,
      notes: item.notes || null,
      status: item.status || null,
      predictionLabel: item.prediction?.label || null,
      predictionConfidence: item.prediction?.confidence || null,
      imageUrl: item.imageUrl || null,
      dateTime: item.dateTime || null,
      createdAt: item.createdAt || null,
      updatedAt: item.updatedAt || null
    }));

    return res.status(200).json({
      success: true,
      data: formatted
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch sightings for Power BI",
      error: error.message
    });
  }
};

const getIncidentsForPowerBI = async (req, res) => {
  try {
    const incidents = await Incident.find().sort({ createdAt: -1 });

    const formatted = incidents.map((item) => ({
      id: item._id,
      location: item.location || null,
      urgency: item.urgency || null,
      description: item.situationDescription || null,
      mediaUrl: item.mediaUrl || null,
      status: item.status || null,
      adminNotes: item.adminNotes || null,
      dateTime: item.dateTime || null,
      createdAt: item.createdAt || null,
      updatedAt: item.updatedAt || null
    }));

    return res.status(200).json({
      success: true,
      data: formatted
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch incidents for Power BI",
      error: error.message
    });
  }
};

const getSummaryForPowerBI = async (req, res) => {
  try {
    const totalSightings = await Sighting.countDocuments();
    const totalIncidents = await Incident.countDocuments();

    const openSightings = await Sighting.countDocuments({ status: "Open" });
    const pendingSightings = await Sighting.countDocuments({ status: "Pending" });
    const reviewedSightings = await Sighting.countDocuments({ status: "Reviewed" });
    const resolvedSightings = await Sighting.countDocuments({ status: "Resolved" });

    const openIncidents = await Incident.countDocuments({ status: "Open" });
    const inProgressIncidents = await Incident.countDocuments({ status: "In Progress" });
    const resolvedIncidents = await Incident.countDocuments({ status: "Resolved" });

    return res.status(200).json({
      success: true,
      data: {
        totalReports: totalSightings + totalIncidents,
        totalSightings,
        totalIncidents,
        openReports: openSightings + openIncidents,
        pendingReports: pendingSightings + inProgressIncidents,
        reviewedReports: reviewedSightings,
        resolvedReports: resolvedSightings + resolvedIncidents
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch Power BI summary",
      error: error.message
    });
  }
};

module.exports = {
  getSightingsForPowerBI,
  getIncidentsForPowerBI,
  getSummaryForPowerBI
};