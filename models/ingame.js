const mysql = require('mysql');
const db = mysql.createConnection ({
  host: process.env.DBHOST,
  user: process.env.DBUSER,
  password: process.env.DBPASS,
  database: process.env.DBDB,
  multipleStatements: true
});
//connect to database
db.connect((err) => {
  if (err) {
      throw err;
  }
  console.log('Connected to database');
});

global.db = db;
