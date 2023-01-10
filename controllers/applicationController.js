const mongoose = require("mongoose");
const Application = require("../models/applicationModel");
const Job = require("../models/jobModel");

const applyJob = async (req, res, next) => {
  try {
    const jobId = req.params.id;
    const applicant = req.user.userId;
    const { resume, coverLetter } = req.body;
    if (!(resume && coverLetter)) {
      res.status(401);
      throw new Error("All fields are required");
    }
    const application = await Application.create({
      jobId,
      applicant,
      resume,
      coverLetter,
    });
    res
      .status(201)
      .json({ message: "application submitted successfully", application });
  } catch (err) {
    next(err);
  }
};

const getApplicants = async (req, res, next) => {
  try {
    const jobId = req.params.id;
    const { userId } = req.user;
    const job = await Job.findById(jobId);
    if (!job) {
      res.status(404);
      throw new Error("Invalid job id");
    }
    if (job.author.toString() !== userId) {
      res.status(401);
      throw new Error("Your not authorized");
    }
    const applicants = await Application.aggregate([
      {
        $match: {
          jobId: mongoose.Types.ObjectId("63bd2096428be45578204db0"),
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "applicant",
          foreignField: "_id",
          as: "applicant",
        },
      },
      {
        $unwind: {
          path: "$applicant",
        },
      },
      {
        $project: {
          "applicant.password": false,
          "applicant._id": false,
          "applicant.createdAt": false,
          "applicant.updatedAt": false,
        },
      },
    ]);
    res.status(200).json(applicants);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  applyJob,
  getApplicants,
};
