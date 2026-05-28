const mongoose = require("mongoose");

const incidentSchema = new mongoose.Schema(
  {
    reporter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false
    },
    location: {
      type: String,
      required: true,
      trim: true
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
    dateTime: {
      type: Date,
      required: true
    },
    mediaUrl: {
      type: String,
      default: null
    },
    status: {
      type: String,
      enum: ["Open", "In Progress", "Resolved"],
      default: "Open"
    },
    adminNotes: {
      type: String,
      default: ""
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Incident", incidentSchema);