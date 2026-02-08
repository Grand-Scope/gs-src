# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start dev server (localhost:3000)
npm run build        # Production build
npm run lint         # ESLint (flat config, no path argument needed)
npx prisma generate  # Regenerate Prisma client after schema changes
npx prisma db push   # Push schema changes to database
npx prisma studio    # Open database GUI
```

No test framework is configured yet.

## Architecture

**Stack:** Next.js 16 (App Router) / React 19 / TypeScript (strict) / Prisma / Neon PostgreSQL / NextAuth.js v5 beta

**Path alias:** `@/*` maps to `./src/*`

### App Router Layout

- `src/app/(dashboard)/` — Protected dashboard routes, wrapped by a layout that checks `auth()` and redirects to `/login` if unauthenticated
- `src/app/api/` — REST API routes for `auth`, `projects`, `tasks`
- `src/app/login/`, `src/app/register/` — Public auth pages
- `src/app/page.tsx` — Root redirect (to `/dashboard` or `/login`)

### Auth

NextAuth.js v5 with Credentials provider only. JWT session strategy (no DB sessions). Passwords hashed with bcryptjs. Custom session type augmented in `src/types/next-auth.d.ts` to include `user.id` and `user.role` (Role enum: ADMIN, MANAGER, MEMBER).

- `src/lib/auth.ts` — NextAuth config, exports `{ handlers, auth, signIn, signOut }`
- `src/lib/prisma.ts` — Singleton Prisma client (global pattern for dev hot reload)
- API routes check session and verify ownership/membership before mutations

### Database (Prisma)

Schema at `prisma/schema.prisma`. Key models: User, Project, Task, Milestone, plus NextAuth Account/Session models.

- Projects have an owner (User) and many-to-many members (User[])
- Tasks belong to a Project and have assignee + creator relations
- Tasks cascade delete with their parent Project
- Enums: `Role`, `ProjectStatus` (PLANNING/IN_PROGRESS/ON_HOLD/COMPLETED/CANCELLED), `TaskStatus` (TODO/IN_PROGRESS/IN_REVIEW/COMPLETED), `Priority` (LOW/MEDIUM/HIGH/URGENT)

### Styling

Plain CSS with custom properties — no Tailwind, no CSS modules, no CSS-in-JS library. Global design system in `src/app/globals.css` defines color palettes, typography (League Spartan headings, Montserrat body), and utility classes (`.btn-*`, `.badge-*`, `.card`, `.form-*`).

Dark/light theme via `data-theme` attribute on `<html>`, managed by `src/contexts/ThemeContext.tsx` with localStorage persistence and system preference detection. Per-page CSS files live alongside their route files.

### Component Patterns

- Server components are the default; only components needing interactivity use `"use client"`
- Server components fetch data directly via Prisma; client components use fetch to API routes
- No external state management — just React context (theme), NextAuth session, and local useState
- `src/components/layout/` — Sidebar, Header, DashboardLayoutClient (shell with slide-out panels)
- `src/components/projects/` — Project detail view components (header, overview, tasks, team tabs)
- `src/lib/actions/` — Server actions for projects

### Environment Variables

Required in `.env`: `DATABASE_URL` (Neon PostgreSQL), `AUTH_SECRET`, `NEXTAUTH_URL`
