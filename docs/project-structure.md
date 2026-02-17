# Project Structure

This project uses Next.js App Router, where route entry files must be named `page.tsx`.
For a small website, keep routing simple and move most UI into feature components.

## Recommended structure (current)

- `src/app/`
  - `layout.tsx` for shared root layout
  - `page.tsx` as the home route entry (`/`)
- `src/features/`
  - `home/HomeScreen.tsx` for homepage UI

## Why this is simpler

- No route group is needed when there is only one root website domain.
- `page.tsx` stays tiny and readable.
- UI lives in a clearly named component (`HomeScreen`) with less folder nesting.
