---
name: reference-capture
description: Capture the reference listing's DOM, CSS, assets, icons, content, and screenshots for this Windows React/Vite Airbnb listing clone. Use at the start of a cloning task or when re-capturing a specific listing overlay/state.
---

# Reference capture

Extract everything needed to reproduce the vacation-rental listing exactly, then work from the captured spec instead of repeatedly querying the live site. Keep captures in `.reference/`; this directory is scratch input for the clone and must not be copied into the shipped frontend bundle.

## Project context

- Repository root: `E:\Work\Extra\airbnb-clone-main`
- Frontend: `frontend/`, React 19 + TypeScript + Vite
- Frontend dev URL: `http://localhost:5173`
- App mount: `#root`; entry point: `frontend/src/main.tsx`
- Static assets: repository-level `public/assets/`, served as `/assets/...` by the Vite `publicDir` setting
- Current listing model: `frontend/src/data/listing.ts`
- Important UI states: listing page, photo tour, lightbox, and amenities modal
- Optional backend: dependency-free Java service at `http://localhost:8080`; it is not required for reference capture because the current frontend uses local fixture data

Run the clone locally when comparing or replaying captured states:

```powershell
Push-Location frontend
npm install
npm run dev
Pop-Location
```

## 1. Get past a JS/bot checkpoint
Headless fetches and `--dump-dom` get blocked (you'll see "Vercel Security Checkpoint" / "could not be verified"). Launch a **real, non-automated Chrome** with a debug port, let it solve the challenge once, then attach over CDP:

```powershell
$chrome = "${env:ProgramFiles}\Google\Chrome\Application\chrome.exe"
& $chrome --user-data-dir="$env:TEMP\airbnb-reference-profile" --remote-debugging-port=9222 --no-first-run "https://TARGET"
# Wait for the checkpoint to clear, then inspect http://localhost:9222/json.
```

Then connect with `rebrowser-playwright-core` from the capture script:
```js
const b = await chromium.connectOverCDP("http://localhost:9222");
const page = b.contexts()[0].pages().find(p => p.url().includes("TARGET"));
```
Wait until the reference SPA root is populated (`#root`/`#__next` has children) before extracting; a checkpoint page may share the final URL.

For the local clone, use a fresh headless browser context against `http://localhost:5173`. Do not use the CDP-attached protected reference tab to validate the clone.

## 2. Extract the spec
- **DOM outline**: walk the tree emitting `tag#id.class [aria-* role alt href] "text"` — compact and diff-friendly. Capture the listing root and each overlay separately so changes can be reviewed against the matching React components.
- **CSS**: read every `<link rel=stylesheet>` and `<style>` from *inside the page* (`fetch` uses the verified session). Also dump `document.styleSheets` KEYFRAMES rules for animations.
- **Icons**: map each labelled element to the SVG it contains (`{ "amen:Wifi": "<svg…>" }`) so you reproduce icons by context, not guesswork.
- **Assets**: regex `/assets/...` (and `srcset`) out of the HTML/CSS, download each via in-page `fetch`→base64, and mirror the path layout under `public/assets/`. Preserve image extensions and record missing or blocked assets rather than substituting silently.
- **Content**: pull long text (description, reviews, amenities, host details) fully — outlines truncate. Compare captured content with `frontend/src/data/listing.ts` before changing the fixture model.

## 3. Screenshot every view/state

Capture at least these states at `1440x900` with `deviceScaleFactor: 2`, plus a representative mobile viewport such as `390x844`:

1. Listing page at the top of the page, including the header, title, hero gallery, and booking card.
2. Listing page after scrolling through the content sections.
3. Photo tour opened with `?view=photos`.
4. Lightbox opened with `?view=photos&photo=1`, including previous/next controls.
5. Amenities modal opened with `?view=amenities`.
6. Calendar after moving to the next month.

For overlays, drive the UI (`click`, `keyboard.press`) and record the URL/query state, focused element, scroll position, and screenshot. Capture tall views as full-page screenshots; if a crop is needed, use a cross-platform image tool or a Playwright clip rather than relying on macOS-only `sips`.

Suggested output names:

```text
.reference/
  listing-top.png
  listing-full.png
  phototour-full.png
  lightbox.png
  amenities.png
  calendar-next-month.png
  mobile-listing.png
  outline-listing.txt
  css-0-inline
  icon-map.json
```

These names match the project’s fidelity-review workflow where applicable. Keep reference files separate from generated frontend output such as `frontend/dist/`.

## Gotchas
- Screenshots over a CDP-attached tab can time out if the tab isn't foreground — prefer a fresh headless context for shots of the local clone; use the attached session only for the protected reference.
- Save a `storageState` after clearing the checkpoint to skip it on re-runs.
- Verify that local asset URLs resolve from `/assets/...`, not `/public/assets/...`; Vite exposes the repository `public/` directory at the web root.
- Check that the clone's modal states preserve browser Back, Escape, focus restoration, and scroll locking, because these are deliberate behaviors in `frontend/src/components/ListingApp.tsx`.
- Use the matching `.reference/` files as input to `pixel-diff`; do not overwrite the captured reference image with a clone screenshot.
- Keep captured reference material in `.reference/`, out of the shipped bundle and out of `frontend/src/data/listing.ts` unless the content is intentionally converted into fixture data.
