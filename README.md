# Adam Dental Center — client demo

Next.js App Router, React, TypeScript, Tailwind CSS, Motion, next-intl, React Hook Form, Zod and Lucide.

## Run

npm install
npm run dev

Open /fr, /en, or /ar. The demonstration management area is /admin.

npm run typecheck
npm run build
npm start

## Demo boundaries

Appointment requests, service activation and availability settings are stored in browser localStorage. Use fictional patient information only. The admin entrance is an explicit demo gate, not authentication. No notifications are sent. Pending requests are never presented as confirmed. Calendar hours are fictional. Catalog offerings require verification. No patient testimonials, ratings, credentials, contact details, or outcomes have been invented. Educational video content is awaiting approved assets.

## Deployment

Import this repository into Vercel as a Next.js project. Build command: npm run build. Set NEXT_PUBLIC_SITE_URL to the verified deployment URL to enable the sitemap and language alternates. No backend configuration is necessary for this local demonstration.

## Production integration

Replace the functions in lib/data.ts with a repository backed by server APIs, for example Supabase. Add server authentication and role-based authorization before exposing any management routes. Move scheduling validation and transactional conflict protection to the database. Add consent, retention, audit and privacy controls before handling real patient information. Verify offered services, exact address, contact details and opening hours. localStorage is not an appropriate medical records store.

## Approved assets

The four supplied photographs and logo are included under public/images. They are displayed without generative edits. Next Image produces responsive optimized versions.

## Validation

TypeScript checks and production compilation pass. Seven scheduling tests cover working hours, breaks, closures, pending and confirmed reservations, cancellations, differing service lengths, buffers, and Casablanca timezone boundaries. Browser checks cover all six booking steps, empty-field validation, dashboard confirmation, reserved-slot exclusion, Arabic RTL, responsive navigation, and equivalent service-page language switching. An HTTP route check verifies all 43 public/admin routes and invalid-route 404 responses.

Run `npm test` for scheduling tests. With the local server running, use `npm run test:routes`; set TEST_BASE_URL if using a port other than 3000.

Approved educational videos, verified contact details and a production backend remain launch prerequisites. The demo deliberately has no fabricated testimonials or external notification delivery.
