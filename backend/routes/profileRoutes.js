const express = require("express");
const { getProfile, updatePersonal, updateEducation } = require("../controllers/profileController");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

router.get("/", authMiddleware, getProfile);
router.put("/personal", authMiddleware, updatePersonal);
router.put("/education", authMiddleware, updateEducation);

module.exports = router;
