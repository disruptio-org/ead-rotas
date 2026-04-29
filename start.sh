#!/bin/sh
# Railway startup script

DATA_DIR="${DATA_DIR:-/app/data}"
DB_FILE="$DATA_DIR/prod.db"

echo "[startup] PORT=${PORT:-not set}"
echo "[startup] HOSTNAME=${HOSTNAME:-not set}"
echo "[startup] DATA_DIR=$DATA_DIR"

# Ensure data directory exists
mkdir -p "$DATA_DIR" 2>/dev/null || true

# Wait for volume to be writable
RETRIES=0
while [ $RETRIES -lt 10 ]; do
  if touch "$DATA_DIR/.probe" 2>/dev/null; then
    rm -f "$DATA_DIR/.probe"
    echo "[startup] Volume writable."
    break
  fi
  RETRIES=$((RETRIES + 1))
  sleep 2
done

# Initialize database
if [ ! -f "$DB_FILE" ]; then
  # Use seed database if available (contains pre-configured skills/agents)
  if [ -f "./prisma/seed.db" ]; then
    echo "[startup] Seeding database from seed.db..."
    cp ./prisma/seed.db "$DB_FILE"
    echo "[startup] Database seeded successfully."
  else
    echo "[startup] Creating empty database..."
    DATABASE_URL="file:$DB_FILE" node ./node_modules/prisma/build/index.js db push --skip-generate 2>&1 || echo "[startup] WARNING: db push failed"
  fi
else
  echo "[startup] Database exists, syncing schema..."
  DATABASE_URL="file:$DB_FILE" node ./node_modules/prisma/build/index.js db push --skip-generate --accept-data-loss 2>&1 || true
fi

echo "[startup] Starting server..."
exec node server.js
