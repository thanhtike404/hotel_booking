# Project Structure

## Next.js App Router Organization

### Route Groups
- `app/(app)/` - Public-facing application routes
- `app/(dashboard)/` - Admin dashboard routes (protected)
- `app/api/` - API routes for backend functionality

### Key Directories

#### Application Routes (`app/(app)/`)
- `auth/` - Authentication pages (signin, error)
- `hotels/` - Hotel listing and detail pages
- `bookings/` - User booking management
- `search/` - Hotel search functionality
- `contact/` - Contact page

#### Dashboard Routes (`app/(dashboard)/dashboard/`)
- `hotels/` - Hotel CRUD operations
- `rooms/` - Room management
- `bookings/` - Booking administration
- `cities/` & `countries/` - Location management
- `notifications/` - Admin notifications

#### API Routes (`app/api/`)
- `auth/` - NextAuth.js authentication
- `hotels/` - Hotel data endpoints
- `bookings/` - Booking operations
- `locations/` - City/country data
- `dashboard/` - Admin-specific endpoints

### Component Organization

#### `components/`
- `ui/` - Reusable UI components (buttons, forms, etc.)
- `dashboard/` - Dashboard-specific components
- `hotel/` - Hotel-related components
- `search/` - Search functionality components
- `providers/` - Context providers

### Supporting Directories

#### `lib/`
- `prisma.ts` - Database client
- `utils.ts` - Utility functions
- `authGuard.ts` - Authentication helpers

#### `types/`
- TypeScript type definitions organized by domain
- `hotel.ts`, `bookings.ts`, `dashboard.ts`, etc.

#### `hooks/`
- Custom React hooks
- `dashboard/` - Dashboard-specific hooks

#### `data/`
- Static data and constants
- `hotels.ts`, `locations.ts`, `amenities.ts`

#### `services/`
- Business logic and external service integrations
- `booking.ts`, `notification.ts`

## File Naming Conventions

- **Pages**: `page.tsx` (App Router convention)
- **Layouts**: `layout.tsx`
- **Loading**: `loading.tsx`
- **Components**: PascalCase (e.g., `HotelCard.tsx`)
- **Utilities**: camelCase (e.g., `totalPrice.ts`)
- **Types**: camelCase with descriptive names
- **API Routes**: `route.ts`

## Import Path Aliases

- `@/*` - Root directory alias for clean imports
- Example: `import { Button } from "@/components/ui/button"`

## Database Schema Location

- `prisma/schema.prisma` - Main database schema
- `prisma/migrations/` - Database migration files
- `prisma/seed.ts` - Database seeding script