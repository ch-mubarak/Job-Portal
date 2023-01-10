const express = require("express");
const { getApplicants, applyJob } = require("../controllers/applicationController");
const verifyToken = require("../middleware/authMiddleware");
const router = express();

router.use(verifyToken);

router.get("/:id", getApplicants);
router.post("/:id", applyJob);
module.exports = router;
