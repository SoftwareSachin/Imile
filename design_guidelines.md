# Last-Mile Delivery Intelligence Platform - Design Guidelines

## Design Approach: Professional Data Dashboard System

**Selected Approach:** Design System (Data-Focused Professional)
**Primary Inspiration:** Linear, Vercel Dashboard, Stripe Dashboard - clean, professional, data-first interfaces
**Core Principle:** Clarity over decoration. Every pixel serves a functional purpose.

## Core Design Philosophy

This is a mission-critical operations platform where clarity, speed, and data visibility are paramount. The design emphasizes:
- **Data Hierarchy:** Information architecture that surfaces critical metrics instantly
- **Professional Restraint:** Zero decorative elements - no gradients, no emojis, no unnecessary visual flourish
- **Operational Efficiency:** Design optimized for rapid decision-making and real-time monitoring

## Color Palette

### Light Mode
- **Background Primary:** 0 0% 100% (Pure white)
- **Background Secondary:** 0 0% 98% (Subtle gray for cards/panels)
- **Background Tertiary:** 0 0% 96% (Hover states, table stripes)
- **Border Default:** 0 0% 90% (Clean separator lines)
- **Border Emphasis:** 0 0% 80% (Card borders, dividers)

### Text Hierarchy
- **Text Primary:** 0 0% 10% (Nearly black for main content)
- **Text Secondary:** 0 0% 40% (Supporting text, labels)
- **Text Tertiary:** 0 0% 60% (Timestamps, meta information)

### Status & Functional Colors
- **Success:** 142 70% 45% (Green for on-time, delivered)
- **Warning:** 38 90% 50% (Amber for delays, alerts)
- **Error:** 0 70% 50% (Red for failed deliveries, critical alerts)
- **Info:** 217 90% 60% (Blue for neutral information, active states)
- **Courier Active:** 217 90% 60% (Blue for active courier markers)

### Dark Mode
- **Background Primary:** 0 0% 8%
- **Background Secondary:** 0 0% 12%
- **Background Tertiary:** 0 0% 15%
- **Border Default:** 0 0% 20%
- **Text Primary:** 0 0% 95%
- **Text Secondary:** 0 0% 70%

## Typography

**Font Stack:** Inter (primary) with system fallback
- **Display/Headers:** 600-700 weight, tight letter-spacing (-0.02em)
- **Body Text:** 400 weight, 16px base size, 1.5 line-height
- **Data/Metrics:** 500-600 weight for emphasis
- **Labels/Meta:** 400 weight, 14px, text-secondary color
- **Monospace (for IDs/codes):** ui-monospace, 'Cascadia Code', Consolas

### Scale
- **Hero Numbers (KPIs):** text-4xl (36px), font-semibold
- **Section Headers:** text-2xl (24px), font-semibold
- **Card Titles:** text-lg (18px), font-medium
- **Body/Table Content:** text-base (16px)
- **Small Labels:** text-sm (14px)
- **Micro Text:** text-xs (12px)

## Layout System

**Spacing Primitives:** Use Tailwind units of 2, 4, 6, 8, 12, 16 for consistent rhythm
- **Component Padding:** p-4 to p-6 for cards, p-8 for main sections
- **Gap Between Elements:** gap-4 for tight grouping, gap-6 for section separation, gap-8 for major divisions
- **Margins:** mb-6 between cards, mb-8 between major sections
- **Grid Columns:** 12-column responsive grid (grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4)

**Container Strategy:**
- **Max Width:** max-w-7xl for main dashboard content
- **Full Width:** Map views and heatmaps use w-full
- **Sidebar:** Fixed 280px width on desktop, collapsible on mobile

## Component Library

### Navigation & Layout
- **Top Navigation:** Fixed header (h-16) with platform logo, global search, notification bell, user profile
- **Sidebar:** Collapsible left sidebar with icon-first navigation, active state with subtle background (bg-secondary)
- **Breadcrumbs:** Small, unobtrusive with chevron separators

### Dashboard Cards
- **Base Card:** White background (dark: bg-secondary), subtle border (border-gray-200), rounded-lg, shadow-sm
- **Card Header:** pb-4 border-b with title (text-lg font-medium) and optional action buttons
- **Card Body:** p-6 with structured content
- **Stat Cards:** Grid layout with large number (text-3xl), label below, optional trend indicator (↑↓ with percentage)

### Data Tables
- **Table Style:** Clean borders (border-collapse), alternating row colors (even:bg-tertiary)
- **Headers:** bg-secondary, text-sm font-medium text-secondary, sticky top-0
- **Cells:** px-4 py-3, text-sm, aligned left for text, right for numbers
- **Row Hover:** bg-tertiary transition-colors
- **Actions Column:** Icon buttons (edit, delete, view) aligned right
- **Pagination:** Bottom-aligned with page numbers and prev/next

### Real-Time Map (Mapbox GL)
- **Map Container:** Full height (h-96 to h-screen depending on context), rounded-lg overflow-hidden
- **Courier Markers:** Custom SVG pins - blue for active, gray for idle, pulsing animation for moving
- **Zone Overlays:** Semi-transparent polygons with border, color-coded by congestion (green/amber/red)
- **Map Controls:** Absolute positioned top-right, bg-white rounded shadow buttons for zoom/layers
- **Legend:** Bottom-left overlay card with status color indicators

### Alert & Notification Cards
- **Alert Structure:** Flex layout with icon (left), content (center), dismiss (right)
- **Severity Colors:** Border-left-4 with status colors, light background tint
- **Warning Alert:** border-l-warning bg-warning/5
- **Error Alert:** border-l-error bg-error/5
- **Info Alert:** border-l-info bg-info/10

### Forms & Filters
- **Input Fields:** border border-gray-300, rounded-md, px-3 py-2, focus:ring-2 ring-blue-500/20
- **Select Dropdowns:** Native styled with chevron icon, or custom with Headless UI
- **Filter Bar:** Sticky top bar (top-16) with horizontal flex of filter chips
- **Search Input:** Icon-left design, placeholder text-tertiary, w-80 on desktop

### Charts & Visualizations
- **Library:** Recharts or Chart.js for clean, professional charts
- **Chart Colors:** Use status colors (success, warning, error, info) consistently
- **Line Charts:** 2px stroke, subtle grid lines (stroke-gray-200), tooltip on hover
- **Bar Charts:** Rounded tops (rounded-t), gap-1 between bars
- **Donut/Pie:** Center label with metric, legend positioned right
- **Heatmap:** Grid-based with color gradient from green (low) to red (high), no literal gradients - discrete color steps

### Buttons & Actions
- **Primary Button:** bg-blue-600 text-white, hover:bg-blue-700, px-4 py-2 rounded-md font-medium
- **Secondary Button:** border border-gray-300 bg-white, hover:bg-gray-50
- **Danger Button:** bg-red-600 text-white for destructive actions
- **Icon Buttons:** p-2 rounded-md hover:bg-gray-100, 20x20 icon size
- **Button Groups:** flex gap-2 for related actions

### Status Badges
- **Pill Shape:** px-3 py-1 rounded-full text-xs font-medium
- **On Time:** bg-green-100 text-green-700 (dark: bg-green-900/30 text-green-400)
- **Delayed:** bg-amber-100 text-amber-700
- **Failed:** bg-red-100 text-red-700
- **In Transit:** bg-blue-100 text-blue-700

## Animations & Micro-interactions

**Minimal, Purposeful Motion:**
- **Transitions:** transition-colors duration-150 for hover states
- **Loading States:** Subtle skeleton screens with pulse animation
- **Real-Time Updates:** Smooth count-up animations for metrics (react-spring or framer-motion)
- **Map Animations:** Courier marker transitions (1s ease) when position updates
- **NO:** Page transitions, decorative animations, parallax effects

## Page-Specific Layouts

### Operations Dashboard (Main)
- **Layout:** Sidebar + main content area
- **Top Section:** 4-column KPI cards (total deliveries, on-time %, active couriers, avg ETA accuracy)
- **Middle Section:** 2-column layout - left: map (60% width), right: alert stream (40% width)
- **Bottom Section:** Recent deliveries table with filtering

### Analytics Dashboard
- **Top:** Date range selector + export button
- **Grid:** 2-column responsive grid of chart cards
- **Charts:** Line chart (on-time trend), bar chart (failures by reason), donut chart (delivery status breakdown)

### Courier Management
- **Table-Centric:** Full-width sortable/filterable table
- **Columns:** Photo + Name, Status badge, Active deliveries count, Performance score (%), Location, Actions
- **Detail Panel:** Slide-out drawer from right with courier details and delivery history

### ETA Prediction View
- **Timeline Design:** Vertical timeline with milestones, current position indicator (pulsing dot)
- **Top Card:** Large ETA display with confidence score
- **Factors List:** Chip-based breakdown (traffic impact, historical avg, weather delay)

## Images

This platform uses minimal imagery - it's data and map-focused:

**No Hero Images:** This is a dashboard application, not a marketing site. Users land directly in the operations view.

**Icon Usage:**
- Use Heroicons (outline and solid variants via CDN)
- Courier status icons, alert type icons, navigation icons
- 20px default size, 24px for emphasis

**Map Tiles:** Mapbox GL streets-v11 style for professional, clean cartography

**Profile Images:** 
- Courier profile photos: circular avatars (w-8 h-8) with fallback initials on colored background
- User avatars in top navigation: 32x32 circular

**Placeholder States:**
- Empty state illustrations: Use simple line-art SVG illustrations from undraw.co (blue monochrome)
- No data cards: Icon + text message, centered layout

This design system creates a professional, high-performance operations dashboard that prioritizes data visibility and operational clarity without any decorative distractions.