const geminiAiService = require("../services/geminiAiService");
const Rating = require("../models/rating");
const User = require("../models/user");


exports.getRecommendations = async (req, res) => {
    try {
        if (!req.user) {
            return res.redirect("/login");
        }

        console.log("🔹user login", req.user._id); // שיניתי מ- req.user.userId ל- req.user._id

        // לשלוף את הדירוגים של המשתמש לפי ה-_id הנכון
        const userRatings = await Rating.find({ userId: req.user._id });

        console.log("🔹 Existing ratings", userRatings);

        if (!userRatings.length) {
            return res.render("recommendations", { recommendations: [], message: "🔴 לא נמצאו דירוגים קודמים, דרג סרטים כדי לקבל המלצות" });
        }

        // רשימת סרטים שהמשתמש דירג
        const ratedMovies = userRatings.map(r => r.movieId);
        
        console.log("🔹 מזהי סרטים מדורגים:", ratedMovies);

        // קבלת המלצות מ-Gemini AI
        const recommendations = await geminiAiService.getRecommendations(ratedMovies);

        console.log("🔹 המלצות שהתקבלו:", recommendations);

        res.render("recommendations", { 
            recommendations, 
            message: recommendations.length ? "🎬 הנה הסרטים שמבוססים על הדירוגים שלך" : "⚠️ לא נמצאו המלצות מתאימות" 
        });

    } catch (error) {
        console.error("❌Error retrieving recommendations", error);
        res.status(500).render("recommendations", { 
            recommendations: [], 
            message: "❌ Server error - please try again later" 
        });
    }
};
