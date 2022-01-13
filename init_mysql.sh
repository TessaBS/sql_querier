#!/bin/bash
# Run the MySQL to create the databases
echo "Starting MySQL server.."
start_mysql.sh
echo "Creating MySQL databases.."
mysql < create_dbs.sql
echo "Done!"