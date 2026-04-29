# College Discovery Platform

Modern college search + decision app inspired by Careers360 / Collegedunia.

## Features
- Responsive premium navbar, hero, and featured colleges
- College listing with search, location/course/fees filters, sorting, and load-more pagination
- College detail page (`/college/[id]`) with overview, courses, Save + Compare actions
- Compare page (`/compare`) for 2–3 selected colleges with a professional comparison table
- Authentication (`/login`, `/signup`) using JWT
- Saved colleges (`/saved`) using `localStorage` initially, with optional backend sync when logged in
- Backend REST APIs (modular routes/controllers)

## Repo structure
- `frontend/` — Next.js (App Router) + Tailwind CSS
- `backend/` — Express.js REST API + JWT auth

## Setup
1. Install dependencies:
   - `npm install` (at repo root)
2. Create environment files:
   - Copy `.env.example` to `.env` (at repo root if you want local values)
3. Run development:
   - `npm run dev`

Frontend:
- http://localhost:3000

Backend:
- http://localhost:4000

## Build
- `npm run build`

## Deployment
- Frontend: deploy with Vercel from the root repository. `vercel.json` points Vercel to `frontend/package.json`.
- Backend: deploy with Render as a Node web service from the `backend/` folder. `render.yaml` includes the required service configuration.

### Recommended production environment variables
- `NEXT_PUBLIC_API_BASE_URL` — the public Render backend URL (for frontend builds and browser requests)
- `JWT_SECRET` — backend JWT signing secret
- `JWT_EXPIRES_IN` — JWT expiration (default: `7d`)
- `CORS_ORIGIN` — frontend origin or `*` for open access
- `NODE_ENV=production` for the backend service

### Render backend setup
- Root service: `backend`
- Build command: `npm install && npm run build`
- Start command: `npm run start`
- Health check: `/health`

## Backend API
- `GET /api/colleges`
- `GET /api/colleges/:id`
- `POST /api/login`
- `POST /api/signup`
- `POST /api/save-college`
- `GET /api/saved-colleges`

JWT:
- Send `Authorization: Bearer <token>` for authenticated endpoints.

## PostgreSQL-ready
- `backend/db/schema.sql` includes a schema for users, colleges, and saved_colleges.
- Current runtime uses mock dataset + JSON-file persistence for accounts/saved until you wire Postgres.

