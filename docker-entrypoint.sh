#!/bin/sh

# Run migrations
pnpm prisma migrate dev

# Start the application
pnpm run dev