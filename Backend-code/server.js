const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');

const app = express();
app.use(bodyParser.json());
const dotenv = require('dotenv');

dotenv.config({path:'config.env'});

const host = process.env.HOST_URI;
const user = process.env.USER_URI;
const password = process.env.PASSWORD_URI;
const database = process.env.DB_URI

// MySQL connection configuration
const connection = mysql.createConnection({
    host: host,
    user: user,
    password: password,
    database: database
});

// Connect to the database
connection.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the MySQL database');
});

app.post('/data', (req, res) => {
    const { timestamp, temperature, humidity, pressure } = req.body;
    console.log("temperature = ",temperature);
    console.log("timestamp = ",timestamp);
    console.log("humidity = ",humidity);
    console.log("pressure = ",pressure);
    if (!timestamp || !temperature || !humidity || !pressure) {
        return res.status(400).send('Invalid data format');
    }

    // Insert data into the MySQL database
    const query = 'INSERT INTO SensorData (timestamp, temperature, humidity, pressure) VALUES (?, ?, ?, ?)';
    connection.query(query, [timestamp, temperature, humidity, pressure], (err, results) => {
        if (err) {
            console.error('Unable to add data:', err);
            return res.status(500).send('Error saving data');
        }
        res.status(200).send('Data saved successfully');
    });
});
let offsetCounter = 0;
app.get('/getData', (req, res) => {
    const query = 'SELECT * FROM SensorData ORDER BY id ASC LIMIT 1 OFFSET ?'
    connection.query(query,[offsetCounter] ,(err, results) => {
        if (err) {
            console.error('Error fetching data:', err);
            return res.status(500).send('Error fetching data');
        }
	console.log("getData results = ",results)
        res.status(200).json(results);
	offsetCounter++;
    });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});