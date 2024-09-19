const express = require("express");
const router = express.Router();
const Unit = require('../models/Unit');
const Avatar = require('../models/Avatar');
const Letchin = require('../models/Letchin');


router.get("/unit", (req, res) => {
    Unit.findAll().then(unitData => {
        return res.json(unitData);
    }).catch(err => {
        console.log(err);
        return res.status(500).json({msg: "No unit data found"});
    });
});

router.get('/unit/:id', (req, res) => {
    Unit.findByPk(req.params.id).then(unitData => {
        return res.json(unitData);
    }).catch(err => {
        console.log(err);
        return res.status(500).json({msg: "No unit data found with that id"});
    });
});

module.exports = router;
