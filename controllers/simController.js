const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    if (!req.session.userId) {
        return res.render("sim")
    }
})

module.exports = router;
