
const mysql = require("mysql2");


const pool = mysql.createPool({
    connectionLimit: 50,
    host: "csc-648-project-team-02-database.cbfddak6n8o6.us-west-1.rds.amazonaws.com",
    user: "admin",
    password: "csc648projectteam02",
    database: "test",
    debug: false
  }
);

const promisePool = pool.promise();

module.exports = promisePool;