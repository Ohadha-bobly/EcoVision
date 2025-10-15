# EcoVision - Environmental Conservation Platform

An educational environmental monitoring platform for tracking conservation projects worldwide using interactive satellite maps, real-time environmental data, and pledge management.

## Overview

**Purpose**: Educational environmental monitoring platform inspired by Plant-for-the-Planet  
**Current State**: Fully functional with authentication, project management, and pledge system  
**Tech Stack**: React 18 + TypeScript + Express.js + PostgreSQL + Drizzle ORM  

## Recent Changes (October 13, 2025)

- ✅ Configured Vite for Replit proxy support (host: 0.0.0.0, port: 5000, HMR over WSS)
- ✅ Fixed SSL certificate issue for Supabase PostgreSQL connection (NODE_TLS_REJECT_UNAUTHORIZED=0 in dev)
- ✅ Set up PostgreSQL database schema with Drizzle ORM
- ✅ Configured deployment for Replit Autoscale
- ✅ Tested authentication endpoints (register/login working correctly)
- ✅ Seeded database with 6 sample conservation projects

## Project Architecture

### Frontend (React + Vite)
- **Location**: `/client/src`
- **Port**: 5000
- **Key Features**:
  - Interactive maps with Leaflet (OpenStreetMap, NASA GIBS satellite, OpenWeatherMap)
  - Dark mode support with next-themes
  - Authentication UI with Shadcn components
  - Project browsing and pledge creation

### Backend (Express.js)
- **Location**: `/server`
- **Port**: 5000 (same as frontend - integrated server)
- **Key Routes**:
  - `/api/projects` - CRUD operations for conservation projects
  - `/api/pledges` - Create and view pledges
  - `/api/auth/register` - User registration with bcrypt
  - `/api/auth/login` - User authentication
  - `/api/seed` - Seed database with sample data

### Database (PostgreSQL via Supabase)
- **ORM**: Drizzle
- **Tables**:
  - `users` - User accounts with hashed passwords
  - `projects` - Conservation projects with location data
  - `pledges` - User pledges linked to projects
- **Schema Location**: `/shared/schema.ts`

## Environment Setup

### Required Environment Variables
All environment variables are stored in `.env` (already configured):
- `DATABASE_URL` - PostgreSQL connection string (Supabase)
- `VITE_SUPABASE_URL` - Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Supabase anonymous key
- `VITE_OPENWEATHER_API_KEY` - OpenWeatherMap API key for weather data
- `DATASPACE_USERNAME/PASSWORD` - Copernicus Dataspace credentials
- `NASA_EARTHDATA_USERNAME/PASSWORD` - NASA Earthdata credentials
- `SESSION_SECRET` - Express session secret

### SSL Certificate Handling
**Development**: SSL verification is disabled (`NODE_TLS_REJECT_UNAUTHORIZED=0`) to handle Supabase's self-signed certificates  
**Production**: SSL verification enabled via deployment configuration

## Development Workflow

### Starting the Server
```bash
npm run dev
```
Runs on port 5000 with Vite dev server and HMR

### Database Management
```bash
npm run db:push    # Push schema changes
npx drizzle-kit push --force  # Force push if needed
```

### Seeding Sample Data
```bash
curl -X POST http://localhost:5000/api/seed
```
Creates 6 sample conservation projects from around the world

## Authentication

**Method**: Local authentication with bcrypt (not Supabase Auth)  
**Flow**:
1. Registration: Username + email + password → hashed password stored
2. Login: Username + password → bcrypt comparison → user data returned

**Test Credentials**:
- Username: `testuser`
- Password: `Test1234`

## Key Implementation Details

### Vite Configuration
- Host: `0.0.0.0` (required for Replit proxy)
- Port: 5000 (only non-firewalled port)
- HMR: WebSocket over SSL (clientPort: 443, protocol: wss)

### Database Connection
- Uses `@neondatabase/serverless` with WebSocket
- Pipeline connect disabled for compatibility
- SSL verification bypassed in development

### Deployment
- Target: Replit Autoscale (stateless, database handles state)
- Build: `npm run build` (Vite + esbuild)
- Run: `npm start` (production mode)

## Known Issues & Warnings

1. **PostCSS Warning**: Non-critical warning about `from` option - doesn't affect functionality
2. **React DOM Warning**: Nested `<a>` tags in navigation - minor, doesn't affect UX
3. **SSL in Development**: Using `NODE_TLS_REJECT_UNAUTHORIZED=0` - acceptable for dev, removed in production

## User Preferences

No specific coding preferences set yet. Using:
- TypeScript strict mode
- React functional components with hooks
- Shadcn UI component library
- TanStack Query for data fetching

## API Testing

### Register User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"user","email":"user@example.com","password":"pass123"}'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"user","password":"pass123"}'
```

### Get Projects
```bash
curl http://localhost:5000/api/projects
```

## Map Layers

- **Base**: OpenStreetMap (roads, cities, terrain)
- **Satellite**: NASA GIBS MODIS Terra true color
- **Weather**: OpenWeatherMap cloud coverage overlay

## Future Enhancements

- Payment integration for pledges
- Admin dashboard for project management
- User profile pages
- Real-time project updates
- Mobile app version
