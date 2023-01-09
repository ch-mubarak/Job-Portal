const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema({
  applicant: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
  },
  jobId: {
    type: mongoose.Types.ObjectId,
    ref: "Job",
    required: true,
  },
  coverLetter: String,
  resume: String,
});

module.exports = mongoose.model("Application", applicationSchema);
