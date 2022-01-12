const express = require('express')
const fs = require('fs');
const mysql = require('mysql2');
const app = express()
const hostname = '127.0.0.1';
const port = 1700

const dbConnection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'test'
});


app.use(express.static('public'))

app.get('/databases', function (req, res) {
    const files = fs.readdirSync('./databases');
    var dbNames = [];
    files.forEach(file => {
        dbNames.push(file.split('.')[0]);
    });
    res.json(dbNames)
})

app.get('/tables/:db', function (req, res) {
    console.log("Get tables");
    const dbName = req.params["db"];
    res.json([dbName, "test2", "test3"]);
})

app.get('/run', function (req, res) {
})

app.listen(port, hostname, () => {
    console.log(`Started server at http://localhost:${port}`)
})