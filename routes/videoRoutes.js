const express = require("express");
const router = express.Router();

const{getGallery,getMovieDetails,searchMovies,SearchPage}=require('../controllers/videoController');

// ✅ נתיב לגלריית הסרטים
router.get('/gallery', getGallery);

router.get('/movie/:id', getMovieDetails);


// נתיב להצגת דף החיפוש

router.get('/search',SearchPage);

router.get('/search/movies',searchMovies);


module.exports = router;
