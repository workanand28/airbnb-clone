---
name: pixel-diff
description: Screenshot the Windows React/Vite Airbnb listing clone and compare a view or region against the captured reference to find visual deltas. Use after building or editing the listing page, photo tour, lightbox, amenities modal, or calendar.
---

# Pixel diff

Tight loop for verifying visual fidelity against `.reference/` screenshots.

## Capture the clone

Start the Vite app from the repository root if it is not already running:

```powershell
Push-Location frontend
npm run dev
Pop-Location
```

Match the reference capture settings exactly: **1440x900, deviceScaleFactor 2**, fonts loaded. Use a second run at approximately **390x844** for responsive changes. The clone is mounted at `#root` and static media must resolve from `/assets/...` because Vite serves the repository-level `public/` directory at the web root.

```js
const b = await chromium.launch({channel:"chrome", headless:true});
const p = await b.newPage({viewport:{width:1440,height:900}, deviceScaleFactor:2});
await p.goto("http://localhost:5173", {waitUntil:"networkidle"});
await p.waitForTimeout(800);
await p.screenshot({path:".reference/clone-listing-full.png", fullPage:true});
await b.close();
```

For overlays, drive the UI first (`click`, `keyboard.press`), then shoot. Capture at least `?view=photos`, `?view=photos&photo=1`, and `?view=amenities`. Log `console`/`pageerror` to catch missing assets; a lone favicon 404 is fine.

## Compare a region

Use `element.boundingBox()` to capture the same component from the clone and reference rather than guessing offsets. Playwright `clip` is preferred because it works on Windows and preserves the exact device scale:

```js
const box = await page.locator(".hero-grid").boundingBox();
if (!box) throw new Error("hero grid is not visible");
await page.screenshot({path:".reference/clone-hero-region.png", clip:box});
```

Keep matching files together under `.reference/` and compare them with the image viewer or pixel-diff tooling available in the workspace. Do not use macOS-only `sips` commands.

## What to check (the graded axes)
- **Layout & spacing** — grid tracks, gaps, section padding.
- **Typography** — font-size, weight, line-height, letter-spacing.
- **Color** — pull exact hex from `.reference/css-0-inline` and compare against `frontend/src/globals.css` (`--rausch:#ff385c`, `--muted2:#717171` where present).
- **Radius & shadow** — `border-radius`, `box-shadow`.

## Common traps
- SVG sizing: an icon wrapper span with no box breaks `svg{width:100%}` chains; size the nearest real box.
- A CSS rule like `.x span {…}` can accidentally match a nested wrapper `<span class="x">` — watch double-nesting.
- Ignore development-only browser overlays.
- Check the listing top, full content flow, photo tour, lightbox, amenities modal, and calendar independently; an accurate listing page does not prove overlay fidelity.
- Report missing `/assets/...` requests separately from visual differences because missing repository assets can change layout as well as appearance.
