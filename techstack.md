# Sana — Tech Stack & Architecture

## Overview

Sana is being migrated from a single-file prototype into a fully organized, production-grade web application. This document defines the canonical tech stack, tooling, and infrastructure decisions.

---

## Frontend

| Layer | Tool | Notes |
|-------|------|-------|
| Language | TypeScript | Strict mode. All UI code in `.tsx` / `.ts` |
| Markup | HTML5 | Semantic, accessible |
| Styling | CSS Modules + CSS custom properties | No global namespace collisions |
| Framework | React 18 | Component-based, hooks-driven |
| Build tool | Vite | Fast HMR, ESM-native |
| UI design | Claude frontend design skill | AI-assisted component and layout generation |
| Screenshots / visual QA | Chromium via Playwright | Automated visual regression and screenshotting |

### Local dev

```bash
npm run dev        # starts Vite dev server at http://localhost:5173
```

---

## Backend

| Layer | Tool | Notes |
|-------|------|-------|
| Runtime | Node.js (LTS) | Server-side JS/TS |
| Framework | Express | REST API, middleware, route handlers |
| Language | TypeScript | Shared types with frontend via `/shared` package |

### API structure (planned)

```
/api
  /auth        — Twilio Verify endpoints (OTP send / verify)
  /user        — Profile CRUD
  /checkin     — Daily check-in submit / retrieve
  /plan        — Plan generation (wraps buildDailyPlans logic)
  /billing     — Stripe webhooks + subscription status
```

---

## Database & Backend Services

| Service | Purpose |
|---------|---------|
| **Supabase** | PostgreSQL database, Row Level Security, Supabase Auth (complementary to Twilio), real-time subscriptions, file storage |
| Supabase tables (planned) | `users`, `profiles`, `checkins`, `plans`, `subscriptions` |

---

## Authentication

| Tool | Role |
|------|------|
| **Twilio Verify** | SMS / WhatsApp one-time passcode (OTP) — passwordless login |
| Supabase Auth | Session management, JWT tokens, RLS enforcement |

Flow: user enters phone → Twilio sends OTP → verified on server → Supabase session created → JWT stored client-side.

---

## Payments

| Tool | Role |
|------|------|
| **Stripe** | Subscription billing, pricing tiers, invoices |
| Integration point | `/api/billing` on Express + Stripe webhooks |
| Planned tiers | Free (check-in only) · Pro (full plan + AI Guide) · Premium (wearable sync + advanced analytics) |

---

## Screenshotting & Visual QA

| Tool | Role |
|------|------|
| **Playwright + Chromium** | Automated screenshots for UI review, regression testing, and design handoff |
| Usage | `npm run screenshot` — captures key screens (onboarding, dashboard, plan, chat) |

---

## Deployment

| Layer | Tool |
|-------|------|
| Hosting | **Vercel** — frontend + serverless API routes |
| CI/CD | Vercel GitHub integration — auto-deploy on push to `main` |
| CDN | Vercel Edge Network (global) |

---

## Domain & DNS

| Tool | Role |
|------|------|
| **Cloudflare** | DNS management, DDoS protection, SSL/TLS, caching rules |
| Target domain | `sana.com` (or `sana.health` / `trysana.com` as fallback) |
| DNS records | A/CNAME pointing to Vercel — managed in Cloudflare dashboard |

---

## Project Structure (planned)

```
sana/
├── apps/
│   ├── web/                  # React + Vite frontend
│   │   ├── src/
│   │   │   ├── components/   # Reusable UI components
│   │   │   ├── screens/      # Full-page screen components
│   │   │   ├── hooks/        # Custom React hooks
│   │   │   ├── lib/          # Supabase client, Stripe helpers
│   │   │   ├── styles/       # CSS modules + global tokens
│   │   │   └── types/        # Shared TS types
│   │   └── index.html
│   └── api/                  # Express backend
│       ├── routes/
│       │   ├── auth.ts
│       │   ├── user.ts
│       │   ├── checkin.ts
│       │   ├── plan.ts
│       │   └── billing.ts
│       ├── middleware/
│       └── index.ts
├── packages/
│   └── shared/               # Types and logic shared by web + api
│       ├── buildDailyPlans.ts
│       └── types.ts
├── playwright/               # Screenshot + E2E tests
│   └── screenshots/
├── .env.example
├── package.json              # Monorepo root (npm workspaces)
└── techstack.md              # This file
```

---

## Environment Variables

```env
# Supabase
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Twilio
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_VERIFY_SERVICE_SID=

# Stripe
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_PUBLISHABLE_KEY=

# App
VITE_API_URL=http://localhost:3001
NODE_ENV=development
```

---

## Development Commands

```bash
npm install          # install all workspace dependencies
npm run dev          # start web (port 5173) + api (port 3001) concurrently
npm run build        # production build
npm run screenshot   # Playwright screenshot suite
npm run typecheck    # tsc --noEmit across all packages
npm run lint         # ESLint
```

---

## Migration Path (current → production)

| Phase | Work |
|-------|------|
| 1 — Scaffold | Set up monorepo, Vite, Express, TypeScript, env files |
| 2 — Extract | Move `buildDailyPlans`, component logic, design tokens out of `index.html` into typed modules |
| 3 — Auth | Wire Twilio OTP + Supabase sessions |
| 4 — Persistence | Supabase tables for profiles, check-ins, plans |
| 5 — Payments | Stripe subscriptions + gating |
| 6 — Deploy | Vercel + Cloudflare DNS |
| 7 — QA | Playwright visual regression suite |
