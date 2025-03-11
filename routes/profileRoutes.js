const express = require("express");
const router = express.Router();
const profileController = require("../controllers/profileController");


// ✅ הנתיב עכשיו יהיה `/profile`
router.get("/", profileController.getProfile);

module.exports = router;
