const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    console.log("home");
        return res.render("sim");
})

module.exports = router;