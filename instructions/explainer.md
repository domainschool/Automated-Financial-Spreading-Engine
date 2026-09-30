# Product Concept: SpreadSense AI (Automated Financial Spreading Engine)

---

## 1. The Business Problem

In commercial lending, middle-market underwriting operations suffer from the **"Stare and Compare" bottleneck**.

When a commercial borrower requests a credit facility (e.g., a $5M working capital line or equipment financing), they submit unstructured financial packages: three years of corporate tax returns (IRS Form 1120/1120-S), CPA-audited financial statements, and interim trailing-twelve-month (TTM) income statements in flat PDF formats.

Underwriters and credit analysts must manually extract dozens of fragmented line items and re-key them into the bank’s standardized Excel spreading model (such as Moody’s CreditLens, Baker Hill, or custom macro-enabled workbooks) to compute covenant benchmarks like the **Debt Service Coverage Ratio (DSCR)** and **Fixed Charge Coverage Ratio (FCCR)**.

This manual transcription workflow introduces three operational vulnerabilities:

* **High Turnaround Friction:** Spreading a complex multi-entity borrower takes 3 to 6 hours per deal, creating a loan origination delay of 5 to 10 business days.
* **Operational Risk & Fat-Finger Errors:** A transposed digit in operating expenses or an omitted interest expense can distort EBITDA, resulting in incorrect credit decisions, improper loan pricing, or regulatory non-compliance during OCC/FDIC loan reviews.
* **Wasted Talent Capacity:** Senior credit analysts earning $100k+ spend 30% to 40% of their billable week on routine data entry rather than conducting qualitative borrower risk analysis and structuring debt covenants.

---

## 2. The Industry Logic

By developing this product, a builder learns the mechanics of **Commercial Credit Analysis, Accounting Taxonomy Normalization, and Auditable Human-in-the-Loop (HITL) Extraction**.

### Core Domain Principles

* **Non-Standard Line-Item Normalization:** Every borrower's Chart of Accounts (COA) is labeled differently. A line item labeled *"Gross Turnover"*, *"Client Billings"*, or *"Contract Revenues"* must be deterministically mapped to the standard GAAP financial bucket: `Gross Revenue`. Similarly, items like *"Officer Compensation"*, *"Non-Recurring Litigation Settlements"*, or *"Depreciation of Leasehold Improvements"* must be classified correctly to calculate normalized EBITDA.
* **Underwriting Math (The DSCR Formula):** Underwriters do not lend on Net Income; they lend on operating cash flow.

$$\text{DSCR} = \frac{\text{Net Operating Income (NOI) or Adjusted EBITDA}}{\text{Total Debt Service (Annual Principal + Interest Payments)}}$$



A DSCR below $1.0\text{x}$ signals negative cash flow; institutional lenders typically require a covenant minimum of $1.20\text{x} \text{ -- } 1.35\text{x}$.
* **Auditability & Provenance:** Banking compliance mandates that every single output cell must be explainable. An underwriter cannot accept a "black-box" extracted number; they require **bidirectional bounding-box provenance** (clicking a cell in the spread must highlight the exact coordinates on page 42 of the source PDF).

### Architectural Pattern: Human-in-the-Loop Extraction Pipeline

* **Document Ingestion & OCR Pre-processing:** PDF layout parsing using vision-capable LLMs or layout-aware parsers to extract tabular structures while retaining bounding box coordinates $(x, y, w, h)$.
* **Deterministic Taxonomy Mapping Engine:** A two-stage pipeline where an LLM suggests the GAAP line-item classification, validated against an explicit JSON Schema of the target spreading template.
* **Interactive Discrepancy UI (HITL):** A side-by-side viewport displaying the raw document on the left and the editable normalized spread on the right, highlighting low-confidence extractions for analyst approval before committing to the loan book.

---

## 3. The Data Source

To prototype this system without incurring legal hurdles or needing proprietary bank borrower files, builders can utilize the **SEC EDGAR REST APIs**, which are free, public, and require no API key.

* **Target Endpoints:**
* **Company Facts API:** `[https://data.sec.gov/api/xbrl/companyfacts/CIK](https://data.sec.gov/api/xbrl/companyfacts/CIK){10-digit-CIK}.json`. Provides all historical XBRL-disclosed line items (Income Statements, Balance Sheets, Cash Flows) mapped to standardized `us-gaap` tags.
* **Company Submissions API:** `[https://data.sec.gov/submissions/CIK](https://data.sec.gov/submissions/CIK){10-digit-CIK}.json`. Retrieves filing metadata and raw PDF/HTML links for Form 10-K (Annual Reports) and Form 10-Q (Quarterly Reports).


* **Prototype Implementation Strategy:**
1. Download the raw PDF/HTML 10-K filings of recognizable public mid-market companies (e.g., regional industrial manufacturers, retail chains).
2. Use your extraction pipeline to parse the unstructured financial tables from the PDF.
3. Benchmark and evaluate your extraction engine's accuracy by comparing its output against the gold-standard ground truth provided directly in the SEC EDGAR XBRL JSON dataset.



---

# Primer: Building SpreadSense AI — The Commercial Lending Financial Spreading Engine

*Why modern commercial credit teams are ditching manual data entry, how accounting mechanics govern enterprise software design, and how to build a working prototype with AI-assisted engineering.*

---

Every year, commercial banks and private credit funds deploy trillions of dollars into mid-market companies—the regional logistics companies, specialty manufacturers, and healthcare practices that form the backbone of the economy. Yet, behind this monumental allocation of capital lies an antiquated manual process: **Financial Spreading**.

Before a bank approves a $10 million commercial loan, a credit analyst spends days reviewing hundreds of pages of unstructured corporate documents: PDF tax returns, audited balance sheets, debt schedules, and quarterly income statements. The analyst's job? Manually copy-pasting numbers from those messy documents into an institutional Excel template.

This guide breaks down the mechanics of financial spreading, how to solve this bottleneck with modern AI architectures, and how to prototype an automated extraction and spreading engine using AI-assisted programming ("vibe coding").

---

## Part 1: The Domain Mechanics of Commercial Lending

To build software for commercial underwriting, developers must first understand how credit analysts assess corporate health.

### 1. The Core Objective: Debt Service Coverage

Unlike equity investors who seek unlimited upside, commercial lenders care primarily about **downside risk mitigation** and **predictable cash generation**. They ask one fundamental question: *Can this business generate enough operating cash flow to service its principal and interest payments, even in a recession?*

The benchmark metric used to answer this is the **Debt Service Coverage Ratio (DSCR)**:

$$\text{DSCR} = \frac{\text{Net Operating Income (NOI) or Adjusted EBITDA}}{\text{Annual Principal Payments} + \text{Annual Interest Payments}}$$

* **DSCR < 1.0x:** The business does not generate enough cash to pay its debts. It must rely on existing cash reserves, owner cash injections, or default.
* **DSCR = 1.0x - 1.15x:** A razor-thin margin of safety. Any operational downturn jeopardizes debt repayment.
* **DSCR ≥ 1.25x - 1.35x:** The industry standard threshold for approving conventional commercial credit facilities.

### 2. The Spreading Problem: The Chart of Accounts Babel

Why can’t underwriters simply run an automated script across financial statements? Because no two companies label their financial statements the same way.

A software firm might report *"Contract Subscription ARR"*, an auto dealership reports *"Vehicle Sales & Floorplan Rebates"*, and an engineering firm reports *"Progress Billings Under Fixed-Fee Engagements"*.

To perform a risk analysis, the lender must normalize every unique line item into a **Standard GAAP Spreading Taxonomy**:

| Borrower Line Item (Raw PDF) | Target GAAP Category | Underwriting Impact |
| --- | --- | --- |
| *Progress Billings on Uncompleted Jobs* | `Gross Revenue` | Feeds top-line run rate |
| *Direct Shop Labor & Freight-In* | `Cost of Goods Sold (COGS)` | Affects Gross Margin stability |
| *Discretionary Owner Bonus* | `Add-Back / Adjusted EBITDA` | Cash flow added back to service bank debt |
| *Amortization of Acquired IP* | `Depreciation & Amortization` | Non-cash expense; added back to cash flow |
| *Subordinated Shareholder Note Interest* | `Subordinated Debt Service` | Excluded from senior debt service calculations |

The critical underwriting step is calculating **Normalized EBITDA (Earnings Before Interest, Taxes, Depreciation, and Amortization)**. Analysts routinely apply **"Add-Backs"**—adjusting for non-recurring or discretionary expenses (e.g., personal vehicles billed to the company, one-time legal fees, owner salaries above market rate). An automated engine must not only capture standard numbers, but flag these potential adjustments.

---

## Part 2: Product Architecture & System Design

Automating financial spreading is fundamentally an **information extraction, semantic mapping, and reconciliation challenge**.

```
  [Unstructured PDF / SEC EDGAR API]
                 │
                 ▼
     [Layout-Aware Parser / OCR]
                 │
                 ▼
 [Line-Item Classification (LLM + Structured Output)]
                 │
                 ▼
 [Reconciliation & Accounting Verification Engine]
                 │
                 ▼
 [Human-in-the-Loop (HITL) Split-Screen Review UI]
                 │
                 ▼
[Export: Standardized Financial Spread + Covenant Check]

```

### 1. Ingestion & Layout-Aware Extraction

Standard OCR tools discard structural geometry, transforming neat tables into unreadable text strings. A production spreading engine requires layout-aware parsing:

* Bounding boxes $(x, y, w, h)$ must be retained for every label and number.
* Column headers (e.g., *"Twelve Months Ended Dec 31, 2025"* vs. *"Twelve Months Ended Dec 31, 2024"*) must be tethered to the correct data columns.

### 2. Semantic Mapping Engine

Once the text and tabular cells are isolated, a structured inference model classifies each extracted line item into the bank's taxonomy.

Rather than sending raw text prompts to an LLM, the system leverages **Pydantic Schemas / Structured Outputs**. The model is constrained to match each raw row against a predefined financial enum, assigning an extraction confidence score between $0.00$ and $1.00$.

### 3. The Double-Entry Validation Engine

In finance, you never trust an LLM's math. The extraction pipeline must be paired with deterministic reconciliation rules:

* **Horizontal Check:** $\text{Gross Revenue} - \text{COGS} = \text{Gross Profit}$
* **Vertical Check:** $\sum (\text{Individual Operating Expenses}) = \text{Total Operating Expenses}$
* **Balance Sheet Integrity:** $\text{Total Assets} = \text{Total Liabilities} + \text{Stockholders' Equity}$

If the mathematical checks do not balance within a $0.01 tolerance, the system flags the specific row in the interface for human review.

### 4. Human-in-the-Loop (HITL) Interface

Banks operate in a strictly audited environment. The UI must provide a **Split-Screen Review Workspace**:

* **Left Pane:** The original PDF document, rendered using a PDF canvas.
* **Right Pane:** The extracted, standardized financial spread.
* **Provenance Interaction:** Clicking any cell in the spread highlights the exact source bounding box on the original document, allowing the credit analyst to verify the figure in seconds.

---

## Part 3: Step-by-Step Vibe Coding Build Strategy

Using AI development environments (such as Cursor, Replit, or Lovable), you can assemble this prototype in four focused iterations.

### Step 1: Ingest Public Financial Data via the SEC EDGAR API

Instead of waiting for real tax documents, leverage live, public SEC filings.

* Configure an API client to pull from `data.sec.gov`.
* Declare a custom user agent per SEC requirements (e.g., `User-Agent: FinancialSpreadingApp admin@example.com`).
* Fetch filing histories using the Company Submissions endpoint: `[https://data.sec.gov/submissions/CIK](https://data.sec.gov/submissions/CIK){cik}.json`.
* Fetch parsed GAAP ground-truth data from the Company Facts endpoint: `[https://data.sec.gov/api/xbrl/companyfacts/CIK](https://data.sec.gov/api/xbrl/companyfacts/CIK){cik}.json`.

### Step 2: Build the Extraction Prompt & Schema

Construct a structured schema using TypeScript or Pydantic that enforces rigorous financial outputs:

```json
{
  "company_name": "Acme Industrial Supplies Inc.",
  "reporting_period_end": "2025-12-31",
  "currency": "USD",
  "income_statement": {
    "revenue": { "value": 14250000, "source_label": "Net Contract Sales", "confidence": 0.98 },
    "cogs": { "value": 8550000, "source_label": "Direct Material & Job Costs", "confidence": 0.95 },
    "gross_profit": { "value": 5700000, "source_label": "Gross Margin", "confidence": 0.99 },
    "depreciation_amortization": { "value": 420000, "source_label": "D&A Expense", "confidence": 0.91 },
    "interest_expense": { "value": 180000, "source_label": "Finance Charges & Interest", "confidence": 0.94 },
    "net_income": { "value": 890000, "source_label": "Net Earnings", "confidence": 0.97 }
  },
  "covenant_inputs": {
    "annual_principal_debt_service": 250000
  }
}

```

Prompt your AI coding environment to build an extraction module that accepts unstructured tables, maps them directly into this JSON structure, and flags unmapped line items.

### Step 3: Implement Deterministic Financial Logic

Build a deterministic calculation service in Python or TypeScript that consumes the extraction JSON to compute credit metrics:

```typescript
// Deterministic underwriting calculations
export function calculateCreditMetrics(spread: FinancialSpread) {
  const { revenue, cogs, gross_profit, operating_expenses, depreciation_amortization, interest_expense, net_income } = spread.income_statement;
  const { annual_principal_debt_service } = spread.covenant_inputs;

  // EBITDA Calculation
  const calculatedEbitda = net_income.value + interest_expense.value + depreciation_amortization.value;
  
  // Total Debt Service: Annual Principal Payments + Interest Expense
  const totalDebtService = annual_principal_debt_service + interest_expense.value;

  // Debt Service Coverage Ratio
  const dscr = totalDebtService > 0 ? (calculatedEbitda / totalDebtService) : 0;

  return {
    gross_margin_pct: (gross_profit.value / revenue.value) * 100,
    ebitda: calculatedEbitda,
    total_debt_service: totalDebtService,
    dscr: parseFloat(dscr.toFixed(2)),
    underwriting_verdict: dscr >= 1.25 ? "APPROVED_COVENANT_MET" : "REVISE_OR_FLAG"
  };
}

```

### Step 4: Construct the HITL Review Interface

Prompt your vibe coding assistant to build a responsive front-end dashboard:

* **Component 1 (File Loader):** A sidebar allowing users to select a company (pulling 10-K filings via EDGAR) or upload a custom financial statement PDF.
* **Component 2 (Spreadsheet Grid):** An interactive data grid displaying standardized line items across historical years (e.g., 2023, 2024, 2025).
* **Component 3 (Confidence Indicators):** Cells with an extraction confidence score $< 0.85$ are marked in amber. Analysts can click to adjust values directly.
* **Component 4 (Covenant Panel):** A real-time executive card displaying the final calculated DSCR, Interest Coverage Ratio, and leverage metrics.

---

## Part 4: The Strategic Imperative of Domain Knowledge

In an era where generative AI and coding assistants make raw syntax, API scaffolding, and CRUD applications trivial to build, **technical proficiency alone is no longer a durable moat**.

When anyone can generate a full-stack React and FastAPI template in minutes using plain English prompts, engineering value shifts from *how to write the code* to *knowing exactly what to build and why*.

### 1. Code is a Commodity; Domain Logic is the IP

Anyone can build a generic document extractor using off-the-shelf OCR models. But without understanding commercial banking:

* You won't know why an underwriter cares about adding back non-cash depreciation to Net Income.
* You won't realize that failing to account for subordinated debt service will cause a bank to reject a viable loan or approve a toxic one.
* You won't design auditability and cell-level provenance into the UI—the exact feature required by compliance and risk committees.

The competitive advantage of enterprise software is rarely the sophistication of its frontend components; it is the **fidelity of its domain model**.

### 2. Bridging the Gap Between Engineering and Enterprise Value

Tech professionals who understand industry mechanics—whether in commercial banking, corporate supply chains, reinsurance, or regulatory compliance—command outsized leverage. They don't require 30-page functional specification documents to make product decisions. They understand the real-world friction of their end users, design architectures that comply with industry constraints out of the box, and deploy software that solves mission-critical business problems.

Mastering vertical domain knowledge transforms a developer from a replaceable ticket-completer into a strategic solution architect capable of building category-defining enterprise software.

---

## 5. SpreadSense AI Architecture & Lucent Minimal Implementation

### System Architecture
1. **Presentation & Workspace Tier:**
   - Single-page split-screen Human-in-the-Loop (HITL) interface.
   - Left Pane (45%): Dynamic source document canvas with bidirectional coordinate bounding-box overlays.
   - Right Pane (55%): Multi-period standardized GAAP spreading grid with inline double-click editing and discrepancy filtering.
2. **Deterministic Financial Calculation Engine:**
   - Real-time pure TypeScript engine for Adjusted EBITDA, Total Debt Service, and dynamic DSCR policy compliance.
   - Real-time interest rate stress-testing slider (+0.0% to +3.0%) and 5x5 DSCR Sensitivity Matrix.
3. **Design System ("Lucent Minimal" - Light Mode):**
   - Canvas: Warm luminous off-white (`#F9F9F8` / `#FAF9F6`) with soft radial ambient gradients of pale champagne (`#F4EFEA`) and bleached cobalt (`#EDF2F7`).
   - Surfaces: Deep architectural frosted glass layers (`backdrop-blur-2xl`, `bg-white/45`) with zero harsh solid borders.
   - Typography: Jet-black primary headlines (`#0D0D0D`), muted stone body text (`#6E6D7A`), ultra-tight tracking (`tracking-[-0.03em]`).
   - Active States: Multi-layered atmospheric drop shadows and diffuse highlight glows.