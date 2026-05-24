const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true
    },
    subject: {
      type: String,
      required: true,
      enum: [
        "Technical Support (AI Scanner)",
        "Reporting System Question",
        "App Suggestion/Feedback",
        "Safety Awareness Request",
        "Other"
      ]
    },
    message: {
      type: String,
      required: true,
      trim: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Contact", contactSchema);