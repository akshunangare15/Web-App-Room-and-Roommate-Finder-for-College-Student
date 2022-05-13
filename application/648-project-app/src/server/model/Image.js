const { Sequelize, Deferrable } = require('sequelize');
const sequelize = require('../config/database_sequelize');
const Listing = require('./Listing');

const Image = sequelize.define('image', {
    image_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    listing_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: Listing,
            key: 'listing_id',
            deferrable: Deferrable.INITIALLY_IMMEDIATE,
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    },
    image_url: {
        type: Sequelize.STRING(2048),
        allowNull: false,
    },
    image_order: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
});

module.exports = Image;
