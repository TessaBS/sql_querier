#!/bin/bash
echo 'Performing startup commands..'
./start_mysql.sh
sleep 3
node app.js
