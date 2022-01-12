const express = require('express')
const fs = require('fs');
const mysql = require('mysql2');
const app = express();

const hostname = '127.0.0.1';
const port = 1700;

const dbConnection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    rowsAsArray: true
});

app.use(express.static('public'))
app.use(express.json());

app.get('/databases', (req, res) => {
    const files = fs.readdirSync('./databases');
    var dbNames = [];
    files.forEach(file => {
        dbNames.push(file.split('.')[0]);
    });
    res.json(dbNames)
});

app.get('/tables/:db', (req, res) => {
    const dbName = req.params["db"];
    dbConnection.query(`USE ${dbName}`, (useErr) => {
        if (useErr == null) {
            dbConnection.query('SHOW tables', (queryErr, results, fields) => {
                if (queryErr == null) {
                    tableNames = [];
                    results.forEach(arr => {
                        tableNames.push(arr[0]);
                    })
                    res.json(tableNames);
                }
                else {
                    res.status(500).send();
                }
            });
        }
        else {
            res.status(500).send();
        }
    });
});

app.post('/run', async (req, res) => {
    const dbName = req.body["db"];
    const query = req.body["query"];
    dbConnection.query(`USE ${dbName}`, (useErr) => {
        if (useErr == null) {
            dbConnection.query(query, (queryErr, results, fields) => {
                if (queryErr == null) {
                    console.log(results);
                    res.json({
                        succes: true,
                        data: results,
                    });
                }
                else {
                    console.log("QUERY ERROR: " + queryErr.message);
                    res.json({
                        succes: false,
                        error: queryErr.message,
                    });
                }
            });
        }
        else {
            res.json({
                succes: false,
                error: "Error while opening database!",
            });
        }
    });
});

app.listen(port, hostname, () => {
    console.log(`Started server at http://localhost:${port}`)
});