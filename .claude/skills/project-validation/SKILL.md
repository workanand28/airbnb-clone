---
name: project-validation
description: Validate this Windows React/Vite Airbnb listing frontend, dependency-free Java backend, API smoke behavior, interactive overlay states, diagnostics, and generated-output cleanup.
---

# Project validation

Run these gates from the repository root in PowerShell.

The frontend runs on `http://localhost:5173` and serves the repository-level `public/` directory at `/assets/...`. The backend runs independently on `http://localhost:8080`; the current frontend uses the typed fixture model in `frontend/src/data/listing.ts` and does not require the backend to render.

## Frontend gate

```powershell
Push-Location frontend
npm ci
npm run build
Pop-Location
```

Use `npm install` instead of `npm ci` only when dependencies need to be refreshed or the lockfile is intentionally changing. The build must pass TypeScript and Vite bundling. Treat diagnostics in `frontend/` as failures, including deprecated compiler options and unresolved `/assets/...` references.

## Backend gate

```powershell
Push-Location backend
New-Item -ItemType Directory -Force -Path out | Out-Null
javac -d out src/main/java/com/airbnbclone/Listing.java src/main/java/com/airbnbclone/ListingServer.java
Pop-Location
```

The backend has no Maven or Gradle project and requires only a JDK with `javac` and `java` on `PATH`.

## API smoke gate

Start the compiled server in a separate terminal:

```powershell
Push-Location backend
java -cp out com.airbnbclone.ListingServer
Pop-Location
```

Then verify:

```powershell
Invoke-RestMethod http://localhost:8080/api/health
Invoke-RestMethod http://localhost:8080/api/listing
```

The health response must report `ok`. The listing response must contain `Romantic Jacuzzi 1BHK Candolim | Mirashya UG10`, location `Candolim, Goa, India`, and a numeric rating of `4.95`. Confirm that a non-`GET` request to `/api/listing` returns HTTP 405 when testing method handling.

## UI behavior gate

With `npm run dev` running in `frontend/`, verify these states and behaviors:

- Listing page at desktop and mobile widths, including hero images and the sticky booking card.
- Photo tour opened with `?view=photos` and room-category navigation.
- Lightbox opened with `?view=photos&photo=1`, previous/next buttons, ArrowLeft/ArrowRight, and close behavior.
- Amenities modal opened with `?view=amenities`, backdrop close, and complete amenity content.
- Calendar previous/next month controls and selected-date presentation.
- Escape behavior, browser Back behavior, focus restoration, scroll lock, toast feedback, skip link, and reduced-motion behavior.
- Console errors, failed image requests, and missing fonts. A lone favicon 404 is not a product failure.

## Cleanup gate

Build output is not part of the submission. Remove `frontend/dist`, `frontend/tsconfig.tsbuildinfo`, and `backend/out` after validation. These paths are ignored by `.gitignore`.

```powershell
Remove-Item -Recurse -Force frontend/dist, frontend/tsconfig.tsbuildinfo, backend/out -ErrorAction SilentlyContinue
```