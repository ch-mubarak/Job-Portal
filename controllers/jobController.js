const Job = require("../models/jobModel");

const postNewJob = async (req, res, next) => {
  const { userId, email } = req.user;
  const {
    title,
    description,
    email: recruiterEmail,
    skills,
    experience,
  } = req.body;
  if (!(title && description && recruiterEmail)) {
    throw new Error({
      message: "Title, description and email are mandatory",
      statusCode: 401,
    });
  }

  if (recruiterEmail !== email) {
    throw new Error({
      message: "Entered Email doesn't match with your registered email",
      statusCode: 401,
    });
  }
  try {
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

const getJobDetail = async (req, res) => {
  const { jobId } = req.params;
};
