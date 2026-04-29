#!/bin/sh
# Railway startup script
# Ensures SQLite database exists on the persistent volume before starting the app

set -e

DATA_DIR="${DATA_DIR:-/app/data}"
DB_FILE="$DATA_DIR/prod.db"

echo "[startup] Data directory: $DATA_DIR"
echo "[startup] Database file: $DB_FILE"

# Ensure data directory exists and is writable
mkdir -p "$DATA_DIR"

# Wait for Railway volume mount (mounts happen asynchronously)
echo "[startup] Waiting for volume mount..."
RETRIES=0
while [ $RETRIES -lt 10 ]; do
  if touch "$DATA_DIR/.probe" 2>/dev/null; then
    rm -f "$DATA_DIR/.probe"
    echo "[startup] Volume is ready."
    break
  fi
  RETRIES=$((RETRIES + 1))
  echo "[startup] Volume not ready yet (attempt $RETRIES/10)..."
  sleep 1
done

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
