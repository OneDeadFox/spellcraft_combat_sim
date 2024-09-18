const Avatar = require('../models/Avatar.js');
const fs = require('fs');

//collect seeds from json file
const pulledAvatarData = JSON.parse(fs.readFileSync('./db/JSONs/avatarJSON.json'));

//create a seeding function that will run when called in the index.js
const seedAvatar = () => Avatar.bulkCreate(pulledAvatarData);

module.exports = seedAvatar;