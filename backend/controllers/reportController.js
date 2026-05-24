const Sighting = require("../models/Sighting");
const Incident = require("../models/Incident");

const createSightingReport = async (req, res) => {
  try {
    const { animalType, location, dateTime, notes, imageUrl } = req.body;

    if (!animalType || !location || !dateTime) {
      return res.status(400).json({
        success: false,
        message: "Animal type, location, and date/time are required"
      });
    }

    const speciesMap = {
      Snake: "Snakes",
      Snakes: "Snakes",
      Bee: "Bees",
      Bees: "Bees",
      Lizard: "Lizards",
      Lizards: "Lizards",
      Spider: "Spiders",
      Spiders: "Spiders",
      Other: "Other"
    };

    const sighting = await Sighting.create({
      species: speciesMap[animalType] || "Other",
      location,
      dateTime,
      notes: notes || "",
      imageUrl: imageUrl || null,
      prediction: {
        label: null,
        confidence: null
      },
      status: "Open"
    });

    return res.status(201).json({
      success: true,
      message: "Sighting report submitted successfully",
      data: sighting
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error while creating sighting report",
      error: error.message
    });
  }
};

const createIncidentReport = async (req, res) => {
  try {
    const { location, description, urgencyLevel, dateTime, imageUrl } = req.body;

    if (!location || !description || !urgencyLevel || !dateTime) {
      return res.status(400).json({
        success: false,
        message: "Location, description, urgency level, and date/time are required"
      });
    }

    const incident = await Incident.create({
      location,
      urgency: urgencyLevel,
      situationDescription: description,
      dateTime,
      mediaUrl: imageUrl || null,
      status: "Open"
    });

    return res.status(201).json({
      success: true,
      message: "Incident report submitted successfully",
      data: incident
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error while creating incident report",
      error: error.message
    });
  }
};

const getAllReports = async (req, res) => {
  try {
    const sightings = await Sighting.find().sort({ createdAt: -1 });
    const incidents = await Incident.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "Reports fetched successfully",
      data: {
        sightings,
        incidents
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error while fetching reports",
      error: error.message
    });
  }
};

module.exports = {
  createSightingReport,
  createIncidentReport,
  getAllReports
};