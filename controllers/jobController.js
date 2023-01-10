const Job = require("../models/jobModel");

const createNewJob = async (req, res, next) => {
  const { userId } = req.user;
  const { title, description, email, skills, experience } = req.body;
  try {
    if (!(title && description && email)) {
      res.status(401);
      throw new Error("Title, description and email are mandatory");
    }
    if (req.user.email !== email) {
      res.status(401);
      throw new Error("Entered Email doesn't match with your registered email");
    }
    if (!(experience && Number(experience))) {
      res.status(401);
      throw new Error("Invalid Experience only support numbers");
    }
    const newJob = await Job.create({
      employer: userId,
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
  const jobId = req.params.id;
  try {
    if (!jobId) {
      res.status(401);
      throw new Error("Invalid job id");
    }

    const job = await Job.findById(jobId).populate({
      path: "employer",
      select: "-password -_id -createdAt -updatedAt",
    });

    if (!job) {
      res.status(404);
      throw new Error("No job found");
    }
    res.status(200).json(job);
  } catch (err) {
    next(err);
  }
};

const getAllJobs = async (req, res, next) => {
  const limit = req.query.limit || 5;
  const skip = req.query.skip || 0;
  const experience = Number(req.query.experience);
  //checking skills query have multiple value or not
  const skills = Array.isArray(req.query.skills)
    ? [...req.query.skills]
    : [req.query.skills];
  const pipeline = [];

  // conditionally checking if filtering is enabled or not for skill
  if (req.query.skills) {
    console.log(skills);
    pipeline.push({
      $match: {
        skills: {
          $in: skills,
        },
      },
    });
  }

  // conditionally checking if filtering is enabled or not for experience
  if (experience || experience === 2) {
    pipeline.push({
      $match: {
        experience: {
          $lte: experience,
        },
      },
    });
  }

  pipeline.push(
    {
      $sort: {
        createdAt: -1,
      },
    },
    {
      $skip: skip,
    },
    {
      $limit: limit,
    },
    {
      $lookup: {
        from: "users",
        localField: "employer",
        foreignField: "_id",
        as: "employer",
      },
    },
    {
      $unwind: {
        path: "$employer",
      },
    },
    {
      $project: {
        "employer.password": false,
        "employer.createdAt": false,
        "employer.updatedAt": false,
        "employer._id": false,
      },
    }
  );
  try {
    const jobs = await Job.aggregate(pipeline);
    return res.status(200).json(jobs);
  } catch (err) {
    next(err);
  }
};

const editJob = async (req, res, next) => {
  try {
    const jobId = req.params.id;
    const { userId } = req.user;
    const { title, description, skills, experience } = req.body;
    const job = await Job.findById(jobId).populate({ path: "employer" });
    if (!job) {
      res.status(404);
      throw new Error("Invalid job id");
    }
    if (job.employer.id !== userId) {
      res.status(401);
      throw new Error("Your not authorized");
    }

    const updatedJob = await Job.findByIdAndUpdate(
      jobId,
      {
        title,
        experience,
        skills,
        description,
      },
      { new: true }
    ).populate({ path: "employer", select: "-password -createdAt -updatedAt" });
    res
      .status(201)
      .json({ message: "job details updated successfully", job: updatedJob });
  } catch (err) {
    next(err);
  }
};

const searchJobs = async (req, res, next) => {
  try {
    const keyword = req.query.name;
    const jobs = await Job.find({
      $or: [
        { title: { $regex: keyword, $options: "i" } },
        { skills: { $in: [keyword] } },
      ],
    });
    res.status(200).json(jobs);
  } catch (err) {
    console.log(err);
    next(err);
  }
};

module.exports = {
  createNewJob,
  getJobDetail,
  getAllJobs,
  editJob,
  searchJobs,
};
