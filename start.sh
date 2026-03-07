#!/bin/sh
set -e

if [ "$RUN_MIGRATIONS" = "true" ]; then
    echo "Running database migrations..."
    pnpm exec drizzle-kit migrate
fi

echo "Starting app..."
node build