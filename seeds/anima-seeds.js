const Anima = require('../models/Anima.js');
const fs = require('fs');

//collect seeds from json file
const pulledAnimaData = JSON.parse(fs.readFileSync('./db/JSONs/animaJSON.json'));

//create a seeding function that will run when called in the index.js
const seedAnima = () => Anima.bulkCreate(pulledAnimaData);

module.exports = seedAnima;