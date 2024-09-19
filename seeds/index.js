const seedUnit = require('./unit-seeds');
const seedAvatar = require('./avatar-seeds');
const seedLetchin = require('./letchin-seeds');

const sequelize = require('../config/connection');

const seedAll = async () => {
    await sequelize.sync({force: true});
    console.log("\n----- DATABASE SYNCED -----\n");

    await seedUnit();
    console.log("\n----- ANIMA SEEDED -----\n");

    await seedAvatar();
    console.log("\n----- AVATAR SEEDED -----\n");

    await seedLetchin();
    console.log("\n----- LETCHIN SEEDED -----\n");

    process.exit(0);
};

seedAll();