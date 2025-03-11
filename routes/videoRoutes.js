const express = require("express");
const router = express.Router();
const videoController = require("../controllers/videoController");

// ✅ נתיב לגלריית הסרטים
router.get("/gallery", videoController.getGallery);

router.get("/movie/:id", videoController.getMovieDetails);


// נתיב להצגת דף החיפוש
router.get('/search', (req, res) => {
    res.render('search'); // קובץ `views/search.ejs`
});
router.get('/search/movies', videoController.searchMovies);


module.exports = router;
