# Project Instructions

## Deployment workflow
- After completing any edits: run typecheck + lint, then commit and push to deploy.
- Vercel auto-deploys from the `main` branch.
- Deploy remote is `samaweb` (`https://github.com/gmsnow/samaweb.git`), NOT `origin`.
- Push with: `git push samaweb main`

## Critical commands
- Dev: `npm run dev` (already wraps `next dev --webpack`)
- Build: `npm run build` (already wraps `next build --webpack`)
- Typecheck: `npx tsc --noEmit`
- Lint: `npm run lint`

## Notes
- Next 16 requires the `--webpack` flag for build/dev — never run plain `next build`.
- `.env.local` is gitignored; env vars live in Vercel dashboard (Production + Preview + Development).
