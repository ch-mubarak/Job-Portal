const express = require("express");
const {
  getJobDetail,
  getAllJobs,
  createNewJob,
} = require("../controllers/jobController");
const verifyToken = require("../middleware/authMiddleware");
const router = express.Router();

router.use(verifyToken);

router.get("/", getAllJobs);
router.get("/:jobId", getJobDetail);
router.post("/", createNewJob);

module.exports = router;
