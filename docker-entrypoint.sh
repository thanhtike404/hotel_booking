#!/bin/sh

# Exit immediately if any command fails
set -e

# Run database migrations
echo "Running database migrations..."
pnpm prisma migrate deploy

# Build the application
echo "Building application..."
pnpm build

# Start the application
echo "Starting application..."
exec "$@"