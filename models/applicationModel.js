const mongoose = require("mongoose");
const { JSDOM } = require("jsdom");
const createDOMPurify = require("dompurify");
const {marked} = require("marked");
const dompurify = createDOMPurify(new JSDOM().window);

const applicationSchema = new mongoose.Schema(
  {
    applicant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },
    markedCoverLetter: String,
    resume: String,
    sanitizedCoverLetter: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

applicationSchema.pre("validate", function (next) {
  if (this.markedCoverLetter) {
    this.sanitizedCoverLetter = dompurify.sanitize(
      marked(this.markedCoverLetter)
    );
  }
  next();
});
module.exports = mongoose.model("Application", applicationSchema);
