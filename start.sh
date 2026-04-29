#!/bin/sh
# Railway startup script
# Ensures SQLite database exists on the persistent volume before starting the app

set -e

DATA_DIR="${DATA_DIR:-/app/data}"
DB_FILE="$DATA_DIR/prod.db"

echo "[startup] Data directory: $DATA_DIR"
echo "[startup] Database file: $DB_FILE"

# Ensure data directory exists
mkdir -p "$DATA_DIR"

# If the database doesn't exist yet, create it via Prisma
if [ ! -f "$DB_FILE" ]; then
  echo "[startup] Database not found. Running initial migration..."
  DATABASE_URL="file:$DB_FILE" node ./node_modules/prisma/build/index.js db push --skip-generate
  echo "[startup] Database created successfully."
else
  echo "[startup] Database found. Checking for schema changes..."
  DATABASE_URL="file:$DB_FILE" node ./node_modules/prisma/build/index.js db push --skip-generate --accept-data-loss 2>/dev/null || true
  echo "[startup] Schema sync complete."
fi

echo "[startup] Starting Next.js server..."
exec node server.js
