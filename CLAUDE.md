# CLAUDE.md — AI Lease Risk Scanner (LegalGuard)

## Project Overview

**LegalGuard** is a micro SaaS that lets tenants upload a lease and instantly receive the top 5 risky clauses explained in plain English. One input, one output — dead simple.

- **Input:** PDF/DOCX lease upload
- **Output:** Top 5 risky clauses with plain-English explanations + overall safety score
- **Stack:** Bun runtime, Anthropic Agent SDK (Claude), React frontend, Railway deployment

## Business Model

| Tier | Price | Description |
|------|-------|-------------|
| Single Scan | $19 | One-time lease analysis |
| Unlimited Monthly | $9/month | Unlimited scans for active tenants/apartment hunters |
| Affiliate | Commission | Tenant insurance partner referrals from risk report |

**Revenue target:** 50k users/year at ~$20 avg = $1M ARR

## Architecture

```
┌─────────────────────────────────────────────────┐
│                  Frontend (React)                │
│  Landing Page  │  Upload Zone  │  Risk Dashboard │
└────────────────────┬────────────────────────────┘
                     │ REST API
┌────────────────────▼────────────────────────────┐
│               Backend (Bun + Hono)              │
│  /api/upload  │  /api/scan  │  /api/report/:id  │
└────────────────────┬────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────┐
│          Anthropic Agent SDK (Claude)           │
│  Lease Parser Agent  →  Risk Analyzer Agent     │
│  → Plain English Writer Agent                   │
└────────────────────┬────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────┐
│              Storage & Services                 │
│  SQLite (Drizzle ORM)  │  Stripe  │  R2/S3     │
└─────────────────────────────────────────────────┘
```

## Key Pages

### 1. Landing Page
- Hero with clear value prop: "Upload your lease. Get 5 risky clauses in plain English."
- Prominent drag-and-drop upload zone
- Social proof / scan counter
- Pricing tiers (single scan / unlimited)
- Legal disclaimer footer (NOT legal advice — informational tool)
- Trust badges and security indicators

### 2. Risk Report Dashboard
- **Overall Safety Score** (0–100 with color-coded gauge)
- **Top 5 Risky Clauses** in split-view:
  - Left: original legal jargon (highlighted in document)
  - Right: plain-English explanation of the risk
- Risk severity badges (High / Medium / Low)
- "What you can do" actionable suggestions per clause
- Download PDF report button
- Tenant insurance affiliate CTA

## Legal Compliance (CRITICAL)

Every user-facing page and report MUST include:

```
DISCLAIMER: LegalGuard is an AI-powered informational tool. It does NOT
provide legal advice. Results are for educational purposes only. Always
consult a licensed attorney for legal decisions regarding your lease.
```

- Never use the words "legal advice" in marketing copy
- Frame all output as "risk highlights" and "educational summaries"
- Include disclaimer in: landing page footer, report header, report PDF, email notifications
- Terms of Service must explicitly disclaim liability

## Coding Standards

- **Runtime:** Bun (not Node)
- **Package manager:** `bun install` (not npm/yarn)
- **Backend framework:** Hono (lightweight, fast on Bun)
- **Frontend:** React 19 + Vite + TailwindCSS v4
- **Database:** SQLite via Drizzle ORM (simple, no external DB needed)
- **AI:** Anthropic Agent SDK with Claude claude-sonnet-4-5-20250929
- **Payments:** Stripe Checkout + Webhooks
- **File storage:** Cloudflare R2 (S3-compatible) for lease uploads
- **Deployment:** Railway (monorepo with separate services)

## Commands

```bash
# Install dependencies
bun install

# Dev server (frontend + backend)
bun run dev

# Run backend only
bun run server

# Run frontend only
bun run client

# Run tests
bun test

# Database migrations
bun run db:generate
bun run db:migrate

# Type check
bun run typecheck

# Lint
bun run lint

# Build for production
bun run build

# Deploy to Railway
railway up
```

## Project Structure

```
legal-guard/
├── CLAUDE.md
├── agents.md
├── package.json
├── bunfig.toml
├── drizzle.config.ts
├── packages/
│   ├── web/                    # React frontend
│   │   ├── src/
│   │   │   ├── pages/
│   │   │   │   ├── Landing.tsx        # Upload + pricing + CTA
│   │   │   │   ├── Report.tsx         # Risk report dashboard
│   │   │   │   └── Pricing.tsx        # Detailed pricing page
│   │   │   ├── components/
│   │   │   │   ├── UploadZone.tsx     # Drag-and-drop lease upload
│   │   │   │   ├── RiskCard.tsx       # Single risky clause card
│   │   │   │   ├── SafetyScore.tsx    # Overall score gauge
│   │   │   │   ├── SplitView.tsx      # Jargon vs plain English
│   │   │   │   ├── Disclaimer.tsx     # Legal disclaimer banner
│   │   │   │   └── PricingTier.tsx    # Pricing card component
│   │   │   ├── hooks/
│   │   │   ├── lib/
│   │   │   └── main.tsx
│   │   ├── index.html
│   │   └── vite.config.ts
│   │
│   ├── api/                    # Bun + Hono backend
│   │   ├── src/
│   │   │   ├── routes/
│   │   │   │   ├── upload.ts          # File upload endpoint
│   │   │   │   ├── scan.ts            # Trigger AI scan
│   │   │   │   ├── report.ts          # Fetch report by ID
│   │   │   │   └── webhook.ts         # Stripe webhooks
│   │   │   ├── agents/
│   │   │   │   ├── lease-parser.ts    # Extract text + structure
│   │   │   │   ├── risk-analyzer.ts   # Identify risky clauses
│   │   │   │   └── plain-writer.ts    # Rewrite in plain English
│   │   │   ├── db/
│   │   │   │   ├── schema.ts          # Drizzle schema
│   │   │   │   └── index.ts           # DB connection
│   │   │   ├── services/
│   │   │   │   ├── stripe.ts          # Payment logic
│   │   │   │   └── storage.ts         # R2 file ops
│   │   │   └── index.ts               # Hono app entrypoint
│   │   └── tsconfig.json
│   │
│   └── shared/                 # Shared types & utils
│       ├── types.ts
│       └── constants.ts
│
├── drizzle/                    # Migration files
└── railway.toml                # Railway config
```

## Environment Variables

```env
# AI
ANTHROPIC_API_KEY=

# Payments
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_PRICE_SINGLE=         # Price ID for $19 single scan
STRIPE_PRICE_MONTHLY=        # Price ID for $9/month

# Storage
R2_ACCOUNT_ID=
R2_ACCESS_KEY=
R2_SECRET_KEY=
R2_BUCKET_NAME=

# App
DATABASE_URL=./data/legalguard.db
APP_URL=https://legalguard.app
PORT=3000
```

## AI Agent Pipeline

The scan pipeline runs three agents in sequence:

1. **Lease Parser Agent** — Extracts full text from PDF/DOCX, identifies sections and clauses
2. **Risk Analyzer Agent** — Scores each clause for tenant risk, selects top 5 most dangerous
3. **Plain English Writer Agent** — Rewrites each risky clause in simple, non-legal language with actionable context

Each agent uses structured output (JSON) to pass data to the next stage. The full pipeline should complete in under 30 seconds.

## Design Principles

- **Conversion-first landing page:** The upload zone IS the CTA — no friction
- **Trust signals everywhere:** Security badges, scan counter, disclaimer visibility
- **Mobile-responsive:** Many users will scan leases from their phone
- **Fast feedback:** Show a progress indicator during the ~20s scan
- **Shareable reports:** Each report gets a unique URL for sharing with roommates/family
