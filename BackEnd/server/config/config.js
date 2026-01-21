const mysql = require('mysql2');

const db = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "Quangbew123@",
    database: "qlpkdkpn"
});

module.exports = db;
