#!/bin/sh
# Railway startup script
# Ensures SQLite database exists on the persistent volume before starting the app

DATA_DIR="${DATA_DIR:-/app/data}"
DB_FILE="$DATA_DIR/prod.db"

echo "[startup] Data directory: $DATA_DIR"
echo "[startup] Database file: $DB_FILE"
echo "[startup] Current user: $(whoami)"
echo "[startup] Listing /app/data:"
ls -la "$DATA_DIR" 2>/dev/null || echo "[startup] /app/data does not exist yet"

# Ensure data directory exists
mkdir -p "$DATA_DIR" || echo "[startup] WARNING: could not create $DATA_DIR"

# Wait for Railway volume mount (mounts happen asynchronously)
echo "[startup] Waiting for volume to be writable..."
RETRIES=0
while [ $RETRIES -lt 15 ]; do
  if touch "$DATA_DIR/.probe" 2>/dev/null; then
    rm -f "$DATA_DIR/.probe"
    echo "[startup] Volume is writable."
    break
  fi
  RETRIES=$((RETRIES + 1))
  echo "[startup] Volume not writable yet (attempt $RETRIES/15)..."
  sleep 2
done

# Initialize database (non-fatal — server starts regardless)
if [ ! -f "$DB_FILE" ]; then
  echo "[startup] Database not found. Running initial schema push..."
  DATABASE_URL="file:$DB_FILE" node ./node_modules/prisma/build/index.js db push --skip-generate 2>&1 || echo "[startup] WARNING: prisma db push failed, server will start anyway"
  echo "[startup] Database init complete."
else
  echo "[startup] Database found. Syncing schema..."
  DATABASE_URL="file:$DB_FILE" node ./node_modules/prisma/build/index.js db push --skip-generate --accept-data-loss 2>&1 || true
  echo "[startup] Schema sync complete."
fi

echo "[startup] Starting Next.js server on port ${PORT:-3000}..."
exec node server.js
