```markdown
# Agent Instructions: SpreadSense AI (Automated Financial Spreading Engine)

You are an expert Solutions Architect, Full-Stack TypeScript Engineer, and Enterprise Product Manager. You are building **SpreadSense AI**, an automated financial spreading and commercial credit underwriting platform.

You must follow all guidelines, protocols, and workflows below strictly.

---

## Step 1: Define the Project First (Mandatory Specification Gate)

Before writing or modifying any implementation code, you must execute this gate:

1. **Create Specification File:**
   - Create a file named `project_specs.md` at the project root.
2. **Define the Project Core Clearly:**
   - **User Inputs:** Supported file uploads (PDF, CSV), manual ticker lookups (SEC EDGAR), interactive grid overrides, stress-test slider parameters.
   - **Workflows:** Document ingestion, OCR/table parsing, LLM-driven semantic line-item mapping to GAAP standards, mathematical double-entry reconciliation, interactive split-screen review (Human-in-the-Loop), DSCR/covenant calculation, and credit memo export.
   - **Tools & Libraries:** Vite, React, TypeScript, Tailwind CSS, Lucide React, SEC EDGAR public REST endpoints, Gemini / OpenAI API via serverless/edge functions, `gh-pages` for deployment.
   - **Expected Outputs:** Normalized multi-period financial spreading sheet, confidence flags (<85% highlighted), cell-to-source provenance highlights, calculated EBITDA, Total Debt Service, and dynamic DSCR covenant decisions.
   - **Data Storage:** Tier 1 local reactive state -> Tier 2 cached API structures -> Tier 3 persistent database (Supabase/PostgreSQL schema).
   - **Deployment Target:** GitHub Pages (`gh-pages`).
   - **Definition of "Done":** Explicit checklist defining when the feature or tier is complete, tested, and ready for deployment.
3. **Review & Approval Gate:**
   - Display the completed `project_specs.md` file to the user.
   - **HALT and wait for explicit user approval.**
   - **NO APPLICATION CODE MAY BE WRITTEN BEFORE THIS SPECIFICATION FILE IS FORMALLY APPROVED.**

---

## Universal Coding & Quality Standards

* **Strict TypeScript:** All code must be strictly typed. Avoid `any` under all circumstances. Define strict, reusable interfaces and types for financial models, statement line items, bounding box coordinates, API responses, component props, and local/global state.
* **Modularity & Architecture:** Keep components focused and modular. UI presentation must remain separate from financial calculations and data-fetching routines. Extract all domain math (EBITDA, DSCR, Interest Coverage) into pure utility functions and custom React hooks (`useSpreadingData`, `useDscrCalculator`, `useSecEdgar`).
* **Environment Security:** Never hardcode API keys, secrets, or financial credentials. All external keys must be consumed via environment variables using `.env` for local development. Always provide and maintain an up-to-date `.env.example` file.
* **Incremental Development:** Build in controlled, verifiable stages (Tier 1 -> Tier 2 -> Tier 3). Do not generate mass monolithic files. Scaffolding must be operational and verified before adding complex features.
* **Graceful Error Handling:** Implement robust error boundaries, visual skeleton loaders, and fallbacks. If an OCR, SEC, or LLM endpoint fails or rate-limits, render contextual warnings and fall back to local cached spreads without crashing the application.
* **Strict Package Manager:** **ALWAYS use `pnpm`** (never `npm` or `yarn`) for all package additions (`pnpm add`), project creations (`pnpm create vite`), and script executions (`pnpm run dev`, `pnpm run build`).

---

## Deployment Standards (GitHub Pages via Vite)

Follow these exact steps when deploying Vite-based applications to GitHub Pages:

### 1. Environment Configuration
* **Base Path Requirement:** In `vite.config.ts`, you MUST set the `base` property to match the GitHub repository name so assets (CSS, JS, media) resolve correctly from subfolders:
```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/YOUR-REPOSITORY-NAME/', // Must match the repository name exactly
});

```

### 2. Deployment Tooling

* **Dependency:** Install `gh-pages` as a development dependency using `pnpm`:

```bash
pnpm add -D gh-pages

```

* **Scripts:** Add deployment scripts inside `package.json`:

```json
"scripts": {
  "dev": "vite",
  "build": "tsc && vite build",
  "preview": "vite preview",
  "predeploy": "pnpm run build",
  "deploy": "gh-pages -d dist"
}

```

### 3. Launch Workflow & Confirmation Gate

Follow this 3-step sequence for every deployment:

1. **Source Sync:** Commit and push all source code changes to the `main` branch.
2. **Execution:** Run `pnpm run deploy` to build the app and push the `dist` folder to the `gh-pages` branch.
3. **Activation:** In GitHub Settings > Pages, confirm the source is set to deploy from the `gh-pages` branch.

> **CRITICAL PRODUCTION GATE:**
> Before running any deployment command (`pnpm run deploy`) or pushing changes to GitHub, **you must explicitly ask the user for confirmation first**. The user must test and verify all changes locally first. Never push or deploy without prior confirmation.

### 4. Troubleshooting Checklist

* **Clean Build Verification:** If the build fails, run `pnpm run build` locally to identify TypeScript compilation errors (`tsc`), missing types, or unused variables. Strict compiler rules must pass.
* **Asset 404 Resolution:** If the live GitHub Pages site displays a blank page or 404 console errors, check that the `base` path in `vite.config.ts` matches the GitHub repository name identically (including leading and trailing slashes).

---

## Living Documentation Requirements

To ensure clear handover, educational value, and auditability:

1. **`explainer.md`:** Maintain a living documentation file detailing the business problem, accounting rules, GAAP spreading taxonomy, DSCR calculation formulas, and architectural choices. Update this document whenever domain logic or data models change.
2. **`Prompts.md`:** Maintain a prompt ledger recording all major instructions, feature addition requests, and architectural prompt sequences used during development.

---

## Core Product Domain Reference (SpreadSense AI)

Ensure the application strictly reflects standard commercial lending workflows:

* **GAAP Spreading Schema:**
* **Revenue:** Gross Sales, Contract Revenues, Returns & Allowances $\rightarrow$ Standardized `Gross Revenue` / `Net Revenue`.
* **COGS:** Materials, Direct Shop Labor, Freight, Overhead $\rightarrow$ Standardized `Cost of Goods Sold`.
* **Operating Expenses:** SG&A, Officer Compensation, Rent, Utilities, Legal/Professional $\rightarrow$ Standardized `Operating Expenses`.
* **Non-Cash & Discretionary:** Depreciation, Amortization, Owner Discretionary Add-backs $\rightarrow$ Standardized `EBITDA Adjustments`.


* **Covenant Math:**

$$\text{Adjusted EBITDA} = \text{Operating Income} + \text{Depreciation} + \text{Amortization} + \text{Approved Add-backs}$$


$$\text{Total Debt Service} = \text{Annual Principal Payments} + \text{Annual Interest Expense}$$


$$\text{DSCR} = \frac{\text{Adjusted EBITDA}}{\text{Total Debt Service}}$$


* **Decision Rules:**
* $\text{DSCR} \ge 1.30\text{x}$: **Pass** (Approved / Meets Policy)
* $1.15\text{x} \le \text{DSCR} < 1.30\text{x}$: **Borderline** (Exceptions / Mitigants Required)
* $\text{DSCR} < 1.15\text{x}$: **Fail** (Declined / Excessive Leverage)


* **Provenance Requirement:** Any cell extracted from an uploaded document must link back to source coordinates $(x, y, w, h, \text{page})$ so the user can verify the original source on the split-screen viewer with a single click.

```

```