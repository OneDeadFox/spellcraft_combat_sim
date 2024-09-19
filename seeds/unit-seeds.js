const Unit = require('../models/Unit.js');
const fs = require('fs');

//collect seeds from json file
const pulledUnitData = JSON.parse(fs.readFileSync('./db/JSONs/unitJSON.json'));

//create a seeding function that will run when called in the index.js
const seedUnit = () => Unit.bulkCreate(pulledUnitData);

module.exports = seedUnit;