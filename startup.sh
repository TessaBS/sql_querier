#!/bin/bash
echo "
 ____   ___  _        ___                  _           
/ ___| / _ \| |      / _ \ _   _  ___ _ __(_) ___ _ __ 
\___ \| | | | |     | | | | | | |/ _ \ '__| |/ _ \ '__|
 ___) | |_| | |___  | |_| | |_| |  __/ |  | |  __/ |   
|____/ \__\_\_____|  \__\_\\__,_|\___|_|  |_|\___|_|   

Door: Rijk van Putten
"
                                       
./init_mysql.sh
sleep 1
echo 'Install node packages..'
npm ci
echo 'Starting server..'
node app.js
