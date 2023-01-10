const express = require("express");
const {
  getJobDetail,
  getAllJobs,
  createNewJob,
  editJob,
  searchJobs,
} = require("../controllers/jobController");
const verifyToken = require("../middleware/authMiddleware");
const router = express.Router();

router.use(verifyToken);

router.get("/", getAllJobs);
router.get("/search", searchJobs);
router.get("/:id", getJobDetail);
router.post("/", createNewJob);
router.patch("/:id", editJob);

module.exports = router;
