const mongoose = require("mongoose");

const sightingSchema = new mongoose.Schema(
  {
    reporter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false
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
    dateTime: {
      type: Date,
      required: true
    },
    campus: {
      type: String,
      default: "Main Campus - Pretoria"
    },
    notes: {
      type: String,
      trim: true,
      default: ""
    },
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
    imageUrl: {
      type: String,
      default: null
    },
    status: {
      type: String,
      enum: ["Open", "Pending", "Reviewed", "Resolved"],
      default: "Open"
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Sighting", sightingSchema);