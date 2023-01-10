const Job = require("../models/jobModel");

const createNewJob = async (req, res, next) => {
  const { userId, email } = req.user;
  const {
    title,
    description,
    email: recruiterEmail,
    skills,
    experience,
  } = req.body;
  try {
    if (!(title && description && recruiterEmail)) {
      res.status(401);
      throw new Error("Title, description and email are mandatory");
    }
    if (recruiterEmail !== email) {
      res.status(401);
      throw new Error("Entered Email doesn't match with your registered email");
    }
    const newJob = await Job.create({
      author: userId,
      title,
      description,
      skills,
      experience,
    });

    res
      .status(201)
      .json({ message: "New Job Created successfully", job: newJob });
  } catch (err) {
    next(err);
  }
};

const getJobDetail = async (req, res, next) => {
  const { jobId } = req.params;
  try {
    if (!jobId) {
      res.status(401);
      throw new Error("Invalid job id");
    }
    const job = await Job.findById(jobId)
      .populate(author)
      .select({ "author.password": 0 });
    if (!job) {
      return res.status(404).json({ message: "No job found" });
    }
  } catch (err) {
    next(err);
  }
};

const getAllJobs = async (req, res) => {
  const limit = req.query.limit || 5;
  const skip = req.query.skip || 0;
  try {
    const jobs = await Job.find();
    return res.status(200).json(jobs);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createNewJob,
  getJobDetail,
  getAllJobs,
};
