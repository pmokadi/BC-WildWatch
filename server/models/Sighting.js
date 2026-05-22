// Sightings - Defines the structure of animal/ insect sighting report

const mongoose = require("mongoose");

const sightingSchema = new mongoose.Schema({
    // Will link the sighting to the student who reported it
    reporter: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    species: {
        type: String,
        required: true,
        enum: ["Snakes", "Bees", "Lizards", "Spiders", "Other"]
    },

    location: {
        type: String,
        required: true,
        trim: true
    },

    campus: {
        type: String,
        default: "Pretoria Campus"
    },

    notes: {
        type: String,
        trim: true
    },

    detailedLocation: {
        type: String,
        trim: true,
        default: ""
    },

    sightingDate: {
        type: Date,
        default: null
    },

    sightingTime: {
        type: String,
        default: null
    },

    photo: {
        type: String,
        default: null
    },

    //stores AI model result if student used the safety scanner
    prediction: {
        label: {
            type: String,
            default: null
        },
        confidence: {
            type: String,
            default: null
        }
    },

    status: {
        type: String,
        enum: ["Open", "Pending", "Reviewed", "Resolved"],
        default: "Open"
    }
},
{
    timestamps: true // Automatically add createdAt and updatedAt fields
});
 
module.exports = mongoose.model("Sighting", sightingSchema);
