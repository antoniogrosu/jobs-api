const mongoose = require("mongoose");

const JobSchema = new mongoose.Schema(
  {
    company: {
      type: String,
      required: [true, "Please provide a company name"],
      maxlength: 50,
    },
    position: {
      type: String,
      required: [true, "Please provide job position"],
      maxlength: 200,
    },
    status: {
      type: String,
      enum: ["interview", "declined", "pending"],
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Job", JobSchema);
