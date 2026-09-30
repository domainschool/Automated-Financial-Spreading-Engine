# Vibe Coding Implementation Prompts: SpreadSense AI

Use the following prompts sequentially in your AI agent builder (Cursor, Lovable, Claude Code, Replit, or Antigravity). Each prompt is designed to take the previous working state and advance the software through three distinct maturity tiers without breaking existing functionality.

---

## Tier 1: MVP 1 (Zero-Config Scaffolding & Local Interactive State)

> **Objective:** Stand up the application structure, visual layout, local mock data models, and reactive calculation state with zero external dependencies, no API keys, and immediate UI feedback.

### Prompt 1.1: Core Domain Layout & Split-Screen Viewport Scaffolding

```text
Role: Principal Frontend Engineer & Banking UX Specialist
Stack: Next.js (App Router), Tailwind CSS, Lucide React, TypeScript

Context:
We are building SpreadSense AI, an automated financial spreading engine for commercial loan underwriters. Underwriters review financial statements (Income Statement, Balance Sheet) and map borrower line items into standardized GAAP buckets to compute Debt Service Coverage Ratio (DSCR).

Task:
Create a single-page split-screen interface with zero external API dependencies:
1. Header: Display the app title "SpreadSense AI", an active deal tag ("Deal #4092 - Apex Precision Machining LLC | Facility: $4.5M Term Loan"), and a primary action button "Export Credit Spread".
2. Left Pane (Source Document Viewport - 45% width):
   - A document preview card representing an extracted financial statement.
   - Include a toolbar at the top: document switcher dropdown (options: "2025 Audit - Form 10-K", "2024 Audit - Form 10-K", "Interim TTM Income Statement"), zoom controls (+/- buttons), and an extraction status badge ("OCR Parsed - 94% Confidence").
   - A mock document container rendered as a stylized document page with numbered rows and highlighted visual bounding boxes around specific numbers (simulate scanned financial text).
3. Right Pane (GAAP Spreading Grid - 55% width):
   - A clean, dense financial data table showing three comparative periods: "FY 2023", "FY 2024", and "FY 2025 (Projected)".
   - Structured accounting sections: 
     a. REVENUE (Gross Revenue, Returns & Allowances, Net Revenue)
     b. COST OF GOODS SOLD (Raw Materials, Direct Labor, Overhead, Total COGS)
     c. OPERATING EXPENSES (SG&A, Officer Compensation, Depreciation & Amortization, Total OpEx)
     d. NORMALIZED CASH FLOW & UNDERWRITING (Operating Income / EBIT, Non-Cash Add-backs, Adjusted EBITDA)
4. Design System:
   - Modern enterprise B2B fintech styling: subtle borders (slate-200), high-density typography (Inter/Geist), muted slate backgrounds (slate-50), and clear visual hierarchy.
   - Use local state and inline Tailwind styles. Keep everything in a single self-contained page component or clean modular components in an @/components directory.

```

### Prompt 1.2: Local Mock Data Structure, Interactive Provenance & Inline Edits

```text
Role: Senior React Architect
Stack: TypeScript, React State

Context:
Underwriters cannot trust a black-box AI. Every cell in the spread must have bidirectional provenance: clicking a cell must highlight the exact source bounding box on the mock document. Furthermore, underwriters must be able to edit numbers directly in the table.

Task:
Refactor the interface to use a comprehensive local mock data array and interactive bidirectional state:
1. Data Model:
   - Define a TypeScript interface `SpreadingLineItem`:
     - id: string
     - standardizedCategory: string
     - originalLabel: string
     - confidenceScore: number (0.00 to 1.00)
     - pageNumber: number
     - boundingBox: { top: number, left: number, width: number, height: number } // percentages
     - values: { fy2023: number, fy2024: number, fy2025: number }
     - isUserEdited: boolean
2. Mock Dataset:
   - Populate with realistic commercial industrial company data (Apex Precision Machining LLC):
     - Net Revenue: FY23: $12,400,000 | FY24: $14,100,000 | FY25: $15,800,000
     - COGS: FY23: $7,440,000 | FY24: $8,319,000 | FY25: $9,164,000
     - Officer Compensation: FY23: $650,000 | FY24: $720,000 | FY25: $750,000
     - D&A: FY23: $380,000 | FY24: $410,000 | FY25: $460,000
     - Interest Expense: FY23: $140,000 | FY24: $190,000 | FY25: $210,000
     - Annual Senior Debt Principal Service: $350,000
   - Set confidence scores: majority > 0.92, but set Officer Compensation to 0.74 (amber highlight) and D&A to 0.68 (red highlight) to indicate parsing ambiguity.
3. State & Interactivity:
   - Click-to-Inspect: Clicking any row in the spreading grid sets `activeLineItemId`. On the Left Pane, render a glowing blue bounding box overlay over the mock document corresponding to the item's `boundingBox` coordinates.
   - Inline Editing: Double-clicking any cell switches it to a numeric input. When altered, mark the cell with a subtle "Edited" badge, recalculate derived rows automatically, and set `isUserEdited: true`.
   - Low-Confidence Filter: Add a toggle switch above the table: "Show Flagged Items Only (< 85% Confidence)".

```

### Prompt 1.3: Real-Time Underwriting & Covenant Metric Engine

```text
Role: Financial Software Engineer & Credit Quant
Stack: React Hooks, Pure TypeScript Math

Context:
Underwriters make credit decisions based on covenant compliance, specifically the Debt Service Coverage Ratio (DSCR = Adjusted EBITDA / Total Debt Service). We need a live calculation engine that computes underwriting metrics from the spreading grid.

Task:
Implement a client-side reactive financial calculation engine that updates in real time whenever values in the spreading table are edited:
1. Calculation Formulas:
   - Gross Profit = Net Revenue - Total COGS
   - Operating Income (EBIT) = Gross Profit - Total OpEx
   - Adjusted EBITDA = EBIT + Depreciation & Amortization + Officer Comp Excess (where excess = max(0, Officer Comp - $400,000 benchmark))
   - Total Debt Service = Annual Senior Debt Principal ($350,000) + Interest Expense
   - DSCR = Adjusted EBITDA / Total Debt Service
2. Underwriting Metric Summary Cards:
   - Position these sticky at the bottom or as a top executive ribbon:
     a. Adjusted EBITDA (with % margin)
     b. Total Debt Service
     c. DSCR (e.g., "1.42x")
     d. Covenant Decision Badge:
        - If DSCR >= 1.30x: Green badge ("Pass - Meets Target Covenant")
        - If 1.15x <= DSCR < 1.30x: Yellow badge ("Borderline - Senior Approval Required")
        - If DSCR < 1.15x: Red badge ("Fail - Below Mandatory Minimum Covenant")
3. Debt Stress-Testing Slider:
   - Add an interactive slider: "Simulate Interest Rate Hike (+0.0% to +3.0%)".
   - Adjusting the slider recalculates the Interest Expense, updates Total Debt Service, and immediately shifts the DSCR metric and decision badge.

```

---

## Tier 2: MVP 2 (Server-Side Ingestion, Live SEC EDGAR XBRL Data & LLM Pipeline)

> **Objective:** Transition from mock arrays to live financial data ingestion. Connect the SEC EDGAR public API, implement layout-aware extraction with Google Gemini / OpenAI structured outputs, handle asynchronous loading states, and configure environment variables.

### Prompt 2.1: Server-Side SEC EDGAR Data Ingestion Service

```text
Role: Full-Stack Backend Engineer
Stack: Next.js Server Actions / API Routes, Zod, SEC EDGAR Public REST API

Context:
Commercial lenders often cross-reference private borrower numbers with public peers, or spread public debt issuers. The SEC EDGAR REST API provides full XBRL financial disclosures free of charge and requires no authentication keys, but requires strict compliance with fair-access headers.

Task:
Build a server-side ingestion service that queries live SEC filings:
1. API Route: `GET /api/sec/company?ticker={ticker}`
   - Handle ticker-to-CIK resolution using the SEC company tickers list (`https://www.sec.gov/files/company_tickers.json`).
   - Query SEC EDGAR Company Facts: `https://data.sec.gov/api/xbrl/companyfacts/CIK{10-digit-CIK}.json`.
   - Mandatory Header Requirement: Configure `User-Agent` per SEC fair-access policies (e.g., `User-Agent: SpreadSenseAI Research prateek@example.com`).
2. Data Normalization:
   - Extract the last 3 fiscal years of data from the `us-gaap` taxonomy:
     - `Revenues` or `SalesRevenueNet`
     - `CostOfGoodsAndServicesSold` or `CostOfGoodsSold`
     - `OperatingExpenses` or `SellingGeneralAndAdministrativeExpense`
     - `DepreciationAndAmortization`
     - `InterestExpense`
     - `NetIncomeLoss`
3. Frontend Integration:
   - In the Left Pane header, add a live search bar: "Search Public Peer via Ticker (e.g., CAT, DE, PCAR, GE)".
   - While fetching, render a Skeleton Loader for both the document viewer and the spreadsheet table.
   - On response, dynamically populate the spreading grid with the live SEC data and display the entity's CIK and primary SIC industry code.

```

### Prompt 2.2: LLM Financial Extraction Engine via Structured Outputs

```text
Role: Applied AI Engineer & Prompt Architect
Stack: Node.js / Next.js, Google Gemini SDK (@google/genai) or OpenAI SDK, Zod Schema

Context:
When an underwriter uploads an unstructured document (raw OCR text or JSON table dump), we need an LLM to accurately extract the values and map them to our strict standardized GAAP schema, complete with confidence scores and reasoning.

Task:
Implement a server-side route `/api/spread/extract` that uses an LLM with structured outputs:
1. Environment Variable Configuration:
   - Expect `GEMINI_API_KEY` or `OPENAI_API_KEY` loaded securely from `.env.local`. Validate with a schema guard on startup.
2. Extraction Schema (Zod / JSON Schema):
   - Define a strict schema requiring:
     - `company_name`: string
     - `fiscal_year`: number
     - `line_items`: array of:
       - `target_gaap_category`: enum (Gross Revenue, COGS, SG&A, Officer Compensation, Depreciation, Interest Expense, Other Income)
       - `raw_source_label`: string (exact text from document)
       - `extracted_value`: number
       - `confidence_score`: number (0.0 to 1.0)
       - `mapping_rationale`: string (concise explanation of why this raw label maps to the GAAP category)
       - `is_potential_addback`: boolean (flags discretionary or non-recurring items)
3. System Prompt:
   - Instruct the LLM as an expert commercial credit analyst. It must distinguish between operating expenses and non-operating expenses, identify non-cash charges, and flag owner-related personal expenses for EBITDA add-backs.
4. Error & Fallback Handling:
   - Implement graceful error boundaries with toast notifications if the API key is missing or invalid.
   - If an extraction fails, provide actionable diagnostics and fall back to the last cached local spread.

```

### Prompt 2.3: Document Upload, Layout Extraction & Streaming Review Status

```text
Role: Full-Stack Engineer
Stack: React Dropzone, Server Actions, Server-Sent Events or Optimistic UI

Context:
Underwriters need to upload raw PDF or CSV balance sheets and income statements, see immediate upload progress, and watch the automated spreading engine process each section in stages.

Task:
Implement file upload and progressive extraction visualization:
1. Upload Dropzone:
   - Add a drag-and-drop zone in the Left Pane supporting PDF and CSV uploads (max 10MB).
2. Step-by-Step Processing Timeline:
   - When a file is dropped, display an interactive progress drawer showing the pipeline stages:
     - Stage 1: Document OCR & Layout Detection (Complete)
     - Stage 2: Table Geometry & Cell Coordinate Mapping (Active)
     - Stage 3: LLM Semantic Line-Item Classification (Queued)
     - Stage 4: Double-Entry Math Reconciliation & DSCR Check (Queued)
3. Discrepancy Modal:
   - If the sum of extracted expenses does not equal the extracted `Total Operating Expenses` within a $1.00 rounding tolerance, open an "Underwriter Discrepancy Resolution" dialog.
   - Show the detected difference, highlight the two conflicting rows in yellow, and prompt the underwriter to choose between "Accept Document Total" or "Recalculate from Line Items".

```

---

## Tier 3: Scaling for Enterprise (Persistence, Security, Deep Analytics & Institutional Polish)

> **Objective:** Upgrade the architecture into an enterprise-ready platform with database persistence (Supabase/PostgreSQL), multi-deal management, role-based route protection, interactive risk visualizations (Recharts), and a unified dark/light financial terminal theme.

### Prompt 3.1: Persistent Database Layer (Supabase / PostgreSQL) & Deal Pipeline

```text
Role: Database Architect & Enterprise Backend Engineer
Stack: Supabase, PostgreSQL, Prisma or Drizzle ORM

Context:
Commercial credit departments manage dozens of active loan applications across various approval stages. Spreads, manual adjustments, audit logs, and covenant metrics must be securely persisted to a relational database.

Task:
Design and implement the persistent data architecture:
1. Database Schema:
   - `deals`: id, borrower_name, facility_amount, industry_sic, credit_officer_id, status (intake, spread_in_progress, pending_review, approved, rejected), created_at.
   - `financial_spreads`: id, deal_id, statement_type (audit, tax_return, internal_interim), fiscal_year, is_finalized.
   - `spread_line_items`: id, spread_id, standardized_category, raw_label, amount, confidence_score, bounding_box_json, is_user_edited, edit_reason, audit_user_id.
   - `covenant_evaluations`: id, deal_id, dscr_result, ebitda_result, interest_rate_spread, passes_covenant, timestamp.
2. Deal Selector & Multi-Tenancy:
   - Build a top-bar drawer or sidebar allowing analysts to switch between active borrower files.
   - Auto-save: Every inline edit in the spreading grid debounces and automatically writes to the database, updating an indicator in the toolbar: "All changes saved to audit log".
3. Audit History Modal:
   - Add an "Audit Trail" button showing who edited which line item, the original extracted AI value vs. human-adjusted value, and the timestamp.

```

### Prompt 3.2: Middleware Route Protection, RBAC & SOC2-Compliant Masking

```text
Role: Security Engineer & Compliance Specialist
Stack: Next.js Middleware, Supabase Auth or NextAuth.js

Context:
Financial spreading engines process non-public, highly sensitive business and personal financial data (EINs, SSNs on personal guarantees, corporate banking accounts). Institutional governance requires strict role-based access control (RBAC).

Task:
Implement security guards and financial privacy controls:
1. Middleware Guards:
   - Protect all `/spread/*` and `/api/*` endpoints.
   - Implement three distinct roles:
     - `CreditAnalyst`: Can view, upload, edit numbers, and submit spreads for review.
     - `CreditOfficer` (Approver): Can view, override spreads, and sign off on covenants.
     - `Auditor`: Read-only access to finalized spreads and audit logs.
2. PII / Tax ID Masking Utility:
   - Build a client-side and server-side sanitizer that automatically scans for Employer Identification Numbers (EINs: `XX-XXXXXXX`) and Social Security Numbers (`XXX-XX-XXXX`) in uploaded files.
   - Mask them in the UI preview (`**-***1234`) with a toggle available only to authenticated Credit Officers: "Reveal Sensitive Identifiers (Logged)".

```

### Prompt 3.3: Interactive Credit Analytics, Stress-Testing (Recharts) & Financial Dark Mode

```text
Role: Lead Design Technologist & Data Visualization Engineer
Stack: Recharts, Tailwind CSS (Class-based Dark Mode), Radix UI

Context:
Chief Credit Officers need more than static rows—they require trend visualization across trailing years, margin evolution charts, and sensitivity tables showing how DSCR degrades under changing interest rates and revenue contractions.

Task:
Add an executive visualization tab and terminal-grade visual theme:
1. Analytics & Visualizations Tab (Toggle between "Spreading Grid" and "Risk Analytics"):
   - Chart 1 (Multi-Bar + Line Chart): 3-Year Historical Revenue vs. Gross Margin % vs. Adjusted EBITDA.
   - Chart 2 (Sensitivity Heatmap / Matrix): A 5x5 matrix showing DSCR sensitivity where the Y-axis is Revenue Change (-10%, -5%, 0%, +5%, +10%) and the X-axis is Prime Rate Hike (+0 bps, +100 bps, +200 bps, +300 bps, +400 bps). Highlight safe zones in green and breach zones in red.
2. Professional Financial Terminal Dark Mode:
   - Implement a unified dark mode toggle (System / Light / Bloomberg Dark).
   - Use high-contrast terminal styling: deep navy/charcoal backgrounds (`#0a0f1d`), crisp emerald greens for positive coverage (`#10b981`), amber for risk warnings (`#f59e0b`), and sharp tabular numbers using monospace font variants (`font-mono`).
3. Institutional Export:
   - Implement an "Export Credit Memo Package" feature that generates an executive PDF summary combining the normalized spread, the sensitivity matrix, and the underwriter's digital sign-off block.

---

## MVP Execution Record & Design Compliance

* **Date:** September 29, 2026
* **Status:** MVP Tier 1 Complete & Verified
* **Design System Applied:** "Lucent Minimal" (Light Mode) with warm off-white radial canvas (`#F9F9F8`), frosted glass layers (`backdrop-blur-2xl`, `bg-white/45`), zero solid borders, jet-black headlines (`#0D0D0D`), muted stone body text (`#6E6D7A`), tight tracking (`-0.03em`), and atmospheric diffuse glows.
* **Core Modules Built:**
  - `src/types/spreading.ts`: Strict TypeScript domain interfaces.
  - `src/utils/financialMath.ts`: Pure underwriting & DSCR covenant engine + sensitivity matrix generator.
  - `src/data/mockDeals.ts`: 3 multi-entity commercial borrower deals with bounding box coordinate provenance.
  - `src/components/layout/Header.tsx`: Floating glass dock with deal selector and action buttons.
  - `src/components/covenant/CovenantRibbon.tsx`: Real-time executive underwriting ribbon + rate-shock slider.
  - `src/components/document/SourceDocumentViewer.tsx`: Document previewer with dynamic glowing coordinate bounding boxes.
  - `src/components/grid/SpreadingGrid.tsx`: Standardized GAAP table with double-click inline edits, confidence filters, and addback toggles.
  - `src/components/analytics/SensitivityMatrixModal.tsx`: 5x5 DSCR stress-test matrix.
  - `src/components/export/CreditMemoModal.tsx`: Institutional Credit Memo export package.
  - `src/components/upload/DocumentUploadModal.tsx`: File ingestion and pipeline simulation.
  - `src/components/sec/SecEdgarSearchModal.tsx`: SEC EDGAR public peer lookup.


```