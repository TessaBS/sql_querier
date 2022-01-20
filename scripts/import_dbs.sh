#!/bin/bash
# Imports databases from the databases directory. The filename must match the database name.
for db_path in $PWD/databases/*.sql;
do
    db_name=$(basename $db_path .sql)
    echo "Importing database '$db_name'"
    mysql -e "DROP DATABASE IF EXISTS $db_name; CREATE DATABASE $db_name;"
    mysql $db_name < $db_path
done
