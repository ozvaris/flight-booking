#!/bin/bash
set -e

# PostgreSQL başlatıldıktan sonra oluşturulacak veritabanları
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" <<-EOSQL
    SELECT 'CREATE DATABASE flight_database'
    WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'flight_database')\gexec
EOSQL

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" <<-EOSQL
    SELECT 'CREATE DATABASE testdatabase'
    WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'testdatabase')\gexec
EOSQL

