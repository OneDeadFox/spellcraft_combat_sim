const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/connection");

class MockUp extends Model { }

MockUp.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        card_type: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        hp: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        base_atk: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        atk_mod: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        base_def: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        def_mod: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        spd: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    },
    {
        sequelize,
    }
);

module.exports = MockUp