const Job = require("../models/jobModel");

const createNewJob = async (req, res, next) => {
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
      author: req.user._id,
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
  const { id } = req.params;
  try {
    if (!id) {
      res.status(401);
      throw new Error("Invalid job id");
    }

    const job = await Job.findById(id).populate({
      path: "author",
      select: "-password -_id",
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
  if (skills) {
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
        localField: "author",
        foreignField: "_id",
        as: "author",
      },
    },
    {
      $unwind: {
        path: "$author",
      },
    },
    {
      $project: {
        "author.password": false,
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

module.exports = {
  createNewJob,
  getJobDetail,
  getAllJobs,
};
