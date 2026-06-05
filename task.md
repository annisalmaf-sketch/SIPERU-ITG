# Task List: ITG Room Booking System Development

## 📋 Project Overview
Development of a Room Booking System for Institut Teknologi Garut (ITG) using the "Academic Excellence Portal" design system.

## 🛠️ Phases & Tasks

### 0. Project Initialization
- [x] Initialize Next.js app with TypeScript & Tailwind.
- [x] Set up `tailwind.config.ts` (using Tailwind v4 globals.css).
- [x] Install dependencies (`prisma`, `next-auth`, etc.).
- [x] Initialize Prisma and define base schema.
- [x] Create core UI components (Button, Input, Badge).
- [x] Migrate Login page to React.

### 1. Integration & Routing
- [x] Create reusable layout components (Sidebar, TopBar).
- [x] Implement Page-Based routing for all modules.
- [x] Migrate all dashboard views (Student, Admin, Kajur).
- [x] Refactor common components into reusable React components.

### 2. Functional Modules Implementation
- [x] **Frontend Migration**
    - [x] Migrate `login_itg_booking` to `src/app/login`.
    - [x] Migrate `dashboard_mahasiswa` to `src/app/dashboard/mahasiswa`.
    - [x] Migrate `dashboard_admin` to `src/app/dashboard/admin`.
    - [x] Migrate `dashboard_kajur` to `src/app/dashboard/kajur`.
    - [x] Migrate `form_booking_ruangan` to `src/app/booking`.
    - [x] Migrate `kelola_ruangan` to `src/app/rooms`.
    - [x] Migrate `riwayat_cetak` to `src/app/history`.
- [ ] **Authentication Module**
    - [x] Configure NextAuth with `CredentialsProvider`.
    - [x] Implement role-based redirection in `login`.
    - [x] Create singleton Prisma client.
    - [x] Seed database with initial users (Admin, Kajur, Student).
    - [x] Implement logout functionality.
- [x] **Booking Module**
    - [x] Connect "Book Now" buttons to form logic.
    - [x] Add date/time validation using Prisma/Backend.
    - [x] Implement "Purpose" field validation.
- [x] **Room Management Module**
    - [x] Finalize CRUD (Create, Read, Update, Delete) in `kelola_ruangan`.
    - [x] Add room status toggles (Available, Maintenance, In-Use).
- [x] **Approval Workflow**
    - [x] Create a "Pending Approvals" view for dashboards.
    - [x] Implement "Approve" and "Reject" actions.
- [x] **History & Reporting**
    - [x] Link `riwayat_cetak` to a dynamic data source.
    - [x] Implement "Print Evidence" functionality.

### 3. Design & UI/UX Refinement
- [x] Ensure all modules strictly follow the `DESIGN.md` guidelines (Colors, Typography, Spacing).
- [x] Standardize the Tailwind CSS configuration across all HTML files.
- [x] Add micro-animations (hover effects, transitions) to improve user engagement.
- [x] Verify mobile responsiveness for all dashboards and forms.

### 4. Data & Backend Simulation
- [x] Use Prisma DB to persist booking data.
- [x] Implement dynamic data fetching across all dashboards.
- [x] Add "Toast" notifications for successful actions (e.g., "Booking Submitted").

## ✅ Progress Tracking
- [x] Phase 1: Integration & Routing
- [x] Phase 2: Functional Modules
- [x] Phase 3: Design & UI/UX
- [x] Phase 4: Data persistence
