# SpreadSense AI — Automated Financial Spreading & Underwriting Engine

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat&logo=react&logoColor=black)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white)](https://vitejs.dev/)

> **SpreadSense AI** is an intelligent, high-precision automated financial spreading and commercial underwriting platform designed for commercial lenders, middle-market credit analysts, and private credit funds. It replaces the antiquated manual "Stare and Compare" transcription process by mapping unstructured financial statements to standardized GAAP taxonomies with bidirectional cell-to-source provenance, deterministic double-entry accounting reconciliation, and real-time DSCR policy stress-testing.

---

## 🚀 Live Demo & Deployment

- **Live Application:** [https://domainschool.github.io/Automated-Financial-Spreading-Engine/](https://domainschool.github.io/Automated-Financial-Spreading-Engine/)
- **Design System:** "Lucent Minimal" Light Mode (Architectural frosted glass, warm off-white radial canvas, jet-black typography, atmospheric diffuse glows).

---

## ✨ Key Capabilities

1. **Human-in-the-Loop (HITL) Split-Screen Review:**
   - **Left Pane (45%):** Interactive audited source document viewer with OCR confidence metrics and dynamic glowing coordinate bounding-box overlays.
   - **Right Pane (55%):** Standardized multi-period GAAP spreading table (**Revenue**, **COGS**, **Operating Expenses**, **Discretionary Add-backs**, **Adjusted EBITDA**).
2. **Bidirectional Coordinate Provenance:**
   - Clicking any cell in the spreading grid immediately highlights and pins the exact $(x, y, w, h, \text{page})$ source bounding box on the original document.
3. **Inline Spread Editing & Cascading Calculations:**
   - Double-click any number in the table to modify values. Derived rows, EBITDA, Total Debt Service, and DSCR update in real time with visual edit audit badges.
4. **Underwriting Covenant & Rate Shock Engine:**
   - Dynamic **DSCR Policy Decision Badges** ($\ge 1.30\text{x}$ Pass, $1.15\text{x}–1.29\text{x}$ Borderline/Exception, $< 1.15\text{x}$ Fail).
   - Real-time **Interest Rate Shock Slider** (+0.0% to +3.0% / +300 bps hike) with live debt service recalculation.
5. **5x5 DSCR Stress-Test Sensitivity Matrix:**
   - Multi-dimensional matrix evaluating simultaneous revenue contractions (-10% to +10%) against prime rate hikes (+0 to +400 bps).
6. **SEC EDGAR Public Peer Ingestion:**
   - Direct ticker resolution (e.g., `CAT`, `DE`, `PCAR`, `GE`) querying live SEC EDGAR XBRL company facts.
7. **Institutional Credit Memo Package Generator:**
   - Complete printable/exportable underwriting credit memo with digital sign-off and JSON audit trail download.
8. **Interactive Learning Deck & Systems Architecture:**
   - Built-in 8-tab educational guide explaining domain mechanics, accounting taxonomy, consulting valuations ($425k–$600k), resume strategy, and a copyable sequential AI vibe-coding prompt runway.

---

## 🛠️ Technology Stack

- **Frontend:** React 18, TypeScript (Strict Mode), Vite
- **Styling:** Tailwind CSS, PostCSS, Custom Lucent Minimal Tokens
- **Icons & UI:** Lucide React
- **Math & Domain Logic:** Pure TypeScript deterministic underwriting calculation engine
- **Deployment:** GitHub Pages (`gh-pages`)

---

## 📦 Getting Started Locally

### 1. Clone Repository
```bash
git clone https://github.com/domainschool/Automated-Financial-Spreading-Engine.git
cd Automated-Financial-Spreading-Engine
```

### 2. Install Dependencies (pnpm recommended)
```bash
pnpm install
```

### 3. Start Development Server
```bash
pnpm run dev
```
Open [http://localhost:5173/](http://localhost:5173/) in your browser.

### 4. Build for Production
```bash
pnpm run build
```

---

## 🌐 Deploy to GitHub Pages

Deploy the build to GitHub Pages with one command:
```bash
pnpm run deploy
```

---

## 📚 Living Documentation

- [instructions/instructions.md](instructions/instructions.md): Architecture specifications and standards.
- [instructions/explainer.md](instructions/explainer.md): Deep domain mechanics of commercial lending & financial spreading.
- [instructions/prompts.md](instructions/prompts.md): Sequential prompt runway ledger.
- [project_specs.md](project_specs.md): Project specification gate document.

---

## 📄 License
MIT License. Built for Domain School Banking & Financial Series.
