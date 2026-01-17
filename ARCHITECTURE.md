# TrekSite — Architecture & Tech Stack

This document outlines a recommended architecture and tech stack for the Trekking website MVP and production-ready app, prioritizing the core features you listed.

---

## High-level summary (recommended)

- Frontend: React (Vite) — current codebase. Use React Router, hooks, and functional components.
- Backend / Platform: Supabase (Postgres) for fast MVP: provides Auth (email/social), Postgres DB, Storage (images/videos), Realtime and Serverless functions. Alternative: custom Node.js (NestJS or Express) + PostgreSQL (with PostGIS) if you want full control.
- Maps: Mapbox (or Google Maps). Mapbox offers offline tiles and better developer pricing for map styling.
- Real-time / Tracking: lightweight WebSocket service (Socket.IO) or Supabase Realtime for broadcasts. For continuous GPS streaming, prefer a small Node/Socket.IO server or a managed real-time provider (Pusher/Ably).
- Storage: Supabase Storage (S3-compatible) or AWS S3 for images / videos and user uploads.
- Weather: OpenWeatherMap or WeatherAPI for live & forecast data.
- Auth / Social Login: Supabase Auth (supports OAuth providers) or Auth0/Firebase Auth as alternatives.
- Push Notifications: Firebase Cloud Messaging or OneSignal for mobile/web push.
- Hosting & Deployment: Frontend on Vercel/Netlify; backend functions on Supabase Edge Functions, or host Node on Fly.io / DigitalOcean / AWS ECS.
- Analytics: Plausible or Google Analytics; error tracking via Sentry.

---

## Why Supabase (recommended for MVP)

- Built-in Auth (email + OAuth) reduces implementation time.
- Postgres DB (relational) good for complex queries and analytics; extensions available (PostGIS for spatial queries if needed).
- Storage for photos/videos, and immediate integration with Row-Level Security (RLS).
- Realtime via replication / websocket events — useful for live event updates and simple presence.
- Simple developer experience and manageable hosting costs.

Trade-offs: Supabase is opinionated; for highly custom real-time or heavy streaming you may still run a dedicated Node server.

---

## Core data models (high-level)

- User
  - id, email, displayName, avatar_url, created_at
- Profile
  - user_id -> User
  - bio, location, trekking_history (JSON), badges (JSON), settings
- Trek
  - id, name, slug, description, location (text), geometry (GeoJSON / route waypoints), length_km, elevation_gain, difficulty (enum), duration_est, images[], created_by, published
- Waypoint (optional)
  - trek_id, lat, lng, name, notes, altitude
- Review
  - id, trek_id, user_id, rating, body, photos[], created_at
- Event
  - id, trek_id (optional), title, date, capacity, organizer
- SOS / Tracking Session
  - id, user_id, trek_id, status, current_location, started_at, live_positions (time-sequenced)

Store media in Storage and reference URLs in DB.

---

## API surface (examples)

- Auth: handled by Supabase Auth (signup, sign-in, oauth callbacks)
- GET /api/treks?q=&location=&difficulty=&min_length=&max_length=
- GET /api/treks/:id
- POST /api/treks (CMS/admin)
- POST /api/treks/:id/reviews
- POST /api/uploads (signed uploads or direct to storage)
- POST /api/tracking/start -> returns session id
- POST /api/tracking/:sessionId/position -> append position (or use WebSocket channel)
- POST /api/sos -> notify emergency contacts with current location

For realtime telemetry, prefer WebSocket channels.

---

## Offline maps & PWA

- Make the frontend a PWA (service worker + manifest).
- Allow users to download route tiles or a compact route GeoJSON package for offline routing/navigation (Mapbox offline SDK or tilepack). Storing tile caches is OS/platform-limited — mobile apps handle this better than pure web.

---

## GPS Tracking and Progress

- Client reads navigator.geolocation periodically (with highAccuracy options) and streams positions via WebSocket to backend.
- Backend stores the positions and calculates distance/elevation using Haversine + elevation samples (or use a small server-side library). Show progress, pace, ETA.

---

## Security & Privacy

- Use HTTPS everywhere.
- Protect upload endpoints via signed URLs / token-based uploads.
- RLS (row-level security) for Supabase to control who can update which rows (e.g., only admins or owners can edit a trek).
- Encrypt sensitive data at rest if storing personal data; follow GDPR/CCPA requirements if applicable.

---

## Admin / CMS

- Use Supabase Studio for admin tasks early on.
- For richer CMS experience, add Strapi / Netlify CMS / Sanity or a custom admin UI.

---

## Third-party integrations

- Mapbox: routing and tiles
- OpenWeatherMap: weather for trek coordinates
- Pusher/Ably or Socket.IO: real-time tracking (if not using Supabase Realtime)
- Twilio (SMS) or SendGrid for emergency notifications (SMS/Email)

---

## Priority next steps (concrete)

1. Create a Supabase project, enable Auth providers (Email, Google), and create the initial schema for `users`, `profiles`, `treks`, `reviews`, `tracking_sessions`.
2. Wire frontend auth to Supabase and implement sign-up/sign-in flows in the React app.
3. Implement basic `treks` CRUD and show live map of treks (Mapbox) with sample GeoJSON.
4. Implement image uploads to Supabase Storage and review flow.

---

## Recommended tech picks (concise)

- Frontend: React + Vite (existing)
- Backend: Supabase (Postgres + Auth + Storage + Realtime)
- Maps: Mapbox GL JS
- Realtime streaming: Socket.IO (or Supabase Realtime for simpler use)
- Storage: Supabase Storage (S3-compatible)
- Weather: OpenWeatherMap
- Hosting: Vercel for frontend; Supabase for DB/functions/storage

---

If you approve, next I will:

- (A) Create the initial DB schema SQL and example migration file (for Supabase/Postgres), and/or
- (B) Start implementing User Registration & Login UI and wiring to Supabase Auth.

Which option would you like me to start with? (A or B)