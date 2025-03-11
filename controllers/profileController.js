const User = require("../models/user");

// הצגת פרופיל המשתמש
exports.getProfile = async (req, res) => {
    console.log("🔹 GET /profile called");
    console.log("🔹 User from JWT:", req.user);

    try {
        if (!req.user) {
            return res.redirect("/login");
        }

        const user = await User.findById(req.user.userId).select("username email");

        if (!user) {
            return res.status(404).render("profile", { error: "משתמש לא נמצא", user: null });
        }

        res.render("profile", { user });
    } catch (error) {
        console.error("❌ Error loading profile:", error);
        res.status(500).render("profile", { error: "שגיאת שרת", user: null });
    }
};

