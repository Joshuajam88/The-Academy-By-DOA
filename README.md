# DOA ACADEMY — React + Vite

Responsive academy website with a sticky navigation, founder hero, multi-image layouts, Cohort 1 ongoing / Cohort 2 coming soon, enrollment, Google Classroom sign-in, two signup methods, Supabase backend integration, events/updates structure, and a live OpenStreetMap/Leaflet map.

## Run
```bash
npm install
npm run dev
```

## Supabase
Copy `.env.example` to `.env`, add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`, then run `supabase/schema.sql` in Supabase SQL Editor.

## Sign in
The navbar **Sign in** button opens **Google Classroom** in a new tab: `https://classroom.google.com/`.

If you want students to go directly to a particular Classroom class, replace that URL in `src/App.jsx` with your class invite/classroom URL.

## Sign up
The navbar **Sign up** button opens two choices:
1. **Continue with Gmail** — uses Supabase Google OAuth. Enable Google provider in Supabase Authentication and configure your Google OAuth credentials/redirect URL.
2. **Complete sign-up form** — creates a normal Supabase email/password account and stores student profile metadata.

## Enrollment
The Enroll button opens a student enrollment form and stores records in the `students` table when Supabase is configured. Registration dates are currently Oct 5, 2026 through Nov 15, 2026; edit the `academy.registration` object in `src/App.jsx` when your dates change.

## Images
Replace the SVG placeholders in `public/images/` with your own photos from VS Code. The main gallery uses separate image slots, not one single image area.

## Map
Update `academy.location.address`, `lat`, and `lng` in `src/App.jsx` to your actual academy location.
