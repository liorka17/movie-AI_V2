const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware'); // Ensure it's updated
const axios = require('axios');

const videoController = require("../controllers/videoController");

exports.HomePage = async (req, res) => {
    try {
        // שליפת סטטיסטיקות על הסרטים
        const stats = await videoController.getSiteStats();

        res.render("home", {
            totalMovies: stats.totalMovies || 0,
            topTrendingMovie: stats.topTrendingMovie || null,
            mostPopularGenre: stats.mostPopularGenre || "לא ידוע",
        });
    } catch (error) {
        console.error("❌ שגיאה בטעינת דף הבית:", error.message);
        res.render("home", { totalMovies: 0, topTrendingMovie: null, mostPopularGenre: "לא ידוע" });
    }
};


exports.RegisterPage = (req, res) => {
    res.render("register");
};

exports.LoginPage = (req, res) => {
    res.render("login");
};
