const express = require("express");
const router = express.Router();

const{getGallery,getMovieDetails,searchMovies,SearchPage,getSiteStats}=require('../controllers/videoController');

// ✅ נתיב לגלריית הסרטים
router.get('/gallery', getGallery);

router.get('/movie/:id', getMovieDetails);


// נתיב להצגת דף החיפוש

router.get('/search',SearchPage);

router.get('/search/movies',searchMovies);

router.get("/stats", getSiteStats);

module.exports = router;
