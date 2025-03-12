const tmdbService = require("../services/tmdbbApiService");
const axios=require('axios');

// ✅ פונקציה לטעינת גלריית הסרטים
exports.getGallery = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1; // ברירת מחדל: עמוד 1
        const movies = await tmdbService.getPopularMovies(page); // שליפת הסרטים מה-API

        res.render("gallery", { movies, page });
    } catch (error) {
        console.error("❌ Error loading gallery:", error);
        res.status(500).render("gallery", { movies: [], page: 1 });
    }
};



// ✅ שליפת פרטי סרט לפי ID
exports.getMovieDetails = async (req, res) => {
    try {
        const movieId = req.params.id;
        const movie = await tmdbService.getMovieById(movieId);
        const trailer = await tmdbService.getMovieTrailer(movieId);

        res.render("movieDetails", {
            movie,
            trailer,
            user: req.user,
            success: req.query.success || false // ✅ מעביר את success מה-URL לתוך התבנית
        });
    } catch (error) {
        console.error("❌ Error fetching movie details:", error);
        res.status(500).send("שגיאה בטעינת פרטי הסרט");
    }
};

//פונקציה לנתיב חיפוש
exports.SearchPage = (req, res) => {
    res.render("search");
};

//פונקצית חיפוש
exports.searchMovies = async (req, res) => {
    try {
        const query = req.query.query;
        if (!query) {
            return res.status(400).json({ message: "❌ חייב להזין מונח חיפוש" });
        }

        const response = await axios.get(`https://api.themoviedb.org/3/search/movie`, {
            params: {
                api_key: process.env.TMDB_API_KEY, 
                query: query,
                language: "he-IL"
            }
        });

        res.json(response.data);
    } catch (error) {
        console.error("❌ שגיאה בחיפוש סרטים:", error);
        res.status(500).json({ message: "שגיאת שרת." });
    }
};



exports.getSiteStats = async () => {
    try {
        const TMDB_API_KEY = process.env.TMDB_API_KEY;

        // 🔹 קבלת כמות הסרטים הפופולריים
        const moviesResponse = await axios.get(
            `https://api.themoviedb.org/3/movie/popular?api_key=${TMDB_API_KEY}&language=he-IL&page=1`
        );
        const totalMovies = moviesResponse.data.total_results || 0;

        // 🔹 הסרט הכי נצפה השבוע
        const trendingResponse = await axios.get(
            `https://api.themoviedb.org/3/trending/movie/week?api_key=${TMDB_API_KEY}&language=he-IL`
        );
        const topTrendingMovie = trendingResponse.data.results[0] || null;

        // 🔹 הז'אנר הפופולרי ביותר
        const genresResponse = await axios.get(
            `https://api.themoviedb.org/3/genre/movie/list?api_key=${TMDB_API_KEY}&language=he-IL`
        );
        const genres = genresResponse.data.genres;
        const genreCounts = {};

        moviesResponse.data.results.forEach(movie => {
            movie.genre_ids.forEach(genreId => {
                genreCounts[genreId] = (genreCounts[genreId] || 0) + 1;
            });
        });

        const mostPopularGenreId = Object.keys(genreCounts).reduce((a, b) => genreCounts[a] > genreCounts[b] ? a : b);
        const mostPopularGenre = genres.find(g => g.id == mostPopularGenreId)?.name || "לא ידוע";

        return {
            totalMovies,
            topTrendingMovie,
            mostPopularGenre
        };

    } catch (error) {
        console.error("❌ שגיאה בקבלת סטטיסטיקות:", error.message);
        return { totalMovies: 0, topTrendingMovie: null, mostPopularGenre: "לא ידוע" };
    }
};

