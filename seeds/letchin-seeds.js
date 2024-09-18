const Letchin = require('../models/Letchin.js');
const fs = require('fs');

//collect seeds from json file
const pulledLetchinData = JSON.parse(fs.readFileSync('./db/JSONs/letchinJSON.json'));

//create a seeding function that will run when called in the index.js
const seedLetchin = () => Letchin.bulkCreate(pulledLetchinData);

module.exports = seedLetchin;