const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
        return res.render("sim");
});

router.get("/all-anima", (req, res) => {
        return res.render("all-anima");
});

module.exports = router;