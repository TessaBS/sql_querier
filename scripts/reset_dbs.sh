#!/bin/bash
# Create read user with read only privileges
mysql -u root -e "CREATE USER IF NOT EXISTS 'read'@'localhost'; GRANT SELECT ON *.* TO 'read'@'localhost'; FLUSH PRIVILEGES;"
# Removes and imports databases from the databases directory. The filename must match the database name.
for db_path in $PWD/databases/*.sql;
do
    db_name=$(basename $db_path .sql)
    echo "Reset database '$db_name'"
    mysql -e "DROP DATABASE IF EXISTS $db_name; CREATE DATABASE $db_name;"
    mysql $db_name < $db_path
done
