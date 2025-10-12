# EcoVision Design Guidelines

## Design Approach

**Reference-Based Approach**: Drawing inspiration from environmental conservation platforms like Plant-for-the-Planet, WWF, and The Nature Conservancy, combined with modern map-based applications like Airbnb and Google Earth. The design emphasizes emotional connection to environmental causes while maintaining functional clarity for data visualization.

**Core Principles**:
- Organic authenticity: Natural imagery and earth-toned palette create trust
- Data transparency: Clear visualization of environmental impact
- Action-oriented: Every section guides toward meaningful engagement
- Accessible complexity: Sophisticated map tools remain approachable

---

## Color Palette

### Brand Colors
**Primary Green**: `143 89% 30%` (#108910)
- Primary buttons, active states, map markers, headers
- Use for CTAs and key environmental metrics
- Represents growth, nature, and positive action

**Background Cream**: `46 38% 96%` (#F7F5F0)
- Main background, card backgrounds
- Creates warm, organic feel vs stark white

**Input Gray**: `210 11% 97%` (#F6F7F8)
- Form fields, disabled states, secondary backgrounds

### Supporting Colors
**Dark Text**: `0 0% 15%` - Primary text
**Medium Gray**: `0 0% 45%` - Secondary text, borders
**Success Green**: `143 70% 45%` - Confirmations, positive metrics
**Alert Amber**: `38 92% 50%` - Warnings, urgent actions
**Info Blue**: `210 80% 50%` - Information, map overlays

**Dark Mode**: Invert primary to `143 89% 85%`, background to `0 0% 10%`, maintain cream tones in cards

---

## Typography

**Font Families**:
- **Headlines**: Inter, system-ui - Clean, modern, professional
- **Body**: Inter, system-ui - Excellent readability for data
- **Data/Code**: JetBrains Mono - Map coordinates, technical info

**Type Scale**:
- Hero: text-5xl md:text-7xl (60px/84px), font-bold
- H1: text-4xl md:text-5xl (36px/48px), font-bold
- H2: text-3xl md:text-4xl (30px/36px), font-semibold
- H3: text-2xl md:text-3xl (24px/30px), font-semibold
- Body: text-base md:text-lg (16px/18px), font-normal
- Small: text-sm (14px), secondary info
- Tiny: text-xs (12px), map labels, metadata

---

## Layout System

**Spacing Primitives**: Use Tailwind units of **4, 6, 8, 12, 16** for consistent rhythm
- Component padding: p-4 to p-8
- Section spacing: py-16 md:py-24
- Grid gaps: gap-6 to gap-8
- Card spacing: p-6 md:p-8

**Container Widths**:
- Full-width map sections: w-full
- Content sections: max-w-7xl mx-auto px-4
- Text content: max-w-4xl mx-auto
- Cards/modals: max-w-2xl

**Grid Systems**:
- Project cards: grid-cols-1 md:grid-cols-2 lg:grid-cols-3
- Stats display: grid-cols-2 md:grid-cols-4
- Feature showcase: grid-cols-1 md:grid-cols-2
- Admin forms: Single column max-w-2xl

---

## Component Library

### Navigation
- Transparent header over hero with blur backdrop
- Logo left, navigation center, auth buttons right
- Sticky on scroll with subtle shadow
- Mobile: Hamburger menu with slide-in drawer

### Hero Section
- **Large hero image**: Full-width aerial forest/conservation imagery with 60vh height
- Overlaid heading + subheading with semi-transparent dark gradient
- Dual CTAs: Primary "Explore Projects" + Secondary "Make a Pledge"
- Floating stats bar showing live impact metrics (trees planted, CO2 offset)

### Map Interface
- Full-screen interactive map component (min-height: 70vh)
- Layer toggle sidebar: Satellite/NDVI/Weather with icon + label switches
- Search bar overlay (top-left): Location search with autocomplete
- Filter panel (top-right): Project type, date range, impact level dropdowns
- Custom green markers for projects with hover preview cards
- Zoom controls bottom-right, scale indicator bottom-left

### Project Cards
- Image thumbnail top (16:9 ratio)
- Title + location with pin icon
- Impact metrics row: Trees, Area, CO2 with icons
- "View Details" link bottom-right
- Hover: Subtle lift (shadow-lg) + scale-105 transform

### Detail Modals
- Large overlay modal (max-w-4xl)
- Split layout: Satellite snapshot left (40%), details right (60%)
- Tabbed navigation: Overview, Timeline, Impact Data
- Recent imagery carousel with date stamps
- Action button: "Support This Project"

### Forms & Authentication
- Card-based forms on cream background
- Input fields: #F6F7F8 background, border on focus with primary green
- Labels above inputs with text-sm font-medium
- Social auth buttons: Google/GitHub with brand colors
- Error states: Red-500 border + text below input
- Success: Checkmark animation + green highlight

### Admin Interface
- Dashboard layout: Sidebar navigation + main content area
- Data table: Striped rows, sortable headers, action buttons per row
- Map editor: Leaflet Draw toolbar integrated seamlessly
- Form sections: Collapsible accordions for complex data
- Save indicators: Auto-save with timestamp display

### Pledge Flow
- Multi-step wizard (3 steps): Amount → Details → Confirm
- Progress indicator top: Filled circles connected by lines
- Summary sidebar: Live calculation of impact
- Payment mock: Card design with tree animation on success

---

## Images

**Hero Image**: Aerial drone shot of lush forest canopy with morning mist, placed as full-width background with gradient overlay from transparent to rgba(0,0,0,0.5)

**Project Cards**: Representative images of each conservation project - forest restoration, reforestation sites, community planting events (use placeholder API like Unsplash with "reforestation" "forest conservation" keywords)

**Satellite Imagery**: Integrated within map and modals from Copernicus/NASA APIs - no placeholder needed

**Impact Graphics**: Custom illustrated icons for metrics (tree icon, CO2 cloud, area polygon) - use Heroicons library

**Team/About Section**: Optional candid photos of volunteers planting trees, environmental work

---

## Page Sections

### Landing Page Flow
1. **Hero**: Full-width image, headline "Restore Our Planet's Forests", live impact counter, dual CTAs
2. **Mission Statement**: Centered text block with decorative leaf icons, max-w-3xl
3. **Interactive Map Preview**: Embedded map showing global projects, "Explore All Projects" CTA
4. **How It Works**: 3-column grid with numbered steps, icons, descriptions
5. **Featured Projects**: Carousel/grid of 6 project cards with images and stats
6. **Impact Dashboard**: Large statistics grid with animated counters (trees planted, countries, area restored)
7. **Pledge CTA**: Full-width banner with contrast background, "Join the Movement" headline
8. **Footer**: Multi-column with About, Projects, Resources, Newsletter signup

### Map Page
- Full-screen map (100vh minus header)
- Persistent layer controls and filters
- Search integrated into map UI
- Click markers → info popup → "View Full Details" link to modal

---

## Animation Strategy

**Use Sparingly**:
- Counter animations for impact statistics (count-up effect)
- Map marker pulse on initial load
- Modal slide-in entrance (translate-y)
- Button hover: Subtle scale (1.02) and brightness increase
- Form success: Checkmark draw animation

**Avoid**: Parallax scrolling, complex background animations, auto-playing carousels

---

## Accessibility

- WCAG AA contrast ratios maintained (test green #108910 on cream #F7F5F0)
- Map controls keyboard accessible (tab navigation)
- ARIA labels on all interactive map elements
- Focus indicators visible: 2px ring in primary green with offset
- Form errors announced to screen readers
- Dark mode toggle preserves all contrast requirements

---

## Responsive Breakpoints

- Mobile: <768px - Single column, stacked nav, simplified map controls
- Tablet: 768px-1024px - 2-column grids, condensed sidebar
- Desktop: >1024px - Full multi-column layouts, expanded map panels