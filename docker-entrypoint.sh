#!/bin/sh

# Exit immediately if any command fails
set -e

# Run database migrations
echo "Running database migrations..."
pnpm prisma migrate deploy

# Start the application
echo "Starting application..."
exec "$@"