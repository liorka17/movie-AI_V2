const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware'); // Ensure it's updated
const axios = require('axios');

router.get('/',(req,res)=>{
    res.render('home');
})
router.get('/register', (req, res) => {
    res.render('register');
});

router.get('/login', (req, res) => {
    res.render('login');
});




module.exports = router;