#!/bin/sh

echo "=== SerpBear Startup Diagnostics ==="
echo "Current working directory: $(pwd)"
echo "Current user: $(whoami)"
echo "Node version: $(node --version)"
echo "NPM version: $(npm --version)"

# Environment variables check
echo "=== Environment Variables ==="
echo "NODE_ENV: $NODE_ENV"
echo "PORT: $PORT"
echo "RAILWAY_VOLUME_MOUNT_PATH: $RAILWAY_VOLUME_MOUNT_PATH"
echo "NEXT_PUBLIC_APP_URL: $NEXT_PUBLIC_APP_URL"

# Check if server.js exists
echo "=== File System Check ==="
echo "Contents of /app:"
ls -la /app/
echo "Checking for server.js:"
if [ -f "/app/server.js" ]; then
    echo "✓ server.js found"
else
    echo "✗ server.js NOT found"
fi

# Ensure data directory exists and has correct permissions for Railway volume
echo "=== Setting up data directory ==="
mkdir -p /app/data
chmod 755 /app/data
echo "Data directory created with permissions:"
ls -la /app/data/

# Create settings.json if it doesn't exist
touch /app/data/settings.json
chmod 644 /app/data/settings.json
echo "Settings file created"

# Run database migrations
echo "=== Running database migrations ==="
npx sequelize-cli db:migrate --env production
echo "Database migrations completed"

# Set PORT if not set (Railway typically uses PORT env var)
if [ -z "$PORT" ]; then
    export PORT=3000
    echo "PORT not set, defaulting to 3000"
else
    echo "Using PORT: $PORT"
fi

echo "=== Starting application ==="
echo "Command to execute: $@"

# Execute the main command
exec "$@"