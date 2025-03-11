const axios = require("axios");

const TMDB_API_KEY = process.env.TMDB_API_KEY; // ודא שזה מוגדר בקובץ `.env`
const TMDB_BASE_URL = "https://api.themoviedb.org/3";

// פונקציה לקבלת סרטים פופולריים
exports.getPopularMovies = async (page = 1) => {
    try {
        const response = await axios.get(`${TMDB_BASE_URL}/movie/popular`, {
            params: {
                api_key: TMDB_API_KEY,
                language: "he-IL",
                page
            }
        });

        return response.data.results;
    } catch (error) {
        console.error("❌ Error fetching popular movies:", error);
        return [];
    }
};

// ✅ קבלת פרטי סרט לפי ID
exports.getMovieById = async (movieId) => {
    try {
        const response = await axios.get(`${TMDB_BASE_URL}/movie/${movieId}`, {
            params: {
                api_key: TMDB_API_KEY,
                language: "he-IL"
            }
        });
        return response.data;
    } catch (error) {
        console.error("❌ Error fetching movie details:", error);
        return null;
    }
};

// ✅ קבלת טריילר סרט
exports.getMovieTrailer = async (movieId) => {
    try {
        const response = await axios.get(`${TMDB_BASE_URL}/movie/${movieId}/videos`, {
            params: {
                api_key: TMDB_API_KEY
            }
        });

        // מציאת הטריילר הראשון מסוג "Trailer"
        const trailer = response.data.results.find(video => video.type === "Trailer" && video.site === "YouTube");
        return trailer ? `https://www.youtube.com/embed/${trailer.key}` : null;
    } catch (error) {
        console.error("❌ Error fetching movie trailer:", error);
        return null;
    }
};