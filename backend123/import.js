const mysql = require("mysql2");
const fs = require("fs");

const connection = mysql.createConnection(process.env.MYSQL_URL);

const sql = fs.readFileSync("backend/smart_farming.sql", "utf8");

connection.query(sql, (err) => {
  if (err) {
    console.error("IMPORT ERROR:", err);
  } else {
    console.log("DATA IMPORTED SUCCESSFULLY");
  }
  connection.end();
});
