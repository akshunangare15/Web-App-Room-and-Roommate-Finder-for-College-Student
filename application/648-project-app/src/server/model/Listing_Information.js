const { Sequelize, Deferrable } = require("sequelize");
const sequelize = require("../config/database_sequelize");
const Listing = require("./Listing");

const Listing_Information = sequelize.define("listing_information", {
  listing_id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    references: {
      model: Listing,
      key: "listing_id",
      deferrable: Deferrable.INITIALLY_IMMEDIATE,
    },
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  },
  description: {
    type: Sequelize.STRING(2048),
  },
  housing_type: {
    type: Sequelize.STRING(45),
  },
  monthly_rent: {
    type: Sequelize.INTEGER,
  },
});

module.exports = Listing_Information;
