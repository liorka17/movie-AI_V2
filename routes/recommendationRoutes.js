const express = require("express");
const router = express.Router();
const recommendationController = require("../controllers/recommendationController");
const authMiddleware = require("../middleware/authMiddleware"); // כדי להבטיח שהמשתמש מחובר


const{}=require('../controllers/recommendationController');


router.get("/", authMiddleware, recommendationController.getRecommendations);

module.exports = router;
