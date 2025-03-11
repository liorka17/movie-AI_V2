const jwt = require('jsonwebtoken');
const User = require('../models/user');
require('dotenv').config();

module.exports = async (req, res, next) => {
    try {
        const token = req.cookies.token; // בדיקה האם יש טוקן בקוקיז
        if (!token) {
            console.log("❌ No token found.");
            return res.redirect('/login');
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET); // פענוח ה- JWT
        if (!decoded || !decoded.userId) {
            console.log("❌ Invalid JWT.");
            return res.redirect('/login');
        }

        const user = await User.findById(decoded.userId); // שליפת המשתמש מהמסד
        if (!user) {
            console.log("❌ User not found in database.");
            return res.redirect('/login');
        }

        req.user = user; // הוספת המשתמש לאובייקט הבקשה
        console.log("🔍 Loaded user from DB:", user);
        res.locals.user = user; // מאפשר לשימוש ישיר ב- EJS
        console.log("✅ Authenticated User:", user.username);
        next();
    } catch (error) {
        console.error("❌ Authentication error:", error.message);
        return res.redirect('/login');
    }
};
