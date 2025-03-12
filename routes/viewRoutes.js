const express = require("express");
const router = express.Router();
const{HomePage,RegisterPage,LoginPage} = require("../controllers/viewController");

// דף הבית
router.get("/", HomePage);

// דף הרשמה
router.get("/register", RegisterPage);

// דף התחברות
router.get("/login", LoginPage);


module.exports = router;