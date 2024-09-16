// boiler plate taken from Joe's chirp example
const express = require('express');
const router = express.Router();

const simRoutes = require('./simController');
router.use("/", simRoutes);

module.exports = router;