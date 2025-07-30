# Technology Stack

## Framework & Runtime
- **Next.js 15.1.7** with App Router (React 19.1.0)
- **TypeScript 5.3.3** for type safety
- **Node.js 20** runtime

## Database & ORM
- **PostgreSQL** database
- **Prisma 5.10.2** as ORM with migrations
- Database seeding with `ts-node`

## Styling & UI
- **Tailwind CSS 3.4.17** for styling
- **Radix UI** components for accessible UI primitives
- **Lucide React** for icons
- **Framer Motion** for animations
- **next-themes** for dark/light mode

## State Management & Data Fetching
- **TanStack Query (React Query)** for server state
- **React Hook Form** with **Zod** validation
- **Axios** for HTTP requests

## Authentication & Authorization
- **NextAuth.js 4.24.11** with Prisma adapter
- **bcryptjs** for password hashing
- Role-based access (USER/ADMIN)

## Maps & Media
- **Leaflet** with **react-leaflet** for interactive maps
- **Cloudinary** integration for image management

## Development Tools
- **ESLint** with Next.js config
- **pnpm** as package manager
- **Docker** for containerization

## Common Commands

### Development
```bash
pnpm dev              # Start development server with Turbopack
pnpm build            # Build for production
pnpm start            # Start production server
pnpm lint             # Run ESLint
```

### Database
```bash
pnpm prisma generate  # Generate Prisma client
pnpm prisma migrate deploy  # Run migrations
pnpm prisma db seed   # Seed database
```

### Docker
```bash
docker compose up     # Start application with PostgreSQL
docker compose run --rm web pnpm prisma migrate deploy  # Run migrations in container
```