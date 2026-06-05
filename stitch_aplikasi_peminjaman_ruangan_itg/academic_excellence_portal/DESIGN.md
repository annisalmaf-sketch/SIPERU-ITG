---
name: Academic Excellence Portal
colors:
  surface: '#f9f9ff'
  surface-dim: '#cfdaf2'
  surface-bright: '#f9f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f0f3ff'
  surface-container: '#e7eeff'
  surface-container-high: '#dee8ff'
  surface-container-highest: '#d8e3fb'
  on-surface: '#111c2d'
  on-surface-variant: '#434655'
  inverse-surface: '#263143'
  inverse-on-surface: '#ecf1ff'
  outline: '#737686'
  outline-variant: '#c3c6d7'
  surface-tint: '#0053db'
  primary: '#004ac6'
  on-primary: '#ffffff'
  primary-container: '#2563eb'
  on-primary-container: '#eeefff'
  inverse-primary: '#b4c5ff'
  secondary: '#712ae2'
  on-secondary: '#ffffff'
  secondary-container: '#8a4cfc'
  on-secondary-container: '#fffbff'
  tertiary: '#51555b'
  on-tertiary: '#ffffff'
  tertiary-container: '#696d74'
  on-tertiary-container: '#edf0f8'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dbe1ff'
  primary-fixed-dim: '#b4c5ff'
  on-primary-fixed: '#00174b'
  on-primary-fixed-variant: '#003ea8'
  secondary-fixed: '#eaddff'
  secondary-fixed-dim: '#d2bbff'
  on-secondary-fixed: '#25005a'
  on-secondary-fixed-variant: '#5a00c6'
  tertiary-fixed: '#dfe2ea'
  tertiary-fixed-dim: '#c3c6ce'
  on-tertiary-fixed: '#181c21'
  on-tertiary-fixed-variant: '#43474d'
  background: '#f9f9ff'
  on-background: '#111c2d'
  surface-variant: '#d8e3fb'
typography:
  display-lg:
    fontFamily: Manrope
    fontSize: 48px
    fontWeight: '800'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  h1:
    fontFamily: Manrope
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
  h2:
    fontFamily: Manrope
    fontSize: 24px
    fontWeight: '700'
    lineHeight: '1.3'
  h3:
    fontFamily: Manrope
    fontSize: 20px
    fontWeight: '600'
    lineHeight: '1.4'
  body-md:
    fontFamily: Manrope
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  body-sm:
    fontFamily: Manrope
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
  label-caps:
    fontFamily: Manrope
    fontSize: 12px
    fontWeight: '700'
    lineHeight: '1.0'
    letterSpacing: 0.05em
  button:
    fontFamily: Manrope
    fontSize: 15px
    fontWeight: '600'
    lineHeight: '1.0'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 8px
  container-max: 1280px
  gutter: 24px
  margin-page: 32px
  stack-xs: 4px
  stack-sm: 12px
  stack-md: 24px
  stack-lg: 48px
---

## Brand & Style

The brand personality for this design system is rooted in academic rigor, technical innovation, and administrative clarity. As the interface for the Institut Teknologi Garut (ITG), it must bridge the gap between traditional institutional trust and a forward-thinking technological curriculum. 

The design style is **Corporate / Modern** with subtle **Glassmorphism** accents. It prioritizes a clean, high-information-density environment that feels effortless to navigate. The aesthetic is "Academic Tech"—relying on deep blues to signal stability and vibrant purples to represent the digital-first nature of the institution. The interface should evoke a sense of organized efficiency, reducing the cognitive load of room scheduling through spatial breathing room and logical hierarchy.

## Colors

The palette revolves around a "Power Duo" of Blue and Purple. The primary blue represents the institutional foundation of ITG, while the purple secondary color adds a modern, energetic layer suitable for a tech institute.

Gradients are used strategically for primary actions and high-level visual anchors (like header backgrounds or active states) to differentiate the application from standard, flat administrative software. The background remains primarily neutral and light to ensure maximum readability of room data and schedules. Use the "Subtle Gradient" for large container backgrounds to add depth without distracting from content.

## Typography

This design system utilizes **Manrope** for its balanced, modern, and highly legible geometric qualities. It functions as both a display face and a functional body face, providing a cohesive look across the entire application.

Headlines should use tighter letter-spacing and heavier weights to command attention, while body text maintains a generous line height (1.6x) to ensure schedules and room details are easy to scan. The `label-caps` style is specifically reserved for metadata, such as room types (e.g., "LABORATORY") or status indicators, to provide a distinct visual layer from the main content.

## Layout & Spacing

The layout is built on a **12-column fixed grid** for desktop views, ensuring that room booking tables and dashboards maintain structural integrity across institutional hardware. For smaller screens, the layout shifts to a fluid, single-column model.

A strict **8px spacing scale** is used to drive rhythm. Large components, such as room cards and booking summaries, should use the `stack-md` (24px) spacing for internal padding. Page headers and section breaks should utilize `stack-lg` (48px) to provide clear visual separation between different functional areas of the application.

## Elevation & Depth

Visual hierarchy is established through **Tonal Layers** and **Ambient Shadows**. Instead of heavy borders, this design system uses soft, diffused shadows with a slight blue tint (`rgba(37, 99, 235, 0.08)`) to lift cards off the background.

- **Level 0 (Base):** The main canvas, using `tertiary_color_hex` or a very light gray.
- **Level 1 (Cards):** White background with a subtle 1px border (`#E2E8F0`) and a small shadow. Used for room listings and table containers.
- **Level 2 (Modals/Popovers):** Higher elevation with a medium shadow and 10% backdrop blur, creating a glass-like focus on the interaction layer.
- **Interactive Depth:** On hover, cards should slightly lift (increase shadow spread) and transition the border color toward the primary blue.

## Shapes

The shape language is **Rounded**, utilizing a 0.5rem (8px) base radius. This strikes the right balance between the approachable nature of a student-facing app and the professionalism required for staff administration.

- **Standard Elements:** 8px radius (Buttons, Input fields, Small cards).
- **Large Containers:** 16px radius (Main dashboard panels, Modal windows).
- **Full Round:** Pill shapes are reserved exclusively for status badges and tags (e.g., "Available", "Maintenance") to distinguish them from interactive buttons.

## Components

### Navigation
The primary navigation should be a persistent **Left Sidebar** on desktop, using the brand gradient for the active state indicator. Navigation items should be icon-led, using refined line-art icons.

### Striped Tables
Tables are the heart of the room booking system. Use **Zebra Striping** with the `tertiary_color_hex` for even rows. Borders should be horizontal-only to emphasize the flow of data. Headers should be sticky and use the `label-caps` typography style.

### High-Quality Badges
Badges use a pill-shape and a dual-tone approach: a light background color with a high-contrast text color (e.g., a "Confirmed" badge uses a very light green background with dark emerald text). For featured or high-priority statuses, use the primary gradient background with white text.

### Buttons
- **Primary:** Gradient background (`gradient_primary`) with a subtle inner glow.
- **Secondary:** White background with a primary blue border.
- **Tertiary:** Transparent background with blue text for low-priority actions like "Cancel."

### Input Fields
Inputs should have a 1px border that transforms into a 2px blue/purple gradient border on focus. Include clear validation states (Error: Red, Success: Green) using small, helper text icons.

### Room Cards
Cards should display a high-quality image of the room with an overlaid "Capacity" badge. The bottom section of the card should use a clean, white background to list amenities using icons.