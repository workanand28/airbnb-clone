# Airbnb Listing Clone

## Project Overview

Airbnb Listing Clone is a responsive vacation-rental listing experience for **Romantic Jacuzzi 1BHK Candolim | Mirashya UG10**. It contains a React and TypeScript frontend built with Vite, a local typed listing data model, static image and font assets, and a small dependency-free Java HTTP service that exposes listing metadata.

The frontend is currently a self-contained visual prototype: it reads the complete listing content from `frontend/src/data/listing.ts` rather than fetching it from the Java service. The backend is a separate API contract prototype that can be run and tested independently.

## Features

- Airbnb-style listing page for desktop and mobile layouts.
- Local listing content, gallery images, review data, amenities, calendar data, and similar listings.
- Photo tour with room categories and grouped photo layouts.
- Lightbox with previous/next navigation and keyboard arrow support.
- Amenities modal, booking card, wishlist/share feedback, toast messages, and calendar navigation.
- Keyboard focus handling, Escape-to-close behavior, browser history integration, scroll locking, and a skip link.
- Dependency-free Java HTTP server with health and listing endpoints.

## Screenshots

The project is designed for desktop and mobile browser layouts. Reference screenshots used for visual comparison are kept in the optional `.reference/` scratch directory and are not required to run the application.

Expected reference captures include:

- Listing page top and full-page views
- Photo tour
- Lightbox
- Amenities modal
- Mobile listing view

To generate screenshots locally, start the frontend with `npm run dev` and use the project workflows in [`.claude/skills/pixel-diff/SKILL.md`](.claude/skills/pixel-diff/SKILL.md). No committed screenshot files are currently included in the repository.

## Tech Stack

### Frontend

- React 19
- TypeScript 5
- Vite 7
- React DOM
- Plain CSS in `frontend/src/globals.css`
- Custom icon component and local SVG/icon data

### Backend

- Java HTTP server from the JDK: `com.sun.net.httpserver.HttpServer`
- No Maven, Gradle, or third-party runtime dependencies
- Default port: `8080`

### Database

There is currently no database. Listing, review, amenity, calendar, and similar-listing content is stored as typed frontend fixture data. A future implementation can add persistence behind the Java API.

### Development and validation tools

- npm and the Vite development server
- TypeScript compiler
- JDK tools: `javac` and `java`
- PowerShell commands for local validation
- Playwright-compatible browser tooling for visual comparison

## Architecture

The current local request flow is:

```text
Browser
  |
  | loads Vite frontend at http://localhost:5173
  v
React ListingApp
  |
  | reads local typed fixtures and /assets/... media
  v
frontend/src/data/listing.ts + public/assets/

Separate development API:
Browser or API client -> http://localhost:8080 -> ListingServer.java
```

The frontend and backend are intentionally separate today. The React app does not call `/api/listing`; the Java service provides a small health and listing-summary contract for future integration. The architecture overview in [`architecture/architecture.html`](architecture/architecture.html) describes possible production additions such as persistence, caching, image delivery, API gateway controls, asynchronous events, and observability. Those services are documentation only and are not part of the local runtime.

## Project Structure

```text
.
|-- architecture/
|   `-- architecture.html       System architecture overview
|-- backend/
|   |-- README.md                Backend-specific commands
|   `-- src/main/java/com/airbnbclone/
|       |-- Listing.java          Listing API model
|       `-- ListingServer.java    HTTP server
|-- frontend/
|   |-- package.json              Vite and npm scripts
|   |-- index.html
|   |-- vite.config.ts
|   `-- src/
|       |-- main.tsx              React entry point
|       |-- globals.css            Application styling
|       |-- components/            Page sections and interactive overlays
|       |-- data/listing.ts        Typed listing content and gallery data
|       `-- lib/                   Icon components and icon definitions
|-- public/assets/                 Fonts, listing photos, avatars, and UI images
`-- README.md
```

Important files:

- [`frontend/src/main.tsx`](frontend/src/main.tsx): React entry point.
- [`frontend/src/components/ListingApp.tsx`](frontend/src/components/ListingApp.tsx): top-level UI state, overlays, history, focus, and scroll-lock behavior.
- [`frontend/src/components/ListingContent.tsx`](frontend/src/components/ListingContent.tsx): main listing page sections.
- [`frontend/src/components/PhotoTour.tsx`](frontend/src/components/PhotoTour.tsx): room-category photo tour.
- [`frontend/src/components/Lightbox.tsx`](frontend/src/components/Lightbox.tsx): full-screen image viewer.
- [`frontend/src/components/AmenitiesModal.tsx`](frontend/src/components/AmenitiesModal.tsx): complete amenities dialog.
- [`frontend/src/data/listing.ts`](frontend/src/data/listing.ts): typed fixture content and gallery data.
- [`frontend/src/globals.css`](frontend/src/globals.css): responsive layout and component styling.
- [`frontend/vite.config.ts`](frontend/vite.config.ts): Vite configuration and repository-level public asset directory.
- [`backend/src/main/java/com/airbnbclone/ListingServer.java`](backend/src/main/java/com/airbnbclone/ListingServer.java): Java API server.
- [`architecture/architecture.html`](architecture/architecture.html): architecture and production-evolution overview.

## Prerequisites

- Node.js and npm
- A JDK with `javac` and `java` available on `PATH`
- PowerShell on Windows, or equivalent shell commands on another operating system

## Installation

Install frontend dependencies from the repository root:

```powershell
Push-Location frontend
npm install
Pop-Location
```

The backend has no dependency installation step. It only requires a JDK that provides `javac` and `java`.

## Configuration

No `.env` file or environment variables are required for the current local application.

The default ports are configured in source:

- Frontend: `frontend/vite.config.ts`, port `5173`
- Backend: `backend/src/main/java/com/airbnbclone/ListingServer.java`, port `8080`

Static assets are served from the repository-level `public/` directory and referenced in the frontend with `/assets/...` URLs. If either port is changed, update the relevant documentation and local browser/API commands.

## Database Setup

No database is currently used. There are no migrations, schemas, seed scripts, database credentials, or database settings.

For a production version, listing metadata, availability, reservations, reviews, host data, and amenities should move from `frontend/src/data/listing.ts` into a backend persistence layer. That work would require choosing a database, defining migrations, adding connection configuration, and introducing loading/error states in the frontend.

## Running the App

### 1. Install and run the frontend

From the repository root:

```powershell
Push-Location frontend
npm install
npm run dev
Pop-Location
```

Open the URL printed by Vite, normally:

```text
http://localhost:5173
```

Useful frontend commands:

```powershell
Push-Location frontend
npm run dev       # Start the Vite development server
npm run build     # Type-check and create a production build
npm run preview   # Preview the production build locally
Pop-Location
```

### 2. Compile and run the backend

In a second terminal:

```powershell
Push-Location backend
New-Item -ItemType Directory -Force -Path out | Out-Null
javac -d out src/main/java/com/airbnbclone/Listing.java src/main/java/com/airbnbclone/ListingServer.java
java -cp out com.airbnbclone.ListingServer
Pop-Location
```

The server listens on:

```text
http://localhost:8080
```

The frontend and backend can be run independently. The current frontend reads its full listing model from `frontend/src/data/listing.ts`; it does not currently request that data from the Java service.

## API Documentation

### `GET /api/health`

Returns a simple service health response:

```json
{"status":"ok"}
```

### `GET /api/listing`

Returns the listing summary used as the backend contract prototype:

```json
{
  "title": "Romantic Jacuzzi 1BHK Candolim | Mirashya UG10",
  "location": "Candolim, Goa, India",
  "rating": 4.95,
  "reviewCount": 19,
  "price": "₹28,499",
  "guests": "2 guests"
}
```

The service returns JSON with `Access-Control-Allow-Origin: *` so a separately served local frontend can call it during development.

Example PowerShell requests:

```powershell
Invoke-RestMethod http://localhost:8080/api/health
Invoke-RestMethod http://localhost:8080/api/listing
```

`GET /api/listing` accepts only GET requests. Other methods return HTTP `405` with a JSON error body.

## Frontend Behavior

The main composition is in [`frontend/src/components/ListingApp.tsx`](frontend/src/components/ListingApp.tsx). It coordinates the listing page and three overlay states:

- **Photo tour:** open with “Show all photos”, jump between room categories, and open any image.
- **Lightbox:** navigate with buttons or `ArrowLeft`/`ArrowRight`; close with Escape or browser Back.
- **Amenities modal:** inspect the complete amenity list and close with the close button, backdrop, Escape, or browser Back.

Other interactive areas include the save button, share feedback, reserve feedback, description expansion, calendar month navigation, and the similar-listings carousel. Overlay state is synchronized to query parameters such as `?view=photos` and `?view=amenities`, allowing browser history to close the active view naturally.

## Testing

There is currently no automated unit, integration, or end-to-end test script in `frontend/package.json`. The available automated checks are the TypeScript/Vite production build and Java compilation/API smoke checks:

```powershell
Push-Location frontend
npm run build
Pop-Location

Push-Location backend
New-Item -ItemType Directory -Force -Path out | Out-Null
javac -d out src/main/java/com/airbnbclone/Listing.java src/main/java/com/airbnbclone/ListingServer.java
Pop-Location
```

For manual UI testing, verify the listing page at desktop and mobile widths, photo tour, lightbox buttons and keyboard navigation, amenities modal, calendar navigation, Escape behavior, browser Back behavior, focus restoration, scroll locking, toast feedback, skip link, reduced-motion behavior, and failed asset requests.

## Data and Assets

The typed content model lives in [`frontend/src/data/listing.ts`](frontend/src/data/listing.ts). It contains:

- Listing title, location, price, dates, host, and summary details.
- Hero gallery and photo-tour room layouts.
- Highlights, amenities, sleep arrangements, reviews, ratings, and house rules.
- Similar listings and review-category images.

Static media is served from [`public/assets`](public/assets). Image references use the `/assets/...` URL path, which works in both Vite development and production builds.

## Deployment

No deployment manifests, Dockerfiles, CI/CD workflows, or cloud environment configuration are included yet.

For a simple deployment, build the frontend with `npm run build` and serve `frontend/dist` from a static web server. Compile and run the Java backend separately, then place it behind a production API gateway or reverse proxy. A production deployment should also configure CORS, HTTPS, logging, health checks, secrets, persistence, and asset delivery.

## Validation

Run the frontend build:

```powershell
Push-Location frontend
npm install
npm run build
Pop-Location
```

Compile the backend:

```powershell
Push-Location backend
New-Item -ItemType Directory -Force -Path out | Out-Null
javac -d out src/main/java/com/airbnbclone/Listing.java src/main/java/com/airbnbclone/ListingServer.java
Pop-Location
```

With the backend running, smoke-test the API:

```powershell
Invoke-RestMethod http://localhost:8080/api/health
Invoke-RestMethod http://localhost:8080/api/listing
```

For a manual UI check, verify the listing page, responsive layout, photo tour, lightbox controls, amenities modal, Escape and browser Back behavior, focus restoration, scroll lock, toast feedback, keyboard navigation, and reduced-motion behavior.

Generated validation output can be removed after testing:

```powershell
Remove-Item -Recurse -Force frontend/dist, frontend/tsconfig.tsbuildinfo, backend/out -ErrorAction SilentlyContinue
```

## Troubleshooting

### `npm` or `node` is not recognized

Install Node.js and ensure both `node` and `npm` are available on `PATH`. Reopen the terminal after installation.

### `javac` or `java` is not recognized

Install a JDK, configure `JAVA_HOME` if needed, and add the JDK `bin` directory to `PATH`.

### Port 5173 or 8080 is already in use

Stop the process using the port, change the frontend port in `frontend/vite.config.ts`, or change the backend `PORT` constant in `ListingServer.java`.

### Images or fonts do not load

Confirm the frontend is run through Vite and that URLs use `/assets/...`. Do not use `/public/assets/...`; Vite exposes the repository `public/` directory at the web root.

### The frontend does not show backend data

This is expected in the current version. The UI uses local fixture data from `frontend/src/data/listing.ts`; the API is not wired into the React data flow yet.

### Generated files appear after validation

Remove them with:

```powershell
Remove-Item -Recurse -Force frontend/dist, frontend/tsconfig.tsbuildinfo, backend/out -ErrorAction SilentlyContinue
```

## Future Improvements

- The frontend has no test script at present; `npm run build` is the available automated frontend gate.
- The backend is intentionally small and keeps the current API contract in one Java source file.
- Listing content is currently fixture data. A production implementation would move listing, availability, booking, and review persistence behind the backend.
- Connect the React data layer to the Java API with typed request and response models.
- Add a database, migrations, seed data, and availability/reservation persistence.
- Add automated unit, API, accessibility, and browser tests.
- Add real search, booking, authentication, host management, and payment flows.
- Add responsive image optimization and production asset delivery.
- Add Docker, CI/CD, monitoring, logging, and deployment manifests.

## License

No license file or distribution terms are currently included in the repository. Treat this project as private source code unless the project owner adds a license that grants reuse, modification, or redistribution rights.