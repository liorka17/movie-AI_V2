const mongoose = require('mongoose'); // מייבא את mongoose כדי לעבוד עם MongoDB
require('dotenv').config(); // טוען את משתני הסביבה מקובץ .env

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, { 
            useNewUrlParser: true, 
            useUnifiedTopology: true
        });

        console.log(`✅ MongoDB connected: ${conn.connection.host}`); // מציג כתובת של ה-DB שהתחברת אליו
    } catch (error) {
        console.error("❌ MongoDB connection failed:", error.message);
        
        // במידה והחיבור נכשל - ניסיון נוסף לאחר 5 שניות
        setTimeout(connectDB, 5000);
    }
};

module.exports = connectDB; // מייצא את הפונקציה כדי שנוכל להשתמש בה בקבצים אחרים
