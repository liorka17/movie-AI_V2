const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware'); // Ensure it's updated
const axios = require('axios');

exports.HomePage = (req, res) => {
    res.render("home");
};

exports.RegisterPage = (req, res) => {
    res.render("register");
};

exports.LoginPage = (req, res) => {
    res.render("login");
};
