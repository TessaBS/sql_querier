#!/bin/bash
echo 'Performing startup commands..'
./init_mysql.sh
sleep 1
echo 'Install node packages..'
npm ci
echo 'Starting server..'
node app.js
