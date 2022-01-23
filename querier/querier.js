const express = require('express')
const mysql = require('mysql2/promise');
const cp = require("child_process");

// Server settings 
const hostname = '127.0.0.1';
const port = 1700;

async function main() {
    const app = express();
    
    // MySQL connections
    const rootDbConn = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        rowsAsArray: true,
        dateStrings: true
    });
    const readDbConn = await mysql.createConnection({
        host: 'localhost',
        user: 'read',
        rowsAsArray: true,
        dateStrings: true
    });

    // Serve static files from the public folder
    app.use(express.static('public'))
    
    // Use JSON format
    app.use(express.json());

    // databases: Get a list of the databases
    app.get('/databases', async (_, res) => {
        const [rows] = await rootDbConn.query('SHOW databases');
        // Hide default MySQL databases.
        const databases = rows.filter(i => i != 'information_schema' && i != 'performance_schema' && i != 'mysql' && i != 'sys');
        res.json(databases);
    });

    // Layout: get the table columns and data types of the database
    app.get('/layout/:db', async (req, res) => {
        const dbName = req.params["db"];
        // Select database
        await rootDbConn.query(`USE ${dbName}`);
        // Get table names
        const [tableRows] = await rootDbConn.query('SHOW tables');
        // Get column name and data type for each table
        var tableLayouts = [];
        for (let tableRow of tableRows) {
            const tableName = tableRow[0];
            const [rows] = await rootDbConn.query(
                `SELECT COLUMN_NAME, DATA_TYPE
                FROM INFORMATION_SCHEMA.COLUMNS
                WHERE TABLE_SCHEMA = Database() AND TABLE_NAME = '${tableName}'
            `);
            tableLayouts.push({
                name: tableName,
                columns: rows,
            });
        };
        res.json(tableLayouts);
    });

    // Run: execute a querry
    app.post('/run', async (req, res) => {
        let dbConn;
        if (!req.body.readOnly) {
            dbConn = rootDbConn;
        } else {
            dbConn = readDbConn;
        }

        // Select the database
        await dbConn.query(`USE ${req.body.db}`);
        // Execute the query
        dbConn.query(req.body.query)
            .catch(queryErr => {
                // Send failed query result
                res.json({
                    success: false,
                    hasData: false,
                    error: queryErr.message,
                });
            })
            .then(([rows, fields]) => {
                // Query result without data
                if (!Array.isArray(rows)) {
                    res.json({
                        success: true,
                        hasData: false,
                    });
                }
                // Extract the column names from the query result
                var columnNames = [];
                fields.forEach(f => {
                    columnNames.push(f.name);
                });
                // Calculate pagination
                const pageSize = parseInt(req.body.pageSize);
                const page = parseInt(req.body.page);        
                const count = rows.length;
                const pageCount = parseInt(Math.ceil(count / pageSize));
                const from = page * pageSize;
                const to = Math.min(page * pageSize + pageSize, count);
                const data = rows.slice(from, to);
                // Send result
                res.json({
                    success: true,
                    hasData: true,
                    count: count,
                    pageCount: pageCount,
                    from: from,
                    to: to,
                    headers: columnNames,
                    data: data,
                });
            });
    });

    // Reset: executes the database reset script
    app.post('/reset', async (req, res) => {
        cp.exec('cd .. && ./scripts/reset_dbs.sh', (error, stdout, stderr) => {
            if (error) {
                console.error(`Error during reset: ${error}`);
                res.status(500).send();
            }
            if (stderr) {
                console.error(`Error during reset (STERR): ${stderr}`);
                res.status(500).send();
            }
            res.send();
        });
    });

    // Export: exports a query result to a file
    app.get('/export/:db/:query/:filename.:format', (req, res) => {
        // Select database
        await readDbConn.query(`USE ${req.params.db}`);

        // Execute the query
        const [rows, fields] = readDbConn.query(req.params.query);

        if (!Array.isArray(rows)) {
            res.status(400).send('Query result has no rows!');
        }

        // Extract the column names from the query result
        var columnNames = [];
        fields.forEach(c => {
            columnNames.push(c.name);
        });

        switch (req.params.format.toLowerCase()) {
            // Comma Seperated File
            case 'csv':
                var file = '';
                columnNames.forEach(col => {
                    file += col;
                    file += ',';
                });
                file += '\n';
                rows.forEach(row => {
                    row.forEach(col => {
                        file += col;
                        file += ',';
                    });
                    file += '\n';
                });
                res.set('Content-Type', 'text/csv').send(file);
                break;
            // JavaScript Object Natation
            case 'json':
                // TODO: Reformat in columns?
                res.json(rows);
                break;
            default:
                res.status(404).send('Unkown file format!');
                break;
        }
    });

    // Start the server
    app.listen(port, hostname, () => {
        console.log(`Querier gestart op ${hostname}:${port}`)
        console.log(`Druk op de volgende link om te openen: http://${hostname}:${port} (als hij niet automatisch opent)`)
    });
}

main();