const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/connection");

class Unit extends Model { }

Unit.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        number: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: true,
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
        rarity: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        element_type: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        ability: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        race: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        anima_class: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        cost: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        card_class: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        casting_rng: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        plot_spd: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        hp: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        atk: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        def: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        spd: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        movement: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        size: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        action: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        slot: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        marker: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        sequelize,
    }
);

module.exports = Unit