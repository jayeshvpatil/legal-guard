# agents.md — Development Standards & Agent Configuration

## Runtime & Toolchain

| Tool | Choice | Why |
|------|--------|-----|
| **Runtime** | Bun | Fast startup, native TS, built-in test runner |
| **Package Manager** | Bun | `bun install`, `bun add`, `bun remove` — never npm/yarn |
| **AI SDK** | Anthropic Agent SDK (`@anthropic-ai/sdk`) | Native tool use, structured output, agent orchestration |
| **Backend** | Hono | Lightweight, edge-ready, perfect on Bun |
| **Frontend** | React 19 + Vite | Fast HMR, modern React features |
| **Styling** | TailwindCSS v4 | Utility-first, fast iteration |
| **Database** | SQLite + Drizzle ORM | Zero-config, embedded, Railway-compatible |
| **Payments** | Stripe | Industry standard, good DX |
| **Deployment** | Railway | Simple, git-push deploys, monorepo support |

> **Rule:** All contributors and agents MUST use Bun for every operation. No `npm`, `npx`, `yarn`, or `pnpm` commands anywhere.

---

## Anthropic Agent SDK — Agent Definitions

### Installation

```bash
bun add @anthropic-ai/sdk
```

### Agent Architecture

Three agents run in a sequential pipeline. Each agent receives structured input and returns structured JSON output.

```
Upload → [Lease Parser] → [Risk Analyzer] → [Plain English Writer] → Report
```

### Agent 1: Lease Parser

**Purpose:** Extract structured text from the uploaded lease document.

```typescript
// packages/api/src/agents/lease-parser.ts
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

interface ParsedLease {
  title: string;
  parties: { landlord: string; tenant: string };
  sections: {
    id: string;
    heading: string;
    content: string;
    clauseCount: number;
  }[];
  fullText: string;
  documentType: "residential" | "commercial" | "unknown";
}

export async function parseLeaseDocument(
  rawText: string
): Promise<ParsedLease> {
  const response = await client.messages.create({
    model: "claude-sonnet-4-5-20250929",
    max_tokens: 4096,
    messages: [
      {
        role: "user",
        content: `You are a lease document parser. Extract the structured information from this lease document.

Return ONLY valid JSON matching this schema:
{
  "title": "string",
  "parties": { "landlord": "string", "tenant": "string" },
  "sections": [{ "id": "string", "heading": "string", "content": "string", "clauseCount": number }],
  "fullText": "string",
  "documentType": "residential" | "commercial" | "unknown"
}

LEASE DOCUMENT:
${rawText}`,
      },
    ],
  });

  const text =
    response.content[0].type === "text" ? response.content[0].text : "";
  return JSON.parse(text) as ParsedLease;
}
```

### Agent 2: Risk Analyzer

**Purpose:** Identify the top 5 riskiest clauses for the tenant.

```typescript
// packages/api/src/agents/risk-analyzer.ts
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

interface RiskyClause {
  sectionId: string;
  heading: string;
  originalText: string;
  riskLevel: "high" | "medium" | "low";
  riskCategory: string;
  riskScore: number; // 0-100
}

interface RiskAnalysis {
  overallScore: number; // 0-100 (100 = safest)
  topRisks: RiskyClause[];
  summary: string;
}

export async function analyzeLeaseRisks(
  parsedLease: ParsedLease
): Promise<RiskAnalysis> {
  const response = await client.messages.create({
    model: "claude-sonnet-4-5-20250929",
    max_tokens: 4096,
    system: `You are a tenant-rights risk analyzer. You identify clauses in residential leases that are potentially harmful, unusual, or one-sided against the tenant.

Common risk categories:
- Excessive fees or penalties
- Unreasonable entry/inspection rights
- Liability waivers favoring landlord
- Restrictive subletting or guest policies
- Automatic renewal traps
- Security deposit abuse
- Maintenance responsibility shifting
- Noise/behavior clauses that are overly broad
- Early termination penalties
- Waiver of tenant legal rights

IMPORTANT: You are an informational tool. You do NOT provide legal advice.`,
    messages: [
      {
        role: "user",
        content: `Analyze this parsed lease and return the top 5 riskiest clauses for the tenant.

Return ONLY valid JSON matching this schema:
{
  "overallScore": number (0-100, where 100 is safest),
  "topRisks": [
    {
      "sectionId": "string",
      "heading": "string",
      "originalText": "string (exact quote from lease)",
      "riskLevel": "high" | "medium" | "low",
      "riskCategory": "string",
      "riskScore": number (0-100, where 100 is most risky)
    }
  ],
  "summary": "string (2-3 sentence overall assessment)"
}

PARSED LEASE:
${JSON.stringify(parsedLease, null, 2)}`,
      },
    ],
  });

  const text =
    response.content[0].type === "text" ? response.content[0].text : "";
  return JSON.parse(text) as RiskAnalysis;
}
```

### Agent 3: Plain English Writer

**Purpose:** Translate legal jargon into clear, simple language anyone can understand.

```typescript
// packages/api/src/agents/plain-writer.ts
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

interface PlainEnglishClause {
  sectionId: string;
  heading: string;
  originalText: string;
  plainEnglish: string;
  whyItMatters: string;
  whatYouCanDo: string;
  riskLevel: "high" | "medium" | "low";
  riskCategory: string;
  riskScore: number;
}

interface FinalReport {
  overallScore: number;
  overallVerdict: string;
  clauses: PlainEnglishClause[];
  disclaimer: string;
}

export async function writePlainEnglish(
  riskAnalysis: RiskAnalysis
): Promise<FinalReport> {
  const response = await client.messages.create({
    model: "claude-sonnet-4-5-20250929",
    max_tokens: 4096,
    system: `You are a plain-language writer who translates legal jargon into simple English that anyone can understand. Write at a 6th-grade reading level. Be direct and specific.

CRITICAL: Always include this disclaimer:
"This is an AI-generated informational summary, not legal advice. Consult a licensed attorney for legal decisions."`,
    messages: [
      {
        role: "user",
        content: `Rewrite each risky clause in plain English. For each clause provide:
1. A plain English explanation (2-3 sentences, simple words)
2. Why it matters to the tenant (1-2 sentences)
3. What the tenant can do about it (1-2 actionable sentences)

Return ONLY valid JSON matching this schema:
{
  "overallScore": number,
  "overallVerdict": "string (one sentence plain English verdict)",
  "clauses": [
    {
      "sectionId": "string",
      "heading": "string",
      "originalText": "string",
      "plainEnglish": "string",
      "whyItMatters": "string",
      "whatYouCanDo": "string",
      "riskLevel": "high" | "medium" | "low",
      "riskCategory": "string",
      "riskScore": number
    }
  ],
  "disclaimer": "string"
}

RISK ANALYSIS:
${JSON.stringify(riskAnalysis, null, 2)}`,
      },
    ],
  });

  const text =
    response.content[0].type === "text" ? response.content[0].text : "";
  return JSON.parse(text) as FinalReport;
}
```

### Full Pipeline Orchestrator

```typescript
// packages/api/src/agents/pipeline.ts
import { parseLeaseDocument } from "./lease-parser";
import { analyzeLeaseRisks } from "./risk-analyzer";
import { writePlainEnglish } from "./plain-writer";

export async function runLeaseAnalysis(rawText: string) {
  const parsed = await parseLeaseDocument(rawText);
  const risks = await analyzeLeaseRisks(parsed);
  const report = await writePlainEnglish(risks);
  return report;
}
```

---

## Frontend Design Standards

### Design System

Use TailwindCSS v4 with a consistent design language:

```
Colors:
  - Primary:    emerald-600 (#059669)   — trust, safety
  - Danger:     red-500 (#ef4444)       — high risk clauses
  - Warning:    amber-500 (#f59e0b)     — medium risk
  - Safe:       emerald-500 (#10b981)   — low risk / good clauses
  - Background: slate-50 (#f8fafc)      — clean, professional
  - Text:       slate-900 (#0f172a)     — high contrast

Typography:
  - Headings:   Inter (font-sans), bold
  - Body:       Inter (font-sans), regular
  - Code/Legal: JetBrains Mono (font-mono) for original lease text

Spacing:
  - Use Tailwind's default scale (4px base)
  - Section padding: p-8 (desktop), p-4 (mobile)
  - Card padding: p-6
  - Component gap: gap-4 or gap-6
```

### Component Patterns

**All components must:**
- Be fully responsive (mobile-first)
- Use semantic HTML elements
- Include proper aria labels for accessibility
- Follow the color system above for risk indicators

**Landing Page Layout:**
```
┌──────────────────────────────────────────────┐
│  Nav: Logo          [Pricing] [Login]        │
├──────────────────────────────────────────────┤
│                                              │
│  Upload your lease.                          │
│  Get 5 risky clauses in plain English.       │
│                                              │
│  ┌────────────────────────────────────────┐  │
│  │                                        │  │
│  │     📄 Drop your lease here            │  │
│  │        or click to browse              │  │
│  │                                        │  │
│  │        PDF, DOCX up to 10MB            │  │
│  └────────────────────────────────────────┘  │
│                                              │
│  [Scan for $19]        [Go Unlimited $9/mo]  │
│                                              │
├──────────────────────────────────────────────┤
│  How it works: Upload → AI Scans → Results   │
├──────────────────────────────────────────────┤
│  Pricing Cards (Single / Unlimited)          │
├──────────────────────────────────────────────┤
│  Trust: "10,000+ leases scanned"             │
├──────────────────────────────────────────────┤
│  Footer + Legal Disclaimer                   │
└──────────────────────────────────────────────┘
```

**Risk Report Dashboard Layout:**
```
┌──────────────────────────────────────────────┐
│  Nav: Logo    Report #12345    [Download PDF] │
├──────────────────────────────────────────────┤
│                                              │
│  Overall Safety Score: 62/100  [==▓▓▓░░░░]   │
│  "This lease has some concerning clauses..."  │
│                                              │
├──────────────────────────────────────────────┤
│  CLAUSE 1 — Early Termination  [HIGH RISK]   │
│  ┌──────────────────┬───────────────────────┐│
│  │ Original Jargon  │ Plain English         ││
│  │                  │                       ││
│  │ "Tenant shall be │ "If you leave early,  ││
│  │ liable for the   │ you'll owe ALL the    ││
│  │ remaining balance │ remaining rent — even ││
│  │ of the lease..." │ if it's 11 months."   ││
│  └──────────────────┴───────────────────────┘│
│  Why it matters: ...                         │
│  What you can do: ...                        │
│                                              │
│  CLAUSE 2 — ...                              │
│  CLAUSE 3 — ...                              │
│  CLAUSE 4 — ...                              │
│  CLAUSE 5 — ...                              │
│                                              │
├──────────────────────────────────────────────┤
│  🛡️ Protect yourself — Get tenant insurance  │
├──────────────────────────────────────────────┤
│  DISCLAIMER: This is not legal advice...     │
└──────────────────────────────────────────────┘
```

---

## API Routes

All routes are defined in Hono on the backend:

```typescript
// packages/api/src/index.ts
import { Hono } from "hono";
import { cors } from "hono/cors";

const app = new Hono();

app.use("/*", cors());

// Health check
app.get("/api/health", (c) => c.json({ status: "ok" }));

// Upload lease file (returns upload ID)
app.post("/api/upload", uploadHandler);

// Start scan (triggers agent pipeline, returns scan ID)
app.post("/api/scan", scanHandler);

// Get scan status (polling)
app.get("/api/scan/:id/status", scanStatusHandler);

// Get final report
app.get("/api/report/:id", reportHandler);

// Stripe checkout session
app.post("/api/checkout", checkoutHandler);

// Stripe webhook
app.post("/api/webhook/stripe", stripeWebhookHandler);

export default {
  port: process.env.PORT || 3000,
  fetch: app.fetch,
};
```

---

## Database Schema (Drizzle)

```typescript
// packages/api/src/db/schema.ts
import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";

export const scans = sqliteTable("scans", {
  id: text("id").primaryKey(),
  uploadPath: text("upload_path").notNull(),
  status: text("status", {
    enum: ["pending", "parsing", "analyzing", "writing", "complete", "failed"],
  }).notNull().default("pending"),
  overallScore: real("overall_score"),
  reportJson: text("report_json"),
  stripePaymentId: text("stripe_payment_id"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  completedAt: integer("completed_at", { mode: "timestamp" }),
});

export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  stripeCustomerId: text("stripe_customer_id"),
  plan: text("plan", { enum: ["free", "single", "unlimited"] })
    .notNull()
    .default("free"),
  scansRemaining: integer("scans_remaining").notNull().default(0),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
});
```

---

## Deployment — Railway

### Railway Configuration

```toml
# railway.toml
[build]
builder = "nixpacks"

[deploy]
startCommand = "bun run start"
healthcheckPath = "/api/health"
healthcheckTimeout = 30
restartPolicyType = "on_failure"
restartPolicyMaxRetries = 3

[[services]]
name = "api"
root = "packages/api"

[[services]]
name = "web"
root = "packages/web"
```

### Railway Environment Setup

1. Create a new Railway project
2. Connect the GitHub repo
3. Add two services: `api` and `web`
4. Set environment variables in Railway dashboard (see CLAUDE.md for full list)
5. Enable automatic deploys on push to `main`

### Deploy Commands

```bash
# Install Railway CLI
bun add -g @railway/cli

# Login
railway login

# Link project
railway link

# Deploy
railway up

# View logs
railway logs
```

### Production Checklist

- [ ] All env vars set in Railway dashboard
- [ ] Stripe webhook endpoint configured to Railway URL
- [ ] R2 bucket created and credentials set
- [ ] Custom domain configured (legalguard.app)
- [ ] SSL certificate auto-provisioned by Railway
- [ ] Health check endpoint responding
- [ ] Rate limiting enabled on `/api/scan` (10 req/min per IP)

---

## Development Workflow

### Local Setup

```bash
# Clone and install
git clone <repo-url> && cd legal-guard
bun install

# Copy env file
cp .env.example .env
# Fill in your API keys

# Run database migrations
bun run db:generate && bun run db:migrate

# Start dev server
bun run dev
```

### Git Conventions

- **Branch naming:** `feat/`, `fix/`, `chore/` prefixes
- **Commit messages:** Conventional commits (`feat:`, `fix:`, `docs:`, `chore:`)
- **PR required:** All changes go through PR to `main`
- **Deploy trigger:** Push to `main` auto-deploys to Railway

### Testing Standards

```bash
# Run all tests
bun test

# Run specific test file
bun test packages/api/src/agents/risk-analyzer.test.ts

# Watch mode
bun test --watch
```

- Every agent function must have tests with sample lease text
- API routes need integration tests
- Frontend components need basic render tests
- Aim for >80% coverage on agent logic

---

## Agent Rules for Claude Code

When working on this project, all AI coding agents MUST:

1. **Use Bun** for all commands — never npm, npx, yarn, or pnpm
2. **Follow the project structure** defined in CLAUDE.md — don't create files outside the defined structure
3. **Include the legal disclaimer** in any new user-facing component or page
4. **Never use the phrase "legal advice"** in any code, copy, or comments — always say "informational tool" or "educational summary"
5. **Use the Anthropic SDK** (`@anthropic-ai/sdk`) for all AI operations — no other AI providers
6. **Target Claude claude-sonnet-4-5-20250929** as the model for all agents (cost-effective for this use case)
7. **Return structured JSON** from all agent functions — no free-form text responses
8. **Keep the agent pipeline under 30s** total execution time
9. **Deploy only through Railway** — no other hosting providers
10. **Use Drizzle ORM** for all database operations — no raw SQL
