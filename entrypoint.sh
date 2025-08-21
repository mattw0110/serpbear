#!/bin/sh

# Ensure data directory exists and has correct permissions for Railway volume
mkdir -p /app/data
chmod 755 /app/data

# Create settings.json if it doesn't exist
touch /app/data/settings.json
chmod 644 /app/data/settings.json

# Run database migrations
npx sequelize-cli db:migrate --env production

# Execute the main command
exec "$@"