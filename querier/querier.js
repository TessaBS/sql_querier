const express = require('express')
const mysql = require('mysql2');
const cp = require("child_process");

const app = express();

const hostname = '127.0.0.1';
const port = 1700;

const rootDbConn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    rowsAsArray: true
});
const readDbConn = mysql.createConnection({
    host: 'localhost',
    user: 'read',
    rowsAsArray: true
});

app.use(express.static('public'))
app.use(express.json());

app.get('/databases', (req, res) => {
    rootDbConn.query(`SHOW databases`, (err, results) => {
        if (err == null) {
            // Hide default MySQL databases.
            results = results.filter(i => i != 'information_schema' && i != 'performance_schema' && i != 'mysql' && i != 'sys');
            res.json(results);
        }
    });
});

app.get('/layout/:db', (req, res) => {
    const dbName = req.params["db"];
    rootDbConn.query(`USE ${dbName}`, (useErr) => {
        if (useErr == null) {
            rootDbConn.query('SHOW tables', (tableErr, results) => {
                if (tableErr == null) {
                    var tableNames = [];
                    var promises = [];
                    results.forEach(arr => {
                        const tableName = arr[0];
                        tableNames.push(tableName);
                        promises.push(new Promise((resolve, reject) => rootDbConn.query(
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

app.post('/run', (req, res) => {
    const dbName = req.body["db"];
    const query = req.body["query"];
    const pageSize = req.body["pageSize"];
    const readOnly = req.body["readOnly"];
    const page = req.body["page"];

    let dbConn;
    if (!readOnly) {
        dbConn = rootDbConn;
    } else {
        dbConn = readDbConn;
    }

    dbConn.query(`USE ${dbName}`, (useErr) => {
        if (useErr == null) {
            dbConn.query(query, (queryErr, results, columns) => {
                if (queryErr == null) {
                    if (Array.isArray(results)) {
                        var headers = [];
                        columns.forEach(c => {
                            headers.push(c.name);
                        });
                        const count = results.length;
                        const pageCount = parseInt(Math.ceil(count / pageSize));
                        console.log(`Page count ${pageCount}`);
                        const from = page * pageSize;
                        const to = page * pageSize + pageSize;
                        const data = results.slice(from, to);
                        res.json({
                            succes: true,
                            hasData: true,
                            count: count,
                            pageCount: pageCount,
                            from: from,
                            to: to,
                            headers: headers,
                            data: data,
                        });
                    }
                    else {
                        res.json({
                            succes: true,
                            hasData: false,
                        });
                    }
                }
                else {
                    res.json({
                        succes: false,
                        hasData: false,
                        error: queryErr.message,
                    });
                }
            });
        }
        else {
            res.json({
                succes: false,
                error: useErr.message,
            });
        }
    });
});

app.post('/reset', async (req, res) => {
    cp.exec('cd .. && ./scripts/reset_dbs.sh', (error, stdout, stderr) => {
        if (error) {
            console.log(`Error: ${error}`);              
            res.status(500).send();
        }
        if (stderr) {
            console.log(`ST Error: ${stderr}`);
            res.status(500).send();
        }
        res.send();
    });
});

app.listen(port, hostname, () => {
    console.log(`Querier gestart op ${hostname}:${port}`)
    console.log(`Druk op de volgende link om te openen: http://${hostname}:${port} (als hij niet automatisch opent)`)
});
