//Incident - Defines the structure of an emergency incident report when a student has direct encounter with a dangerous animal/insect

const mongoose = require("mongoose");

const incidentSchema = new mongoose.Schema({
    // will link the incident to student who reported it
    reporter: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    urgency: {
        type: String,
        required: true,
        enum: ["Low", "Medium", "High"]
    },

    situationDescription: {
        type: String,
        required: true,
        trim: true
    },

    // path to uploaded image/video attached by user
    mediaUrl: {
        type: String,
        default: null
    },

    campus: {
        type: String,
        default: "Pretoria Campus"
    },

    buildingArea: {
        type: String,
        trim: true,
        default: ""
    },

    peopleAtRisk: {
        type: Number,
        default: 0
    },

    status: {
        type: String,
        enum: ["Open", "In Progress", "Resolved"],
        default: "Open"
    },

    // admin can add notes when reviewing the incident
    adminNotes: {
        type: String,
        default: ""
    }
},
{
    timestamps: true // Automatically add createdAt and updatedAt fields
});

module.exports = mongoose.model("Incident", incidentSchema);
