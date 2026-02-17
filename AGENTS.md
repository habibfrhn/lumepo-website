# AGENTS.md

## Project
Next.js (App Router) website + waitlist subscribe endpoint.

## Commands
- npm install
- npm run dev
- npm run lint
- npm test
- npm run build
- npm run start

## Conventions
- TypeScript everywhere
- Keep all pages static/SSG; only /api/subscribe is dynamic
- Never expose secrets to the client
- Prefer small, readable modules
- Put operational docs under /docs

## Testing
- Unit test email normalization/validation
- Unit test subscribe handler behavior (honeypot, content-type/method enforcement, generic success response)
- Mock external calls (Supabase + Brevo) in tests

## Security
- Do not store raw IP addresses; hash them if used
- Do not reveal whether an email exists in API responses
- Validate method, content-type, and payload size
