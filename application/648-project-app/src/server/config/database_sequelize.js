/*
This file is responsible for setting up sequelize

Notes:
    sequelize relies on mysql2

 */
const path = require('path');

const env = process.env.NODE_ENV;
const config = require(path.join(__dirname, 'database_sequelize_config.json'))[env];

const Sequelize = require('sequelize');

// const sequelize = new Sequelize("test", "admin", "csc648projectteam02", {
//     host: "csc-648-project-team-02-database.cbfddak6n8o6.us-west-1.rds.amazonaws.com",
//     dialect: "mysql",
//     define: {
//         timestamps: false,
//         freezeTableName: true
//     }
// })

const sequelize = new Sequelize(config);

// Check if you can connect to the database
sequelize.authenticate()
    .then(() => {
        console.log('Database Connected');
    })
    .catch((err) => {
        console.log(err);
    });

// Sync the database models if not exists
sequelize.sync();

module.exports = sequelize;
