# EcoVision - Environmental Conservation Platform

## Overview
EcoVision is an educational environmental monitoring platform inspired by Plant-for-the-Planet. It enables users to explore conservation projects worldwide using interactive satellite maps, track environmental impact with real-time data, and make pledges to support reforestation efforts.

## Recent Changes
- **December 2025**: Initial MVP implementation
  - Created comprehensive schema for projects, pledges, and users
  - Built responsive landing page with hero section and impact dashboard
  - Implemented interactive Leaflet map with OpenStreetMap, satellite, and weather layer toggles
  - Added project filtering and search functionality
  - Created authentication dialogs for login/registration
  - Built admin CRUD interface with Leaflet Draw for project management
  - Implemented multi-step pledge flow with impact calculations
  - Configured design system with specified color palette (#108910 primary, #F7F5F0 background)
  - Integrated dark mode support throughout the application

## Tech Stack
- **Frontend**: React 18, TypeScript, Tailwind CSS, Shadcn UI
- **Mapping**: Leaflet, React-Leaflet, Leaflet Draw
- **Data Fetching**: TanStack Query (React Query)
- **Forms**: React Hook Form with Zod validation
- **Routing**: Wouter
- **Backend**: Express.js, Node.js
- **Database**: PostgreSQL (Supabase)
- **ORM**: Drizzle

## Project Architecture

### Database Schema
- **users**: User authentication and profiles
- **projects**: Conservation project details with geolocation data
- **pledges**: User contributions linked to projects

### Pages
- **Home** (`/`): Landing page with hero, mission, how it works, and impact dashboard
- **Map** (`/map`): Interactive map with layer toggles and project markers
- **Projects** (`/projects`): Grid view of all projects with filtering
- **Pledge** (`/pledge`): Multi-step pledge form with impact calculation
- **Admin** (`/admin`): CRUD interface for managing projects with map drawing tools

### Key Features
1. **Interactive Mapping**
   - OpenStreetMap basemap
   - NASA GIBS satellite imagery overlay
   - OpenWeatherMap weather tile layer
   - Custom green markers for conservation projects
   - Click markers for project details

2. **Project Management**
   - Admin interface with Leaflet Draw for polygon/rectangle area selection
   - Full CRUD operations for projects
   - Track trees planted, area restored, and CO₂ offset
   - Support for multiple project types and statuses

3. **Pledge System**
   - Three-step pledge wizard
   - Automatic tree count estimation ($5 per tree)
   - Optional personal messages
   - Mock payment flow (production would integrate real payment processing)

4. **Authentication**
   - Login/Register dialogs
   - Supabase authentication integration (backend implementation pending)
   - Protected admin routes

## Environment Variables
All API keys and credentials are stored as environment secrets:
- `DATABASE_URL`: Supabase PostgreSQL connection string
- `VITE_SUPABASE_URL`: Supabase project URL
- `VITE_SUPABASE_ANON_KEY`: Supabase anonymous key
- `VITE_OPENWEATHER_API_KEY`: OpenWeatherMap API key
- `DATASPACE_USERNAME/PASSWORD`: Copernicus Dataspace credentials
- `NASA_EARTHDATA_USERNAME/PASSWORD`: NASA Earthdata credentials
- `SESSION_SECRET`: Express session secret

## Design System
- **Primary Color**: #108910 (Green - hsl(143 89% 30%))
- **Background**: #F7F5F0 (Cream - hsl(46 38% 96%))
- **Input Fields**: #F6F7F8 (Light Gray - hsl(210 11% 97%))
- **Typography**: Inter for UI, JetBrains Mono for code/coordinates
- **Dark Mode**: Fully supported with automatic color adaptations

## User Preferences
- Clean, modern design with environmental theme
- Emphasis on data transparency and visual satellite imagery
- Mobile-responsive layouts
- Accessible color contrast ratios (WCAG AA)

## Next Steps (Future Enhancements)
1. Implement backend API endpoints for all CRUD operations
2. Set up Supabase database tables and authentication
3. Integrate real satellite imagery from Copernicus Dataspace and NASA GIBS APIs
4. Add user dashboard with pledge history
5. Implement before/after satellite comparisons for projects
6. Add data visualization charts for environmental impact
7. Deploy to Vercel or Netlify

## Development Commands
- `npm run dev`: Start development server (both frontend and backend)
- Frontend runs on port 5000 (Vite)
- Backend API available at `/api/*` routes

## Educational Note
This is an educational clone for demonstration purposes only. It does not use any copyrighted images or text from Plant-for-the-Planet.
