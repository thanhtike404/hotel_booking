# Docker Configuration

This directory contains separate Docker configurations for development and production environments.

## Development Environment

Located in the `dev` directory, the development configuration is optimized for local development with features like:
- Hot-reloading
- Volume mounts for real-time code changes
- Development-specific environment variables

To start the development environment:
```bash
docker compose -f docker/dev/docker-compose.dev.yml up
```

## Production Environment

Located in the `prod` directory, the production configuration is optimized for deployment with:
- Multi-stage builds for smaller image size
- Production-only dependencies
- Optimized performance settings

To start the production environment:
```bash
docker compose -f docker/prod/docker-compose.prod.yml up
```

## Environment Differences

### Development
- Uses `Dockerfile.dev` with development dependencies
- Mounts source code as volume for hot-reloading
- Includes development tools and debugging capabilities

### Production
- Uses `Dockerfile.prod` with multi-stage builds
- Contains only production dependencies
- Optimized for performance and security
- Smaller image size