// require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');

const app = express();
app.use(bodyParser.json());

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  database: process.env.MYSQL_DATABASE,
  password: process.env.MYSQL_PASSWORD,
  port: parseInt(process.env.MYSQL_PORT, 10),
});

const createTable = async () => {
  pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(50),
      address VARCHAR(50)
    );
  `, (error) => {
    if (error) throw error;
  });
};
createTable();

// Insert one record
const insertRecord = async () => {
  pool.query(`
  insert into users (name, address) VALUES (?, ?)
  `, ["Seed name from script", "New Delhi"], (error) => {
    if (error) throw error;
  });
};
insertRecord();



app.post('/users', (req, res) => {
  const { name, address } = req.body;
  pool.query(
    'insert into users (name, address) VALUES (?, ?)',
    [name, address],
    (error, results) => {
      if (error) {
        return res.json({ error: error.message });
      }
      res.json({ id: results.insertId, name, address });
    }
  );
});

app.get('/users', (req, res) => {
  pool.query('select * from users', (error, results) => {
    if (error) {
      return res.json({ error: error.message });
    }
    res.json({ apiVersion: "v2", values: results });
  });
});

const port = process.env.PORT || 8888;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
