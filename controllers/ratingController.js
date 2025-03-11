const Rating = require("../models/rating");

exports.submitRating = async (req, res) => {
    try {
        console.log("🔹 POST /rating/submit called");
        console.log("📌 נתונים שהתקבלו:", req.body);
        console.log("📌 משתמש מחובר:", req.user);

        const { movieId, rating } = req.body;
        const userId = req.user?.userId;

        if (!movieId || !userId || !rating) {
            console.error("❌ Missing required fields:", { movieId, userId, rating });
            return res.status(400).send("❌ חסרים נתונים.");
        }

        let existingRating = await Rating.findOne({ movieId, userId });

        if (existingRating) {
            existingRating.rating = rating;
            await existingRating.save();
        } else {
            const newRating = new Rating({ movieId, userId, rating });
            await newRating.save();
        }

        // ✅ נוסיף הודעת הצלחה וניווט חזרה לעמוד הסרט
        res.redirect(`/video/movie/${movieId}?success=true`);
    } catch (error) {
        console.error("❌ Error saving rating:", error);
        res.status(500).send("שגיאה בשמירת הדירוג.");
    }
};
