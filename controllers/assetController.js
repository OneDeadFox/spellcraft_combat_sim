const express = require("express");
const router = express.Router();
const Unit = require('../models/Unit');
const Avatar = require('../models/Avatar');
const Letchin = require('../models/Letchin');
const MockUp = require('../models/MockUp');


router.get("/unit", async (req, res) => {
    try {
        const unitData = await Unit.findAll();
        res.json(unitData);
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Error getting all Units!" });
    }
});

router.get('/unit/:id', (req, res) => {
    Unit.findByPk(req.params.id).then(unitData => {
        return res.json(unitData);
    }).catch(err => {
        console.log(err);
        return res.status(500).json({msg: "No unit data found with that id"});
    });
});

router.get("/avatar", async (req, res) => {
    try {
        const avatarData = await Avatar.findAll();
        res.json(avatarData);
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Error getting all Avatars!" });
    }
});

router.get('/avatar/:id', (req, res) => {
    Avatar.findByPk(req.params.id).then(avatarData => {
        return res.json(avatarData);
    }).catch(err => {
        console.log(err);
        return res.status(500).json({msg: "No avatar data found with that id"});
    });
});

router.get("/letchin", async (req, res) => {
    try {
        const letchinData = await Letchin.findAll();
        res.json(letchinData);
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Error getting all Letchins!" });
    }
});

router.get('/letchin/:id', (req, res) => {
    Letchin.findByPk(req.params.id).then(letchinData => {
        return res.json(letchinData);
    }).catch(err => {
        console.log(err);
        return res.status(500).json({msg: "No letchin data found with that id"});
    });
});

router.get("/mockup", async (req, res) => {
    try {
        const mockUpData = await MockUp.findAll();
        res.json(mockUpData);
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Error getting all MockUps!" });
    }
});
module.exports = router;
