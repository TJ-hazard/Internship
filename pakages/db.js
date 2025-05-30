const { Pool } = require("pg");

const con = new Pool({
    host: "localhost",
    user: "postgres",
    port: 5432,
    password: "Tejiri123",
    database: "postgres",


});


module.exports = {
    con
};