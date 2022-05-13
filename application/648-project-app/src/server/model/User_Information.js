const { Sequelize, Deferrable } = require("sequelize");
const sequelize = require("../config/database_sequelize");
const User = require("./User");

const User_Information = sequelize.define("user_information", {
  user_id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    references: {
      model: User,
      key: "User_ID",
      deferrable: Deferrable.INITIALLY_IMMEDIATE,
    },
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  },
  profile_url: {
    type: Sequelize.STRING(2048),
  },
  biography: {
    type: Sequelize.STRING(2048),
    allowNull: false,
    defaultValue: "describe yourself~",
  },
  age: {
    type: Sequelize.INTEGER,
  },
  smoking: {
    type: Sequelize.BOOLEAN,
  },
  gender: {
    type: Sequelize.STRING(32),
  },
  looking_for_housing: {
    type: Sequelize.BOOLEAN,
  },
  offering_housing: {
    type: Sequelize.BOOLEAN,
  },
  pets: {
    type: Sequelize.BOOLEAN,
  },
  ethnicity: {
    type: Sequelize.STRING(30),
  },
});

module.exports = User_Information;
