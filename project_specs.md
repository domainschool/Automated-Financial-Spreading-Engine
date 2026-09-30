# Project Specifications: SpreadSense AI (Automated Financial Spreading Engine)

## 1. Executive Summary & Vision
**SpreadSense AI** is an intelligent, high-precision automated financial spreading and commercial underwriting platform designed for commercial banks, credit funds, and middle-market lenders. It eliminates the manual "Stare and Compare" transcription bottleneck by ingesting unstructured financial statements (PDFs, SEC EDGAR XBRL filings, CSV reports), deterministically mapping non-standard borrower Chart of Accounts to standardized GAAP taxonomies, enforcing double-entry mathematical reconciliation, providing bidirectional visual cell-to-source provenance, and dynamically computing underwriting covenant metrics (DSCR, FCCR, Adjusted EBITDA, Debt Service Sensitivity).

---

## 2. Design System: "Lucent Minimal" (Light Mode Architecture)
*Strictly prioritizing the bespoke Lucent Minimal aesthetic guidelines over standard default styles:*

* **Foundation & Canvas:**
  - Base background: Warm, luminous off-white (`#F9F9F8` / `#FAF9F6`).
  - Atmospheric depth: Soft, ambient radial gradients of pale champagne (`#F4EFEA`) and bleached cobalt (`#EDF2F7`).
  - Noise & Subtlety: Soft light refractions and gentle organic aura.
* **Surface & Glassmorphism:**
  - Zero harsh/solid outlines and borders.
  - Deep architectural frosted glass layers: `backdrop-blur-2xl bg-white/45` (and layered `bg-white/60` for elevated floating docks).
  - Multi-tiered elevation through smooth luminosity contrasts rather than sharp borders.
* **Typography & Editorial Cadence:**
  - Primary Headlines & Key Metrics: Jet-black (`#0D0D0D`).
  - Secondary & Micro-labels: Muted stone (`#6E6D7A`) and slate tone.
  - Tracking: Ultra-tight tracking (`tracking-[-0.03em]`) on sans-serif display type (Inter Display / Geist / SF Pro Display) for an authoritative editorial tone.
  - Tabular Numbers: Monospace alignment (`font-mono` / `tabular-nums`) for currency and decimal figures.
* **Spatial Cadence & Layout:**
  - Radical, generous whitespace (`p-8` to `p-12`, `gap-8`), giving metrics, charts, and table rows dramatic breathing room.
* **Active States & Atmospheric Shadows:**
  - Atmospheric depth: `shadow-[0_20px_50px_rgba(20,20,30,0.06)]` combined with diffuse highlight glows (`shadow-[0_12px_36px_rgba(99,102,241,0.12)]`).
  - Active nodes and row hover states highlight with soft glowing aura instead of solid borders.

---

## 3. Core Capabilities & User Inputs
1. **Multi-Source Financial Ingestion:**
   - **SEC EDGAR Live Ingestion:** Direct search of public tickers (e.g., `CAT`, `DE`, `GE`, `PCAR`, `UNH`) fetching 10-K/10-Q XBRL statements via SEC EDGAR REST API with compliant headers.
   - **Document & File Upload:** Multi-period PDF and CSV financial statement drag-and-drop parsing.
   - **Curated Multi-Entity Sample Library:** Immediate zero-config switching between pre-parsed deals (e.g., *Apex Precision Machining LLC*, *Vanguard Logistics Corp*, *BioHealth Systems*).
2. **Interactive Human-in-the-Loop (HITL) Spreading Grid:**
   - Standardized GAAP sections: **Revenue**, **COGS**, **Operating Expenses**, **Non-Cash & Discretionary Add-backs**, **Debt & Cash Flow**.
   - **Bidirectional Cell-to-Source Provenance:** Clicking any cell instantly targets and highlights the source bounding box $(x, y, w, h, \text{page})$ in the document viewport.
   - **Inline Spread Editing:** Double-click numeric editing, visual edit audit badges, and instant cascading formula re-calculation.
   - **Confidence Filtering & Discrepancy Warnings:** Color-coded confidence flags (<85% amber glow, <70% red alert) and double-entry mismatch resolution drawer.
3. **Real-Time Underwriting & Covenant Calculation Engine:**
   - **Adjusted EBITDA Calculation:** Operating Income + Depreciation & Amortization + Discretionary Owner Add-backs + Normalized Adjustments.
   - **Total Debt Service:** Annual Senior Principal + Projected Annual Interest Expense.
   - **DSCR Covenant Policy Engine:**
     - $\text{DSCR} \ge 1.30\text{x}$: **Pass** (Green Glow - Meets Target Covenant)
     - $1.15\text{x} \le \text{DSCR} < 1.30\text{x}$: **Borderline** (Amber Glow - Mitigants / Exception Approval Required)
     - $\text{DSCR} < 1.15\text{x}$: **Fail** (Crimson Glow - Sub-covenant Leverage)
   - **Interactive Rate Shock & Revenue Stress-Testing Slider:** Real-time interest rate sensitivity (+0.0% to +4.0%) and revenue contraction sliders with instant dynamic DSCR recalculation.
4. **Credit Risk Analytics & Visualization Suite:**
   - Multi-period revenue, gross margin %, and EBITDA trend charts.
   - 5x5 DSCR Sensitivity Matrix (Revenue % contraction vs. Interest Rate hike).
5. **Institutional Credit Memo & Export:**
   - One-click export of executive credit underwriting summary, covenant compliance certificate, and audit trail.

---

## 4. Technology Stack & Tools
* **Frontend Framework:** React 19 / Vite + TypeScript (Strict Mode).
* **Styling & Design System:** Tailwind CSS v4 / PostCSS, Lucide React icons, Canvas & SVG visualizers.
* **Charts & Visualizations:** Recharts / HTML5 Canvas for sensitivity matrix.
* **Math & Validation:** Pure TypeScript accounting utility engine, Zod for data schema verification.
* **Public Data API:** SEC EDGAR Company Facts & Submissions REST API (Direct client/proxy with SEC fair-access compliance).
* **AI/LLM Integration:** Extensible Google Gemini (`@google/genai`) / OpenAI API integration layer for unstructured line item mapping.
* **Package Manager:** `pnpm` exclusively.
* **Deployment Target:** GitHub Pages (`gh-pages`).

---

## 5. Phased Implementation Roadmap

### Phase 1: MVP (Zero-Config Scaffolding & Local Interactive State)
- Project initialization with Vite + React + TypeScript + Tailwind CSS + Lucide Icons using `pnpm`.
- Implementation of "Lucent Minimal" design foundation (soft radial gradients, frosted glass cards, jet-black typography, ultra-tight tracking, atmospheric shadows).
- Split-screen viewport: Source Document Viewport (45%) and Standardized GAAP Spreading Grid (55%).
- High-fidelity mock commercial borrower dataset (*Apex Precision Machining LLC* - 3-Year Audited Spread).
- Bidirectional cell-to-source bounding box provenance overlay.
- Inline cell editing with instant reactive cascading recalculations.
- Executive covenant metrics ribbon (Adjusted EBITDA, Total Debt Service, DSCR Badge, Rate Shock Slider).
- Confidence filter toggle (<85% confidence score highlighting).

### Phase 2: Live SEC EDGAR Ingestion & Advanced Pipeline
- Live SEC EDGAR ticker resolver and XBRL financial statement parser for public peer benchmarking.
- Multi-deal switcher (Apex Precision, Titan Heavy Industries, Northwind Cold Logistics).
- Drag-and-drop PDF/CSV document ingestion mock/parser pipeline with step-by-step extraction progress drawer.
- Double-entry discrepancy resolution modal for accounting horizontal/vertical validation.
- Gemini/OpenAI structured taxonomy classification hook for custom text inputs.

### Phase 3: Credit Risk Analytics, Sensitivity Matrix & Export
- Executive Risk Analytics dashboard tab (Revenue & EBITDA evolution, Gross Margin trends).
- 5x5 DSCR Sensitivity Matrix under shifting interest rate and revenue scenarios.
- Underwriting Audit Log drawer with change-history tracking.
- Institutional "Export Credit Memo" generator.
- GitHub Pages build and deployment configuration (`gh-pages`, `vite.config.ts` base path).

---

## 6. Definition of "Done" for MVP
1. Clean TypeScript build with zero compilation errors (`tsc --noEmit`).
2. Splendid Lucent Minimal aesthetic adhering to the off-white gradient canvas, frosted glass surfaces, generous padding, and atmospheric glows.
3. Interactive split-screen layout with interactive document canvas on the left and GAAP table on the right.
4. Working bidirectional provenance: clicking any cell in the spread focuses and draws a glowing highlight on the document coordinates.
5. Real-time DSCR calculation responding immediately to inline spreadsheet edits and the rate-shock slider.
6. Seamless local execution via `pnpm run dev` ready for user review and testing.
