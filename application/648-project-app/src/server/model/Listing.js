const { Sequelize, Deferrable } = require('sequelize');

const sequelize = require('../config/database_sequelize');
const User = require('./User');

const Listing = sequelize.define('listing', {
    listing_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'user_id',
            deferrable: Deferrable.INITIALLY_IMMEDIATE,
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    },
    address: {
        type: Sequelize.STRING(128),
        allowNull: false,
    },
    city: {
        type: Sequelize.STRING(32),
        allowNull: false,
    },
    state: {
        type: Sequelize.STRING(45),
        allowNull: false,
    },
    zip: {
        type: Sequelize.STRING(16),
        allowNull: false,
    },
    // longitude: {
    //     type: Sequelize.DECIMAL(9, 6),
    // },
    // latitude: {
    //     type: Sequelize.DECIMAL(9, 6),
    // },
    rooms: {
        type: Sequelize.INTEGER,
    },
    max_capacity: {
        type: Sequelize.INTEGER,
    },
}, {
    freezeTableName: true,
});

module.exports = Listing;
