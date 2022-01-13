#!/bin/bash
echo 'Performing startup commands..'
./init_mysql.sh
sleep 3
node app.js
