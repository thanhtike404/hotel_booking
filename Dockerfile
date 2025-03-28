FROM node:18-alpine AS base

# Install build dependencies
USER root
RUN apk add --no-cache openssl python3 make g++ libc6-compat

# Create app directory
RUN mkdir -p /app && chown -R node:node /app
WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy package files
COPY --chown=node:node package.json pnpm-lock.yaml* ./

# Install dependencies
USER node
RUN pnpm install --prefer-offline

# Copy source files
COPY --chown=node:node . .

# Rebuild native modules
RUN pnpm rebuild bcrypt

# Build application
RUN pnpm prisma generate && pnpm build

EXPOSE 3000
CMD ["pnpm", "start"]

