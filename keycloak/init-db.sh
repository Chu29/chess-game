#!/bin/bash
# Creates the Keycloak database inside the shared Postgres instance.
# Runs automatically on first boot of an empty postgres_data volume.
# If the volume already exists, create the database manually once:
#   docker compose exec postgres psql -U postgres -c "CREATE DATABASE keycloak;"
set -e

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" <<-EOSQL
  SELECT 'CREATE DATABASE keycloak'
  WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'keycloak')\gexec
EOSQL
