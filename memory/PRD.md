# DentalHub - PRD

## Original Problem Statement
Dental implant noting application for dentists. Doctor login and signup with comprehensive registration (personal details, picture, educational details, location/country-specific registration number, college name). Comprehensive log for each patient including an FDI dental chart for single implants, bridges, and full mouth rehabs. Each implant log must capture extensive details: insertion torque, size, length, brand, name, connection type, hex, conical, and surgical approaches (immediate/delayed). Must include osseointegration day counting/reminders (e.g., 90 days). Support tracking of bone grafts, direct/indirect sinus lifts, pterygoid, zygomatic, and subperiosteal implants. Includes multiple clinic consultations, implant analysis, and financial analysis.

## User Personas
- **Dentists/Implantologists**: Primary users who log implant cases, manage patients, track osseointegration timelines

## Core Architecture
- **Frontend**: React + Tailwind CSS + Shadcn UI + Phosphor Icons
- **Backend**: FastAPI + MongoDB (Motor async driver)
- **Storage**: Emergent Object Storage for medical photos/radiographs
- **Auth**: JWT (httpOnly cookies) with access + refresh tokens

## What's Been Implemented
- [x] JWT Auth (login, register, logout, cookie-based sessions)
- [x] Dashboard with Clinical Cases, Clinic Status, Active Patient Queue
- [x] Patient CRUD with doctor-scoped data
- [x] FDI Dental Chart with horizontal scroll and tooth selection
- [x] Comprehensive Implant Tracking Modal (torque, brand, connection, grafts, sinus lifts, etc.)
- [x] Medical Vault — photo/radiograph uploads with date-wise folders
- [x] Analytics endpoints matching Excel template fields
- [x] Clinics management
- [x] Backend schema expanded for all Excel reference columns (complications, ISQ, follow-up, etc.)
- [x] **Profile Header** — Top-right header with doctor name, avatar, dropdown menu (My Account, Settings, Logout) — *Completed March 30, 2026*
- [x] **Account Page** — Displays all doctor registration details (name, email, phone, country, reg number, college, specialization) — *Completed March 30, 2026*

## Prioritized Backlog
### P1 - High Priority
- [ ] Account edit functionality (allow doctors to update their profile details)
- [ ] Osseointegration day counter & reminder system (90-day alerts on dashboard/patient page)

### P2 - Medium Priority
- [ ] Financial analysis module (cost tracking per implant/patient)
- [ ] Refactor PatientDetails.js — split FDI Chart and Implant Modal into separate components

### P3 - Low Priority / Future
- [ ] Multi-clinic support and switching
- [ ] Export implant data to PDF/Excel reports
- [ ] Push notifications for osseointegration milestones

## Key Files
- `/app/backend/server.py` — All API routes and MongoDB models
- `/app/frontend/src/components/Layout.js` — Layout with sidebar, top header, bottom nav
- `/app/frontend/src/pages/Account.js` — Doctor account profile page
- `/app/frontend/src/pages/PatientDetails.js` — FDI chart + implant modal (large file, fragile JSX)
- `/app/frontend/src/pages/MedicalVault.js` — Photo/radiograph gallery
- `/app/frontend/src/contexts/AuthContext.js` — Auth state management

## Key API Endpoints
- `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me`, `POST /api/auth/logout`
- `GET/POST /api/patients`, `GET /api/patients/:id`
- `GET/POST /api/implants`
- `POST /api/upload`
- `GET /api/analytics/overview`, `GET /api/analytics/financial`
- `GET/POST /api/clinics`

## Known Issues
- PatientDetails.js is very large and prone to JSX nesting errors when edited
- Active user email: midhilesh.krishna@gmail.com (data was wiped for fresh start)
