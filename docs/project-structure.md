# Project Structure

This project uses Next.js App Router, where route entry files must remain named `page.tsx`.
To keep names understandable, page files should stay thin and delegate to clearly named screen components.

## Recommended structure

- `src/app/`
  - `layout.tsx` for shared root layout
  - route groups (for example, `(website)`) to organize route domains without changing URL paths
  - `page.tsx` files as route entry points only
- `src/features/`
  - domain-based folders (for example, `website-home`)
  - `screens/` for top-level page UI components with descriptive names (for example, `HomeScreen.tsx`)

## Current homepage mapping

- Route entry: `src/app/(website)/page.tsx`
- Screen UI: `src/features/website-home/screens/HomeScreen.tsx`

This keeps framework-required filenames while improving readability and long-term scalability.
