#!/bin/bash
# Startup script. Initializes MySQL and Node.js
echo "
 ____   ___  _        ___                  _           
/ ___| / _ \| |      / _ \ _   _  ___ _ __(_) ___ _ __ 
\___ \| | | | |     | | | | | | |/ _ \ '__| |/ _ \ '__|
 ___) | |_| | |___  | |_| | |_| |  __/ |  | |  __/ |   
|____/ \__\_\_____|  \__\_\\__,_|\___|_|  |_|\___|_|   

Door: Rijk van Putten
"

echo "Starting MySQL server.."               
./start_mysql.sh
echo "Importing MySQL databases.."
./import_dbs.sh

cd ./querier
echo "Downloading Node.js packages.."
npm ci
echo "Starting Querier.."
node querier.js
