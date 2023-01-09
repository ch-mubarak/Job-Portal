const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
  author: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  skills: [],
  experience: Number,
});

module.exports = mongoose.model("Job", jobSchema);
