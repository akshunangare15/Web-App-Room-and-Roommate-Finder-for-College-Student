const Sequelize = require('sequelize');

const sequelize = require('../config/database_sequelize');

const User = sequelize.define('user', {
    user_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    username: {
        type: Sequelize.STRING(32),
        allowNull: false,
    },
    firstname: {
        type: Sequelize.STRING(32),
        allowNull: false,
    },
    lastname: {
        type: Sequelize.STRING(32),
        allowNull: false,
    },
    phone: {
        type: Sequelize.STRING(32),
        allowNull: false,
    },
    email: {
        type: Sequelize.STRING(128),
        allowNull: false,
    },
    password: {
        type: Sequelize.STRING(256),
        allowNull: false,
    },
    usertype: {
        type: Sequelize.STRING(32),
        allowNull: false,
        defaultValue: 'user',
    },
}, {
    // freezeTableName: true,
});

module.exports = User;
