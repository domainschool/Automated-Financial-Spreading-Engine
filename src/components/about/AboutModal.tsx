import React, { useState } from 'react';
import { 
  X, 
  HelpCircle, 
  BookOpen, 
  Layers, 
  Users, 
  DollarSign, 
  GraduationCap, 
  Code2, 
  Sparkles, 
  Copy, 
  Check, 
  ChevronDown, 
  ChevronUp, 
  ArrowRight,
  ShieldCheck,
  Building,
  TrendingUp,
  FileSpreadsheet
} from 'lucide-react';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface PromptItem {
  id: string;
  tier: string;
  title: string;
  role: string;
  stack: string;
  content: string;
}

const PROMPT_RUNWAY: PromptItem[] = [
  {
    id: '1.1',
    tier: 'Tier 1: MVP Scaffolding',
    title: 'Prompt 1.1: Core Domain Layout & Split-Screen Viewport Scaffolding',
    role: 'Principal Frontend Engineer & Banking UX Specialist',
    stack: 'React, Tailwind CSS, Lucide React, TypeScript',
    content: `Role: Principal Frontend Engineer & Banking UX Specialist
Stack: React, Tailwind CSS, Lucide React, TypeScript

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
   - Use local state and inline Tailwind styles. Keep everything in clean modular components.`
  },
  {
    id: '1.2',
    tier: 'Tier 1: MVP Scaffolding',
    title: 'Prompt 1.2: Local Mock Data Structure, Interactive Provenance & Inline Edits',
    role: 'Senior React Architect',
    stack: 'TypeScript, React State',
    content: `Role: Senior React Architect
Stack: TypeScript, React State

Context:
Underwriters cannot trust a black-box AI. Every cell in the spread must have bidirectional provenance: clicking a cell must highlight the exact source bounding box on the mock document. Furthermore, underwriters must be able to edit numbers directly in the table.

Task:
Refactor the interface to use a comprehensive local mock data array and interactive bidirectional state:
1. Data Model:
   - Define a TypeScript interface SpreadingLineItem:
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
   - Click-to-Inspect: Clicking any row in the spreading grid sets activeLineItemId. On the Left Pane, render a glowing blue bounding box overlay over the mock document corresponding to the item's boundingBox coordinates.
   - Inline Editing: Double-clicking any cell switches it to a numeric input. When altered, mark the cell with a subtle "Edited" badge, recalculate derived rows automatically, and set isUserEdited: true.
   - Low-Confidence Filter: Add a toggle switch above the table: "Show Flagged Items Only (< 85% Confidence)".`
  },
  {
    id: '1.3',
    tier: 'Tier 1: MVP Scaffolding',
    title: 'Prompt 1.3: Real-Time Underwriting & Covenant Metric Engine',
    role: 'Financial Software Engineer & Credit Quant',
    stack: 'React Hooks, Pure TypeScript Math',
    content: `Role: Financial Software Engineer & Credit Quant
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
   - Adjusting the slider recalculates the Interest Expense, updates Total Debt Service, and immediately shifts the DSCR metric and decision badge.`
  },
  {
    id: '2.1',
    tier: 'Tier 2: Live Ingestion & AI Pipeline',
    title: 'Prompt 2.1: Server-Side SEC EDGAR Data Ingestion Service',
    role: 'Full-Stack Backend Engineer',
    stack: 'API Routes, Zod, SEC EDGAR Public REST API',
    content: `Role: Full-Stack Backend Engineer
Stack: Server Actions / API Routes, Zod, SEC EDGAR Public REST API

Context:
Commercial lenders often cross-reference private borrower numbers with public peers, or spread public debt issuers. The SEC EDGAR REST API provides full XBRL financial disclosures free of charge and requires no authentication keys, but requires strict compliance with fair-access headers.

Task:
Build a server-side ingestion service that queries live SEC filings:
1. API Route: GET /api/sec/company?ticker={ticker}
   - Handle ticker-to-CIK resolution using the SEC company tickers list (https://www.sec.gov/files/company_tickers.json).
   - Query SEC EDGAR Company Facts: https://data.sec.gov/api/xbrl/companyfacts/CIK{10-digit-CIK}.json.
   - Mandatory Header Requirement: Configure User-Agent per SEC fair-access policies (e.g., User-Agent: SpreadSenseAI Research prateek@example.com).
2. Data Normalization:
   - Extract the last 3 fiscal years of data from the us-gaap taxonomy:
     - Revenues or SalesRevenueNet
     - CostOfGoodsAndServicesSold or CostOfGoodsSold
     - OperatingExpenses or SellingGeneralAndAdministrativeExpense
     - DepreciationAndAmortization
     - InterestExpense
     - NetIncomeLoss
3. Frontend Integration:
   - In the Left Pane header, add a live search bar: "Search Public Peer via Ticker (e.g., CAT, DE, PCAR, GE)".
   - While fetching, render a Skeleton Loader for both the document viewer and the spreadsheet table.
   - On response, dynamically populate the spreading grid with the live SEC data and display the entity's CIK and primary SIC industry code.`
  },
  {
    id: '2.2',
    tier: 'Tier 2: Live Ingestion & AI Pipeline',
    title: 'Prompt 2.2: LLM Financial Extraction Engine via Structured Outputs',
    role: 'Applied AI Engineer & Prompt Architect',
    stack: 'Node.js, Google Gemini SDK (@google/genai) or OpenAI SDK, Zod Schema',
    content: `Role: Applied AI Engineer & Prompt Architect
Stack: Node.js, Google Gemini SDK (@google/genai) or OpenAI SDK, Zod Schema

Context:
When an underwriter uploads an unstructured document (raw OCR text or JSON table dump), we need an LLM to accurately extract the values and map them to our strict standardized GAAP schema, complete with confidence scores and reasoning.

Task:
Implement a server-side route /api/spread/extract that uses an LLM with structured outputs:
1. Environment Variable Configuration:
   - Expect GEMINI_API_KEY or OPENAI_API_KEY loaded securely. Validate with a schema guard on startup.
2. Extraction Schema (Zod / JSON Schema):
   - Define a strict schema requiring:
     - company_name: string
     - fiscal_year: number
     - line_items: array of:
       - target_gaap_category: enum (Gross Revenue, COGS, SG&A, Officer Compensation, Depreciation, Interest Expense, Other Income)
       - raw_source_label: string (exact text from document)
       - extracted_value: number
       - confidence_score: number (0.0 to 1.0)
       - mapping_rationale: string (concise explanation of why this raw label maps to the GAAP category)
       - is_potential_addback: boolean (flags discretionary or non-recurring items)
3. System Prompt:
   - Instruct the LLM as an expert commercial credit analyst. It must distinguish between operating expenses and non-operating expenses, identify non-cash charges, and flag owner-related personal expenses for EBITDA add-backs.
4. Error & Fallback Handling:
   - Implement graceful error boundaries with toast notifications if the API key is missing or invalid.
   - If an extraction fails, provide actionable diagnostics and fall back to the last cached local spread.`
  },
  {
    id: '2.3',
    tier: 'Tier 2: Live Ingestion & AI Pipeline',
    title: 'Prompt 2.3: Document Upload, Layout Extraction & Streaming Review Status',
    role: 'Full-Stack Engineer',
    stack: 'React Dropzone, Server Actions, Optimistic UI',
    content: `Role: Full-Stack Engineer
Stack: React Dropzone, Server Actions, Optimistic UI

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
   - If the sum of extracted expenses does not equal the extracted Total Operating Expenses within a $1.00 rounding tolerance, open an "Underwriter Discrepancy Resolution" dialog.
   - Show the detected difference, highlight the two conflicting rows in yellow, and prompt the underwriter to choose between "Accept Document Total" or "Recalculate from Line Items".`
  },
  {
    id: '3.1',
    tier: 'Tier 3: Enterprise Polish & Analytics',
    title: 'Prompt 3.1: Persistent Database Layer & Deal Pipeline Management',
    role: 'Database Architect & Enterprise Backend Engineer',
    stack: 'PostgreSQL, Prisma or Drizzle ORM, Supabase',
    content: `Role: Database Architect & Enterprise Backend Engineer
Stack: PostgreSQL, Prisma or Drizzle ORM, Supabase

Context:
Commercial credit departments manage dozens of active loan applications across various approval stages. Spreads, manual adjustments, audit logs, and covenant metrics must be securely persisted to a relational database.

Task:
Design and implement the persistent data architecture:
1. Database Schema:
   - deals: id, borrower_name, facility_amount, industry_sic, credit_officer_id, status (intake, spread_in_progress, pending_review, approved, rejected), created_at.
   - financial_spreads: id, deal_id, statement_type (audit, tax_return, internal_interim), fiscal_year, is_finalized.
   - spread_line_items: id, spread_id, standardized_category, raw_label, amount, confidence_score, bounding_box_json, is_user_edited, edit_reason, audit_user_id.
   - covenant_evaluations: id, deal_id, dscr_result, ebitda_result, interest_rate_spread, passes_covenant, timestamp.
2. Deal Selector & Multi-Tenancy:
   - Build a top-bar drawer or sidebar allowing analysts to switch between active borrower files.
   - Auto-save: Every inline edit in the spreading grid debounces and automatically writes to the database, updating an indicator in the toolbar: "All changes saved to audit log".
3. Audit History Modal:
   - Add an "Audit Trail" button showing who edited which line item, the original extracted AI value vs. human-adjusted value, and the timestamp.`
  },
  {
    id: '3.2',
    tier: 'Tier 3: Enterprise Polish & Analytics',
    title: 'Prompt 3.2: Middleware Route Protection, RBAC & SOC2-Compliant Masking',
    role: 'Security Engineer & Compliance Specialist',
    stack: 'Next.js Middleware, Auth Guards, PII Sanitizer',
    content: `Role: Security Engineer & Compliance Specialist
Stack: Next.js Middleware, Auth Guards, PII Sanitizer

Context:
Financial spreading engines process non-public, highly sensitive business and personal financial data (EINs, SSNs on personal guarantees, corporate banking accounts). Institutional governance requires strict role-based access control (RBAC).

Task:
Implement security guards and financial privacy controls:
1. Middleware Guards:
   - Protect all /spread/* and /api/* endpoints.
   - Implement three distinct roles:
     - CreditAnalyst: Can view, upload, edit numbers, and submit spreads for review.
     - CreditOfficer (Approver): Can view, override spreads, and sign off on covenants.
     - Auditor: Read-only access to finalized spreads and audit logs.
2. PII / Tax ID Masking Utility:
   - Build a client-side and server-side sanitizer that automatically scans for Employer Identification Numbers (EINs: XX-XXXXXXX) and Social Security Numbers (XXX-XX-XXXX) in uploaded files.
   - Mask them in the UI preview (**-***1234) with a toggle available only to authenticated Credit Officers: "Reveal Sensitive Identifiers (Logged)".`
  },
  {
    id: '3.3',
    tier: 'Tier 3: Enterprise Polish & Analytics',
    title: 'Prompt 3.3: Interactive Credit Analytics, 5x5 Stress-Testing Matrix & Terminal Dark Theme',
    role: 'Lead Design Technologist & Data Visualization Engineer',
    stack: 'Recharts, Tailwind CSS, Radix UI',
    content: `Role: Lead Design Technologist & Data Visualization Engineer
Stack: Recharts, Tailwind CSS, Radix UI

Context:
Chief Credit Officers need more than static rows—they require trend visualization across trailing years, margin evolution charts, and sensitivity tables showing how DSCR degrades under changing interest rates and revenue contractions.

Task:
Add an executive visualization tab and terminal-grade visual theme:
1. Analytics & Visualizations Tab (Toggle between "Spreading Grid" and "Risk Analytics"):
   - Chart 1 (Multi-Bar + Line Chart): 3-Year Historical Revenue vs. Gross Margin % vs. Adjusted EBITDA.
   - Chart 2 (Sensitivity Heatmap / Matrix): A 5x5 matrix showing DSCR sensitivity where the Y-axis is Revenue Change (-10%, -5%, 0%, +5%, +10%) and the X-axis is Prime Rate Hike (+0 bps, +100 bps, +200 bps, +300 bps, +400 bps). Highlight safe zones in green and breach zones in red.
2. Professional Financial Terminal Theme:
   - Implement a unified high-contrast financial theme.
   - Use high-contrast terminal styling: crisp emerald greens for positive coverage, amber for risk warnings, and sharp tabular numbers using monospace font variants (font-mono).
3. Institutional Export:
   - Implement an "Export Credit Memo Package" feature that generates an executive summary combining the normalized spread, the sensitivity matrix, and the underwriter's digital sign-off block.`
  }
];

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<number>(1);
  const [copiedPromptId, setCopiedPromptId] = useState<string | null>(null);
  const [expandedPromptId, setExpandedPromptId] = useState<string | null>('1.1');

  if (!isOpen) return null;

  const handleCopyPrompt = (id: string, content: string) => {
    navigator.clipboard.writeText(content);
    setCopiedPromptId(id);
    setTimeout(() => setCopiedPromptId(null), 2500);
  };

  const navTabs = [
    { id: 1, label: '1. Problem & Core Concept', icon: HelpCircle },
    { id: 2, label: '2. Required Domain Knowledge', icon: BookOpen },
    { id: 3, label: '3. Data Pipeline & Architecture', icon: Layers },
    { id: 4, label: '4. Stakeholders & Personas', icon: Users },
    { id: 5, label: '5. Commercial Valuations', icon: DollarSign },
    { id: 6, label: '6. College & Resume Strategy', icon: GraduationCap },
    { id: 7, label: '7. AI Vibe-Coding Prompts', icon: Code2 },
    { id: 8, label: '8. Further Enhancements', icon: Sparkles },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/40 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-6xl max-h-[92vh] flex flex-col glass-dock rounded-3xl shadow-[0_30px_90px_rgba(0,0,0,0.25)] border border-white/60 overflow-hidden">
        
        {/* Top Title Bar */}
        <div className="flex items-center justify-between px-8 py-5 border-b border-black/[0.06] bg-white/40 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-[#0D0D0D] text-white flex items-center justify-center shadow-md">
              <BookOpen className="w-4 h-4 text-amber-200" />
            </div>
            <div>
              <h2 className="text-sm font-bold tracking-tightest uppercase text-[#0D0D0D]">
                SpreadSense AI Learning Deck & Systems Architecture
              </h2>
              <p className="text-[11px] text-[#6E6D7A] font-medium">
                Comprehensive Domain Guide, Technical Systems Architecture & AI Prompt Runway
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-black/[0.05] text-[#6E6D7A] hover:text-[#0D0D0D] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: Split Navigation Sidebar & Rich Content Area */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          
          {/* Left Vertical Navigation Sidebar */}
          <div className="w-full md:w-72 bg-white/40 border-r border-black/[0.04] p-4 flex md:flex-col gap-1.5 overflow-x-auto md:overflow-y-auto flex-shrink-0">
            {navTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-left text-xs font-semibold transition-all whitespace-nowrap md:whitespace-normal ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-[0_8px_20px_rgba(79,70,229,0.25)] scale-[1.02]'
                      : 'text-[#3A3945] hover:bg-white/70 hover:text-[#0D0D0D]'
                  }`}
                >
                  <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-white' : 'text-[#6E6D7A]'}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Right Rich Content Pane */}
          <div className="flex-1 p-6 md:p-10 overflow-y-auto bg-white/20">
            
            {/* TAB 1: Problem & Core Concept */}
            {activeTab === 1 && (
              <div className="space-y-6 animate-fadeIn">
                <div className="flex items-center gap-2 text-indigo-600 font-bold text-xs uppercase tracking-wider">
                  <HelpCircle className="w-4 h-4" />
                  <span>Problem Statement & Market Friction</span>
                </div>
                
                <h3 className="text-xl font-bold tracking-tight text-[#0D0D0D]">
                  The Commercial Lending "Stare and Compare" Bottleneck
                </h3>

                <p className="text-xs leading-relaxed text-[#3A3945]">
                  In commercial lending, middle-market underwriting operations suffer from massive friction. When a commercial borrower requests a credit facility (such as a $5M working capital line or an equipment financing term loan), they submit dozens of unstructured documents: CPA-audited financial statements, IRS Form 1120/1120-S corporate tax returns, and interim trailing-twelve-month (TTM) income statements in flat PDF formats.
                </p>

                {/* Problem Flow Diagram */}
                <div className="rounded-2xl bg-white/60 p-5 border border-black/[0.04]">
                  <span className="text-[10px] font-bold text-[#6E6D7A] uppercase tracking-wider block mb-3">
                    The Underwriting Friction Flow:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
                    <div className="p-3.5 rounded-xl bg-rose-50/80 border border-rose-200/60 text-xs font-semibold text-rose-900">
                      Unstructured Financial PDFs
                      <span className="block text-[10px] font-normal text-rose-700 mt-1">Fragmented charts of accounts</span>
                    </div>
                    <div className="p-3.5 rounded-xl bg-amber-50/80 border border-amber-200/60 text-xs font-semibold text-amber-900">
                      Manual Excel Re-Keying
                      <span className="block text-[10px] font-normal text-amber-700 mt-1">3–6 hours per deal; fat-finger errors</span>
                    </div>
                    <div className="p-3.5 rounded-xl bg-indigo-50/80 border border-indigo-200/60 text-xs font-semibold text-indigo-950">
                      Delayed Loan Origination
                      <span className="block text-[10px] font-normal text-indigo-700 mt-1">5–10 day committee delays</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                  <div className="bg-white/60 p-4 rounded-2xl border border-black/[0.04]">
                    <strong className="text-xs font-bold text-[#0D0D0D] block mb-1">High Turnaround Friction</strong>
                    <p className="text-[11px] text-[#6E6D7A] leading-normal">
                      Manual transcription takes 3 to 6 hours per deal, creating a loan origination delay of 5 to 10 business days for commercial borrowers.
                    </p>
                  </div>
                  <div className="bg-white/60 p-4 rounded-2xl border border-black/[0.04]">
                    <strong className="text-xs font-bold text-[#0D0D0D] block mb-1">Operational & Credit Risk</strong>
                    <p className="text-[11px] text-[#6E6D7A] leading-normal">
                      A single transposed digit or omitted interest line item distorts calculated EBITDA, resulting in incorrect credit decisions or OCC/FDIC audit fines.
                    </p>
                  </div>
                  <div className="bg-white/60 p-4 rounded-2xl border border-black/[0.04]">
                    <strong className="text-xs font-bold text-[#0D0D0D] block mb-1">Wasted Talent Capacity</strong>
                    <p className="text-[11px] text-[#6E6D7A] leading-normal">
                      Senior credit analysts earning $100k+ spend 40% of their billable hours on mechanical data entry rather than qualitative risk assessment and structuring.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-200/60 text-xs text-indigo-950">
                  <strong className="font-bold block mb-0.5">The Solution: SpreadSense AI</strong>
                  An intelligent Human-in-the-Loop engine that combines layout-aware document OCR, LLM-powered GAAP semantic classification, double-entry mathematical balancing, bidirectional cell-to-source provenance, and dynamic covenant stress-testing.
                </div>
              </div>
            )}

            {/* TAB 2: Required Domain Knowledge */}
            {activeTab === 2 && (
              <div className="space-y-6 animate-fadeIn">
                <div className="flex items-center gap-2 text-indigo-600 font-bold text-xs uppercase tracking-wider">
                  <BookOpen className="w-4 h-4" />
                  <span>Essential Accounting & Underwriting Concepts</span>
                </div>

                <h3 className="text-xl font-bold tracking-tight text-[#0D0D0D]">
                  Domain Knowledge Primer: Commercial Credit Analysis
                </h3>

                <p className="text-xs text-[#3A3945] leading-relaxed">
                  Building software for commercial banks requires understanding how lenders evaluate business risk. Unlike venture capitalists who seek unlimited upside, commercial debt underwriters focus entirely on <strong>cash flow predictability and downside protection</strong>.
                </p>

                {/* Key Terminology Cards */}
                <div className="space-y-3">
                  <div className="bg-white/60 p-4 rounded-2xl border border-black/[0.04]">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#0D0D0D]">1. Chart of Accounts (COA) Babel & Normalization</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-700">Accounting</span>
                    </div>
                    <p className="text-[11px] text-[#6E6D7A] mt-1 leading-normal">
                      Borrowers label their finances inconsistently: <em>"Contract Revenues"</em>, <em>"Gross Turnover"</em>, or <em>"Client Billings"</em> must all be mapped deterministically to the standard GAAP financial bucket: <code>Gross Revenue</code>.
                    </p>
                  </div>

                  <div className="bg-white/60 p-4 rounded-2xl border border-black/[0.04]">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#0D0D0D]">2. The Debt Service Coverage Ratio (DSCR)</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-50 text-indigo-700">Core Covenant</span>
                    </div>
                    <p className="text-[11px] text-[#6E6D7A] mt-1 leading-normal">
                      The universal commercial underwriting formula:
                    </p>
                    <div className="my-2 p-2.5 rounded-xl bg-slate-100 font-mono text-xs text-[#0D0D0D] text-center font-bold">
                      DSCR = Adjusted Underwriting EBITDA / Total Debt Service (Annual Principal + Interest)
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-[10px] font-medium text-center mt-2">
                      <div className="p-1.5 rounded-lg bg-emerald-100 text-emerald-900">≥ 1.30x: Pass (Policy Compliant)</div>
                      <div className="p-1.5 rounded-lg bg-amber-100 text-amber-900">1.15x–1.29x: Borderline (Exceptions)</div>
                      <div className="p-1.5 rounded-lg bg-rose-100 text-rose-900">&lt; 1.15x: Fail (Declined)</div>
                    </div>
                  </div>

                  <div className="bg-white/60 p-4 rounded-2xl border border-black/[0.04]">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#0D0D0D]">3. Discretionary Add-backs & Normalized EBITDA</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-700">Cash Flow</span>
                    </div>
                    <p className="text-[11px] text-[#6E6D7A] mt-1 leading-normal">
                      In small-to-midsize enterprises (SMEs), business owners often pay themselves excessive salaries (above market replacement cost) or run discretionary personal expenses through the business. Credit analysts add these non-operating items back into cash flow to assess real debt capacity.
                    </p>
                  </div>

                  <div className="bg-white/60 p-4 rounded-2xl border border-black/[0.04]">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#0D0D0D]">4. Bidirectional Coordinate Provenance</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-50 text-purple-700">Audit Compliance</span>
                    </div>
                    <p className="text-[11px] text-[#6E6D7A] mt-1 leading-normal">
                      Regulatory bodies (OCC, FDIC, Federal Reserve) require every financial number in a credit memo to be fully auditable. Clicking any cell in the spread must display its exact source coordinates <code>(x, y, w, h, page)</code> on the original borrower document.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: Data Pipeline & Architecture */}
            {activeTab === 3 && (
              <div className="space-y-6 animate-fadeIn">
                <div className="flex items-center gap-2 text-indigo-600 font-bold text-xs uppercase tracking-wider">
                  <Layers className="w-4 h-4" />
                  <span>System Architecture & Pipeline Flow</span>
                </div>

                <h3 className="text-xl font-bold tracking-tight text-[#0D0D0D]">
                  High-Level Data Flow & Mathematical Reconciliation
                </h3>

                <p className="text-xs text-[#3A3945] leading-relaxed">
                  In enterprise finance, you never trust an LLM's arithmetic. SpreadSense AI uses a <strong>hybrid architecture</strong>: LLMs are used for semantic classification against rigid JSON schemas, while all accounting calculations and validations are executed by pure, deterministic TypeScript code.
                </p>

                {/* Pipeline Flow Steps */}
                <div className="space-y-3">
                  <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/60 border border-black/[0.04]">
                    <div className="w-7 h-7 rounded-xl bg-indigo-600 text-white font-mono font-bold text-xs flex items-center justify-center flex-shrink-0">
                      1
                    </div>
                    <div>
                      <strong className="text-xs font-bold text-[#0D0D0D] block">Document Ingestion & SEC EDGAR API</strong>
                      <p className="text-[11px] text-[#6E6D7A] mt-0.5">
                        Accepts multi-page PDFs, CSV trial balances, or direct SEC EDGAR XBRL company facts REST endpoints using fair-access headers.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/60 border border-black/[0.04]">
                    <div className="w-7 h-7 rounded-xl bg-indigo-600 text-white font-mono font-bold text-xs flex items-center justify-center flex-shrink-0">
                      2
                    </div>
                    <div>
                      <strong className="text-xs font-bold text-[#0D0D0D] block">Layout-Aware OCR & Coordinate Geometry</strong>
                      <p className="text-[11px] text-[#6E6D7A] mt-0.5">
                        Extracts tabular cell structures while retaining bounding box coordinates <code>(x, y, w, h, page)</code> for full downstream provenance.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/60 border border-black/[0.04]">
                    <div className="w-7 h-7 rounded-xl bg-indigo-600 text-white font-mono font-bold text-xs flex items-center justify-center flex-shrink-0">
                      3
                    </div>
                    <div>
                      <strong className="text-xs font-bold text-[#0D0D0D] block">LLM Structured Classification & Confidence Scoring</strong>
                      <p className="text-[11px] text-[#6E6D7A] mt-0.5">
                        Maps non-standard line items into GAAP enums, generating confidence scores (0.00 to 1.00) and rationale for discretionary addbacks.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/60 border border-black/[0.04]">
                    <div className="w-7 h-7 rounded-xl bg-indigo-600 text-white font-mono font-bold text-xs flex items-center justify-center flex-shrink-0">
                      4
                    </div>
                    <div>
                      <strong className="text-xs font-bold text-[#0D0D0D] block">Deterministic Double-Entry Balancing Engine</strong>
                      <p className="text-[11px] text-[#6E6D7A] mt-0.5">
                        Validates horizontal checks (Revenue - COGS = Gross Profit) and vertical sums (Sum of OpEx = Total OpEx), flagging discrepancies for review.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/60 border border-black/[0.04]">
                    <div className="w-7 h-7 rounded-xl bg-indigo-600 text-white font-mono font-bold text-xs flex items-center justify-center flex-shrink-0">
                      5
                    </div>
                    <div>
                      <strong className="text-xs font-bold text-[#0D0D0D] block">Human-in-the-Loop (HITL) Split-Screen & Covenant Evaluation</strong>
                      <p className="text-[11px] text-[#6E6D7A] mt-0.5">
                        Interactive side-by-side workspace with inline cell edits, real-time rate shock sensitivity slider, and institutional memo export.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: Stakeholders & Personas */}
            {activeTab === 4 && (
              <div className="space-y-6 animate-fadeIn">
                <div className="flex items-center gap-2 text-indigo-600 font-bold text-xs uppercase tracking-wider">
                  <Users className="w-4 h-4" />
                  <span>Target Users & Institutional Workflows</span>
                </div>

                <h3 className="text-xl font-bold tracking-tight text-[#0D0D0D]">
                  Who Uses SpreadSense AI and How
                </h3>

                <p className="text-xs text-[#3A3945] leading-relaxed">
                  Enterprise financial spreading tools are utilized across multiple banking hierarchy tiers, each with distinct governance responsibilities and user journeys:
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  <div className="bg-white/60 p-5 rounded-2xl border border-black/[0.04]">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600">
                        <FileSpreadsheet className="w-4 h-4" />
                      </div>
                      <div>
                        <strong className="text-xs font-bold text-[#0D0D0D]">Commercial Credit Analyst</strong>
                        <span className="text-[10px] text-[#6E6D7A] block">Primary Day-to-Day User</span>
                      </div>
                    </div>
                    <ul className="text-[11px] text-[#6E6D7A] space-y-1.5 list-disc pl-4 mt-2">
                      <li>Uploads raw borrower PDF financial statements and tax filings.</li>
                      <li>Reviews low-confidence flags (&lt;85%) and resolves accounting discrepancies.</li>
                      <li>Applies verified owner salary addbacks and discretionary adjustments.</li>
                      <li>Runs interest rate stress scenarios and compiles the draft credit spread.</li>
                    </ul>
                  </div>

                  <div className="bg-white/60 p-5 rounded-2xl border border-black/[0.04]">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
                        <ShieldCheck className="w-4 h-4" />
                      </div>
                      <div>
                        <strong className="text-xs font-bold text-[#0D0D0D]">Credit Officer / Committee Approver</strong>
                        <span className="text-[10px] text-[#6E6D7A] block">Senior Sign-Off Authority</span>
                      </div>
                    </div>
                    <ul className="text-[11px] text-[#6E6D7A] space-y-1.5 list-disc pl-4 mt-2">
                      <li>Reviews executive covenant metrics (DSCR, EBITDA margin) in seconds.</li>
                      <li>Clicks suspicious numbers to instantly inspect original document provenance.</li>
                      <li>Evaluates 5x5 rate-hike sensitivity matrix before approving term sheets.</li>
                      <li>Executes digital credit approval sign-off.</li>
                    </ul>
                  </div>

                  <div className="bg-white/60 p-5 rounded-2xl border border-black/[0.04]">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="p-1.5 rounded-lg bg-purple-50 text-purple-600">
                        <Building className="w-4 h-4" />
                      </div>
                      <div>
                        <strong className="text-xs font-bold text-[#0D0D0D]">Bank Risk & Regulatory Auditor</strong>
                        <span className="text-[10px] text-[#6E6D7A] block">Compliance & Examination</span>
                      </div>
                    </div>
                    <ul className="text-[11px] text-[#6E6D7A] space-y-1.5 list-disc pl-4 mt-2">
                      <li>Examines immutable audit trails to see who edited what numbers and why.</li>
                      <li>Verifies adherence to FDIC and OCC commercial lending guidance rules.</li>
                      <li>Exports standardized credit underwriting memos for regulatory filings.</li>
                    </ul>
                  </div>

                  <div className="bg-white/60 p-5 rounded-2xl border border-black/[0.04]">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="p-1.5 rounded-lg bg-amber-50 text-amber-600">
                        <TrendingUp className="w-4 h-4" />
                      </div>
                      <div>
                        <strong className="text-xs font-bold text-[#0D0D0D]">Chief Risk Officer (CRO)</strong>
                        <span className="text-[10px] text-[#6E6D7A] block">Executive Portfolio Oversight</span>
                      </div>
                    </div>
                    <ul className="text-[11px] text-[#6E6D7A] space-y-1.5 list-disc pl-4 mt-2">
                      <li>Tracks portfolio-level sensitivity to central bank prime rate hikes.</li>
                      <li>Monitors percentage of approved loans requiring policy covenant exceptions.</li>
                      <li>Accelerates deal origination velocity across regional commercial banking teams.</li>
                    </ul>
                  </div>

                </div>
              </div>
            )}

            {/* TAB 5: Commercial Valuations */}
            {activeTab === 5 && (
              <div className="space-y-6 animate-fadeIn">
                <div className="flex items-center gap-2 text-indigo-600 font-bold text-xs uppercase tracking-wider">
                  <DollarSign className="w-4 h-4" />
                  <span>Enterprise Software Economics & Consulting Valuation</span>
                </div>

                <h3 className="text-xl font-bold tracking-tight text-[#0D0D0D]">
                  How Much Would an External Consultancy Charge for This?
                </h3>

                <p className="text-xs text-[#3A3945] leading-relaxed">
                  If an enterprise bank engaged a top-tier digital transformation consultancy (e.g., McKinsey Digital, Accenture, Slalom, Thoughtworks) to design, engineer, and deploy an automated financial spreading platform with custom LLM extraction and provenance, the budget breakdown would be:
                </p>

                {/* Cost Breakdown Table */}
                <div className="rounded-2xl bg-white/70 p-5 border border-black/[0.04]">
                  <table className="w-full text-xs text-left border-collapse">
                    <thead>
                      <tr className="border-b border-black/[0.08] text-[11px] font-bold text-[#6E6D7A]">
                        <th className="py-2">Project Phase & Deliverable</th>
                        <th className="py-2">Timeline</th>
                        <th className="py-2 text-right">Consulting Fee Range</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-black/[0.03] text-[11px]">
                      <tr>
                        <td className="py-2.5 font-medium text-[#0D0D0D]">
                          1. Discovery, Banking Accounting Taxonomy & JSON Schema Design
                        </td>
                        <td className="py-2.5 text-[#6E6D7A]">3–4 weeks</td>
                        <td className="py-2.5 text-right font-mono font-semibold">$60,000 – $90,000</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 font-medium text-[#0D0D0D]">
                          2. OCR, Bounding Box Coordinate Geometry & LLM Mapping Pipeline
                        </td>
                        <td className="py-2.5 text-[#6E6D7A]">6–8 weeks</td>
                        <td className="py-2.5 text-right font-mono font-semibold">$140,000 – $190,000</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 font-medium text-[#0D0D0D]">
                          3. HITL Split-Screen Workspace, Inline Grid & Provenance Viewer
                        </td>
                        <td className="py-2.5 text-[#6E6D7A]">4–6 weeks</td>
                        <td className="py-2.5 text-right font-mono font-semibold">$90,000 – $130,000</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 font-medium text-[#0D0D0D]">
                          4. Deterministic DSCR Engine, 5x5 Stress Matrix & SEC REST Integration
                        </td>
                        <td className="py-2.5 text-[#6E6D7A]">3–4 weeks</td>
                        <td className="py-2.5 text-right font-mono font-semibold">$60,000 – $80,000</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 font-medium text-[#0D0D0D]">
                          5. Institutional Security, SOC-2 Masking & PDF Memo Export
                        </td>
                        <td className="py-2.5 text-[#6E6D7A]">4–5 weeks</td>
                        <td className="py-2.5 text-right font-mono font-semibold">$75,000 – $110,000</td>
                      </tr>
                      <tr className="bg-indigo-50/70 font-bold text-[#0D0D0D]">
                        <td className="py-3 font-sans text-xs">Total Enterprise Build & Deployment Cost</td>
                        <td className="py-3 text-xs">5–7 months</td>
                        <td className="py-3 text-right font-mono text-sm text-indigo-950 font-extrabold">
                          $425,000 – $600,000+
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/60 text-xs text-amber-950">
                  <strong className="font-bold block mb-0.5">Enterprise ROI Justification:</strong>
                  A mid-market bank spreading 2,000 loan applications per year saves over 6,000 analyst hours ($300k+ in annual labor) and reduces deal origination cycle time by 4 days, paying back the system investment within 18 months.
                </div>
              </div>
            )}

            {/* TAB 6: College & Resume Strategy */}
            {activeTab === 6 && (
              <div className="space-y-6 animate-fadeIn">
                <div className="flex items-center gap-2 text-indigo-600 font-bold text-xs uppercase tracking-wider">
                  <GraduationCap className="w-4 h-4" />
                  <span>Interview Differentiation & Resume Strategy</span>
                </div>

                <h3 className="text-xl font-bold tracking-tight text-[#0D0D0D]">
                  How This Project Elevates Your College Applications & Tech Career
                </h3>

                <p className="text-xs text-[#3A3945] leading-relaxed">
                  In an era where anyone can build a generic Todo app or weather widget with AI, recruiters and admissions officers look for <strong>domain-dense, high-fidelity vertical solutions</strong> that reflect actual enterprise complexity.
                </p>

                <div className="space-y-3">
                  <div className="bg-white/60 p-4 rounded-2xl border border-black/[0.04]">
                    <span className="text-xs font-bold text-[#0D0D0D] block mb-1">1. Demonstrates "Vibe Coding" with Deep Vertical Rigor</span>
                    <p className="text-[11px] text-[#6E6D7A] leading-normal">
                      Shows that you don't just write generic prompts—you understand specialized commercial accounting, credit covenant mathematics (DSCR), and banking regulatory requirements.
                    </p>
                  </div>

                  <div className="bg-white/60 p-4 rounded-2xl border border-black/[0.04]">
                    <span className="text-xs font-bold text-[#0D0D0D] block mb-1">2. Showcases Hybrid AI Architecture (Deterministic + LLM)</span>
                    <p className="text-[11px] text-[#6E6D7A] leading-normal">
                      Highlights maturity: you recognize that LLMs hallucinate on math, so you built a deterministic TypeScript calculation and double-entry balancing engine on top of structured LLM classifications.
                    </p>
                  </div>

                  <div className="bg-white/60 p-4 rounded-2xl border border-black/[0.04]">
                    <span className="text-xs font-bold text-[#0D0D0D] block mb-1">3. Ready-to-Use Resume Bullet Points</span>
                    <div className="mt-2 space-y-2 font-mono text-[11px] bg-slate-50 p-3 rounded-xl text-[#0D0D0D] border border-black/[0.04]">
                      <p className="flex items-start gap-1.5">
                        <ArrowRight className="w-3.5 h-3.5 text-indigo-600 flex-shrink-0 mt-0.5" />
                        <span>Architected an automated financial spreading platform using React, TypeScript, and Vite, parsing multi-period commercial statements into GAAP-standard schemas with bidirectional bounding-box provenance.</span>
                      </p>
                      <p className="flex items-start gap-1.5">
                        <ArrowRight className="w-3.5 h-3.5 text-indigo-600 flex-shrink-0 mt-0.5" />
                        <span>Engineered real-time underwriting math engine computing Adjusted EBITDA, Total Debt Service, and dynamic DSCR covenants under +400 bps interest rate stress simulations.</span>
                      </p>
                      <p className="flex items-start gap-1.5">
                        <ArrowRight className="w-3.5 h-3.5 text-indigo-600 flex-shrink-0 mt-0.5" />
                        <span>Integrated SEC EDGAR public REST APIs to dynamically ingest and normalize Form 10-K XBRL financial facts for corporate peer benchmarking.</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 7: AI Vibe-Coding Prompts */}
            {activeTab === 7 && (
              <div className="space-y-6 animate-fadeIn">
                <div className="flex items-center gap-2 text-indigo-600 font-bold text-xs uppercase tracking-wider">
                  <Code2 className="w-4 h-4" />
                  <span>Sequential AI Prompt Runway</span>
                </div>

                <h3 className="text-xl font-bold tracking-tight text-[#0D0D0D]">
                  The Complete Prompt Sequence Used to Build SpreadSense AI
                </h3>

                <p className="text-xs text-[#3A3945] leading-relaxed">
                  Click on any prompt block below to review the exact instructions, roles, schemas, and architectural sequences used to generate this entire platform. Use the copy icon to reuse them in your own AI builder.
                </p>

                {/* Prompts Accordion */}
                <div className="space-y-3">
                  {PROMPT_RUNWAY.map((item) => {
                    const isExpanded = expandedPromptId === item.id;
                    const isCopied = copiedPromptId === item.id;

                    return (
                      <div
                        key={item.id}
                        className="rounded-2xl bg-white/70 border border-black/[0.05] overflow-hidden shadow-sm transition-all"
                      >
                        {/* Prompt Header */}
                        <div
                          onClick={() => setExpandedPromptId(isExpanded ? null : item.id)}
                          className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-50/80 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <span className="w-7 h-7 rounded-xl bg-indigo-50 text-indigo-700 text-xs font-mono font-bold flex items-center justify-center flex-shrink-0">
                              {item.id}
                            </span>
                            <div>
                              <strong className="text-xs font-bold text-[#0D0D0D] block">{item.title}</strong>
                              <span className="text-[10px] text-[#6E6D7A] block font-mono">{item.tier} • {item.role}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCopyPrompt(item.id, item.content);
                              }}
                              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                                isCopied 
                                  ? 'bg-emerald-100 text-emerald-800' 
                                  : 'bg-white hover:bg-slate-100 text-[#3A3945] border border-black/[0.04]'
                              }`}
                              title="Copy prompt text to clipboard"
                            >
                              {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                              <span className="text-[10px]">{isCopied ? 'Copied!' : 'Copy'}</span>
                            </button>

                            {isExpanded ? (
                              <ChevronUp className="w-4 h-4 text-[#6E6D7A]" />
                            ) : (
                              <ChevronDown className="w-4 h-4 text-[#6E6D7A]" />
                            )}
                          </div>
                        </div>

                        {/* Expanded Code Content */}
                        {isExpanded && (
                          <div className="p-4 bg-[#0D0D0D] text-slate-100 font-mono text-[11px] leading-relaxed overflow-x-auto border-t border-black/[0.06] select-text">
                            <pre className="whitespace-pre-wrap">{item.content}</pre>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB 8: Further Enhancements */}
            {activeTab === 8 && (
              <div className="space-y-6 animate-fadeIn">
                <div className="flex items-center gap-2 text-indigo-600 font-bold text-xs uppercase tracking-wider">
                  <Sparkles className="w-4 h-4" />
                  <span>Future Roadmap & Enterprise Enhancements</span>
                </div>

                <h3 className="text-xl font-bold tracking-tight text-[#0D0D0D]">
                  Next-Generation Enhancements for SpreadSense AI
                </h3>

                <p className="text-xs text-[#3A3945] leading-relaxed">
                  To evolve this platform from an underwriting prototype into a Tier-1 institutional lending powerhouse, the following advanced capabilities can be integrated:
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  <div className="bg-white/60 p-5 rounded-2xl border border-black/[0.04]">
                    <strong className="text-xs font-bold text-[#0D0D0D] block mb-1">1. Multi-Period Balance Sheet & Working Capital Ratios</strong>
                    <p className="text-[11px] text-[#6E6D7A] leading-normal">
                      Spread asset and liability schedules to compute Days Sales Outstanding (DSO), Days Inventory Outstanding (DIO), and the cash conversion cycle.
                    </p>
                  </div>

                  <div className="bg-white/60 p-5 rounded-2xl border border-black/[0.04]">
                    <strong className="text-xs font-bold text-[#0D0D0D] block mb-1">2. Global Cash Flow (GCF) Spreading for Multi-Entity Borrowers</strong>
                    <p className="text-[11px] text-[#6E6D7A] leading-normal">
                      Consolidate multiple related operating entities and individual personal guarantors (IRS 1040 Schedule C/E) into a unified debt service model.
                    </p>
                  </div>

                  <div className="bg-white/60 p-5 rounded-2xl border border-black/[0.04]">
                    <strong className="text-xs font-bold text-[#0D0D0D] block mb-1">3. Direct Accounting ERP Integration Connectors</strong>
                    <p className="text-[11px] text-[#6E6D7A] leading-normal">
                      Direct REST synchronization with QuickBooks Online, Xero, and Oracle NetSuite APIs for continuous monthly covenant monitoring without manual PDF uploads.
                    </p>
                  </div>

                  <div className="bg-white/60 p-5 rounded-2xl border border-black/[0.04]">
                    <strong className="text-xs font-bold text-[#0D0D0D] block mb-1">4. Automated OCC/FDIC Compliance Pack Generator</strong>
                    <p className="text-[11px] text-[#6E6D7A] leading-normal">
                      One-click export of complete regulatory loan audit dossiers including full OCR provenance maps, underwriter sign-off logs, and covenant exception waivers.
                    </p>
                  </div>

                </div>
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
};
