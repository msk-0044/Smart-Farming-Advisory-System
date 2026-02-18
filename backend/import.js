const mysql = require("mysql2");
const fs = require("fs");

const connection = mysql.createConnection(process.env.MYSQL_URL);

const sql = fs.readFileSync("./backend/smart_farming.sql", "utf8");

// split queries safely
const queries = sql
  .split(/;\s*$/m)
  .map(q => q.trim())
  .filter(q => q.length && !q.startsWith("--") && !q.startsWith("/*"));

async function run() {
  try {
    for (let q of queries) {
      await new Promise((resolve, reject) => {
        connection.query(q, (err) => {
          if (err) {
            console.error("QUERY ERROR:", err.sqlMessage);
            reject(err);
          } else {
            resolve();
          }
        });
      });
    }

    console.log("DATA IMPORTED SUCCESSFULLY");
    connection.end();
  } catch (e) {
    console.error("IMPORT FAILED");
    connection.end();
  }
}

run();
