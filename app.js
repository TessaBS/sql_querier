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

app.get('/layout/:db', (req, res) => {
    const dbName = req.params["db"];
    dbConnection.query(`USE ${dbName}`, (useErr) => {
        if (useErr == null) {
            dbConnection.query('SHOW tables', (tableErr, results) => {
                if (tableErr == null) {
                    var tableNames = [];
                    var promises = [];
                    results.forEach(arr => {
                        const tableName = arr[0];
                        tableNames.push(tableName);
                        promises.push(new Promise((resolve, reject) => dbConnection.query(
                            `SELECT COLUMN_NAME, DATA_TYPE
                            FROM INFORMATION_SCHEMA.COLUMNS
                            WHERE
                            TABLE_SCHEMA = Database()
                            AND TABLE_NAME = '${tableName}'`,
                            (columnErr, columnResults) => {
                                if (columnErr == null) {
                                    var columnNames = [];
                                    columnResults.forEach(arr2 => {
                                        columnNames.push(arr2);
                                    });
                                    resolve({
                                        name: tableName,
                                        columns: columnResults,
                                    });
                                }
                            }))
                        );
                    });
                    Promise.all(promises).then((value) => {
                        res.json(value);
                    });
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
    const limit = req.body["limit"];
    dbConnection.query(`USE ${dbName}`, (useErr) => {
        if (useErr == null) {
            dbConnection.query(query, (queryErr, results) => {
                if (queryErr == null) {
                    res.json({
                        succes: true,
                        data: results.slice(0, limit),
                    });
                }
                else {
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