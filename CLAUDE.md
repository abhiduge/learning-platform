# InvestQuest — Claude Code Session Context

## What this project is
A gamified microlearning web app for teens (ages 12–16) that teaches financial literacy through daily 5–7 minute story-driven sessions. The teen plays as "Alex", a 15-year-old making real financial decisions.

## Read first
Always read `spec.md` for full product requirements before making any changes.

## Tech stack (quick ref)
- React 18 + Vite + Tailwind CSS v3
- Supabase (auth + Postgres database)
- Anthropic Claude API — server-side only, hints only
- Vercel (hosting + serverless functions)
- Zustand (state), React Router v6

## Critical security rules — never break these
1. `ANTHROPIC_API_KEY` is NEVER used in any file prefixed with `VITE_` and NEVER imported into any frontend component. It lives only in `/src/api/hint.js` (Vercel serverless function).
2. Supabase Row Level Security (RLS) must be enabled on ALL tables — see schema in spec.md.
3. Quiz correct answers are stored in `/src/content/` only — never passed into React component state or the DOM in a readable form.
4. Parents have READ-ONLY access to their linked teen's data. They cannot modify anything.
5. Teen registration must include age ≥ 13 confirmation before account creation.

## File layout (key paths)
```
src/content/module1/days/   ← all 10 days of lesson content
src/api/                    ← Vercel serverless functions (server-side only)
src/components/lesson/      ← lesson flow screens
src/components/dashboard/   ← teen home
src/components/parent/      ← parent view
supabase/schema.sql         ← full DB schema, apply this first
```

## Current build status
- [ ] Milestone 1: Core lesson shell (Day 1, no auth)
- [ ] Milestone 2: Accounts, all 10 days, streaks, badges
- [ ] Milestone 3: AI hints, parent dashboard, email

## My preferences
- Always show a plan (files to create/modify + approach) BEFORE writing any code
- Build one feature at a time — don't jump ahead
- Use Tailwind utility classes, not custom CSS files
- Keep components small and single-purpose
- All lesson content comes from `/src/content/` — never hardcode text in components
- Mobile-first: design for 375px width first

## Design system (quick ref)
- Primary: `#1a56db` (blue), Accent: `#f59e0b` (amber), Success: `#10b981`, Danger: `#ef4444`
- Fonts: Nunito (headings), Inter (body) — load from Google Fonts
- Story screens: dark indigo background `#1e1b4b`
- Rounded corners (16px), subtle shadows, animated transitions between lesson steps
- Correct answer: green flash + checkmark; Wrong answer: red shake

## Lesson flow (state machine)
IDLE → STORY → CONCEPT → SCENARIO → QUIZ(×3) → REWARD → COMPLETE

## XP system (quick ref)
- Complete lesson: +30 XP
- Perfect quiz: +20 XP bonus
- 7-day streak: +50 XP bonus
- Module complete: +100 XP bonus
- Level thresholds: 0 / 150 / 350 / 650 / 1000

## Useful commands
- `npm run dev` — start dev server
- `npm run build` — production build
- `/clear` — clear Claude Code context when it gets long
- `/model` — switch model if hitting limits
