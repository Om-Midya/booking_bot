const { Sequelize, DataTypes } = require('sequelize');
const config = require('../config/config.json')['development'];

const sequelize = new Sequelize(config.database, config.username, config.password, {
    host: config.host,
    dialect: config.dialect
});

const Conversation = sequelize.define('Conversation', {
    userId: {
        type: DataTypes.STRING,
        allowNull: false
    },
    userMessage: {
        type: DataTypes.STRING,
        allowNull: false
    },
    botResponse: {
        type: DataTypes.TEXT,
        allowNull: false,

    }
});

sequelize.sync();

module.exports = { Conversation, sequelize };
