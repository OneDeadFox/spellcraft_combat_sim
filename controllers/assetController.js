const express = require("express");
const router = express.Router();
const {Anima, Avatar, Letchin} = require('../models');


router.get("/", (req, res) => {
    if (!req.session.userId) {
        return res.render("sim")
    }
})

module.exports = router;
