FROM node:18-alpine AS base

# Create app directory and set permissions
RUN mkdir -p /app && chown -R node:node /app
WORKDIR /app

# Create pnpm store directory with correct permissions
RUN mkdir -p /home/node/.pnpm-store && chown -R node:node /home/node/.pnpm-store

# Install pnpm globally as root and configure it
USER root
RUN npm install -g pnpm && \
    pnpm config set registry https://registry.npmmirror.com/ && \
    pnpm config set network-timeout 300000 && \
    pnpm config set fetch-retries 5 && \
    pnpm config set fetch-retry-mintimeout 20000 && \
    pnpm config set fetch-retry-maxtimeout 60000

# Switch to non-root user
USER node

# Copy package files with correct ownership
COPY --chown=node:node package.json pnpm-lock.yaml* ./

# Install dependencies with retry mechanism
RUN pnpm install --prefer-offline --store-dir /home/node/.pnpm-store || \
    (sleep 5 && pnpm install --prefer-offline --store-dir /home/node/.pnpm-store) || \
    (sleep 10 && pnpm install --prefer-offline --store-dir /home/node/.pnpm-store)

# Copy application files with correct ownership
COPY --chown=node:node . .

# Generate Prisma client
RUN pnpm prisma generate

# Build the application
RUN pnpm run build

# Make entrypoint script executable
COPY --chown=node:node docker-entrypoint.sh .
RUN chmod +x docker-entrypoint.sh

EXPOSE 3000

CMD ["./docker-entrypoint.sh"]