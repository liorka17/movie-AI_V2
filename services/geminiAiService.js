const axios = require("axios");

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateText";

exports.getRecommendations = async (ratedMovies) => {
    try {
        if (!GEMINI_API_KEY) {
            console.error("❌ מפתח API חסר");
            return [];
        }

        const prompt = `
            אני רוצה שתמליץ לי על סרטים דומים לסרטים הבאים בהתבסס על הדירוגים שלהם: ${ratedMovies.join(", ")}.
            החזר רשימה של 5 סרטים לכל היותר בתור מערך JSON עם שמות הסרטים בלבד.
        `;

        const response = await axios.post(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
            prompt: { text: prompt }
        });

        console.log("🔹 תשובת Gemini API:", response.data);

        return response.data.candidates?.[0]?.output || [];
    } catch (error) {
        console.error("❌ שגיאה בקריאה ל-Gemini API:", error);
        return [];
    }
};
