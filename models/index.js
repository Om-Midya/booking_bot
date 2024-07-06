const { Sequelize, DataTypes } = require('sequelize');
const config = require('../config/config.json')['development'];

const sequelize = new Sequelize(config.database, config.username, config.password, {
    host: config.host,
    dialect: config.dialect
});

const Booking = sequelize.define('Booking', {
    roomId: { type: DataTypes.INTEGER, allowNull: false },
    fullName: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false },
    nights: { type: DataTypes.INTEGER, allowNull: false }
});

sequelize.sync();

module.exports = { Booking, sequelize };
