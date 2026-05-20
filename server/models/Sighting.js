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
        type: string,
        required: true,
        enum: ["Snakes", "Bees", "Lizards", "Spiders", "Other"]
    },

    location: {
        type: string,
        required: true,
        trim: true
    },

    campus: {
        type: string,
        default: "Main Campus - Pretoria"
    },

    notes: {
        type: string,
        trim: true
    },

    //stores AI model result if student used the safety scanner
    prediction: {
        label: {
            type: string,
            default: null
        },
        confidence: {
        type: string,
        default: null
        }
    },

    status: {
        type: string,
        enum: ["Open", "Pending", "Reviewed", "Resolved"],
        default: "Open"
    }
},
{
    timestamps: true // Automatically add createdAt and updatedAt fields
});

module.exports = moongoose.model("Sighting", sightingSchema);
