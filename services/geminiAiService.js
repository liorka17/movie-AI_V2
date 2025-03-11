const axios = require("axios");

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent";
const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_API_URL = "https://api.themoviedb.org/3/movie/";

exports.getRecommendations = async (ratedMovies) => {
    try {
        if (!GEMINI_API_KEY || !TMDB_API_KEY) {
            console.error("❌ מפתחות API חסרים");
            return [];
        }

        const prompt = `
            אני רוצה שתמליץ לי על 20 סרטים דומים לסרטים הבאים בהתבסס על הדירוגים שלהם: ${ratedMovies.join(", ")}.
            החזר JSON תקף עם **ID הסרט** מ-TMDB, שם הסרט והתיאור.
            
            פורמט תקין לדוגמה:
            {
                "movies": [
                    {"id": "123", "title": "שם הסרט", "overview": "תקציר קצר"}
                ]
            }
        `;

        const response = await axios.post(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
            contents: [{ role: "user", parts: [{ text: prompt }] }]
        });

        console.log("🔹 תשובת Gemini API:", response.data);

        // בדיקה שהתשובה אינה ריקה
        const textResponse = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!textResponse || textResponse.trim() === "") {
            console.error("❌ תשובת Gemini ריקה");
            return [];
        }

        // ניקוי JSON לפני ה-parse
        const cleanedResponse = textResponse.replace(/```json|```/g, "").trim();

        // ניסיון להמיר את הטקסט ל-JSON
        let parsedResponse;
        try {
            parsedResponse = JSON.parse(cleanedResponse);
        } catch (error) {
            console.error("❌ שגיאה בהמרת JSON:", error.message);
            console.error("🔹 תשובה שהתקבלה:", cleanedResponse);
            return [];
        }

        // בדיקה שהתשובה מכילה מערך של סרטים
        if (!parsedResponse.movies || !Array.isArray(parsedResponse.movies)) {
            console.error("❌ פורמט JSON לא תקין");
            return [];
        }

        // שליפת תמונות מה-TMDB
        const moviesWithImages = await Promise.all(parsedResponse.movies.slice(0, 20).map(async (movie) => {
            try {
                const tmdbResponse = await axios.get(`${TMDB_API_URL}${movie.id}?api_key=${TMDB_API_KEY}&language=he`);
                return {
                    id: movie.id,
                    title: movie.title,
                    overview: movie.overview,
                    poster: `https://image.tmdb.org/t/p/w500${tmdbResponse.data.poster_path}`
                };
            } catch (err) {
                console.error(`❌ שגיאה בשליפת תמונה ל-${movie.title}:`, err.message);
                return { ...movie, poster: "/assets/default_poster.jpg" };
            }
        }));

        return moviesWithImages;

    } catch (error) {
        console.error("❌ שגיאה בקריאה ל-Gemini או TMDB API:", error.message);
        return [];
    }
};
