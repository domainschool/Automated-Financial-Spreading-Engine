export type GAAPSection = 'revenue' | 'cogs' | 'opex' | 'addbacks' | 'debt';

export interface BoundingBox {
  top: number;    // Percentage from top (0-100)
  left: number;   // Percentage from left (0-100)
  width: number;  // Percentage width (0-100)
  height: number; // Percentage height (0-100)
}

export interface SpreadingValues {
  fy2023: number;
  fy2024: number;
  fy2025: number;
}

export interface SpreadingLineItem {
  id: string;
  section: GAAPSection;
  standardizedCategory: string;
  originalLabel: string;
  confidenceScore: number; // 0.00 to 1.00
  pageNumber: number;
  boundingBox: BoundingBox;
  values: SpreadingValues;
  isUserEdited?: boolean;
  editReason?: string;
  isPotentialAddback?: boolean;
  isAddbackActive?: boolean;
  mappingRationale?: string;
}

export interface Deal {
  id: string;
  borrowerName: string;
  facilityType: string;
  facilityAmount: number;
  sicCode: string;
  industry: string;
  statementSource: string;
  documentPages: string[];
  annualSeniorPrincipal: number;
  creditOfficer: string;
  baseInterestRate: number; // e.g. 7.5%
  status: 'Intake' | 'In-Review' | 'Approved' | 'Declined';
  covenantMinDSCR: number; // e.g. 1.25 or 1.30
  lineItems: SpreadingLineItem[];
}

export interface UnderwritingMetrics {
  grossRevenue: SpreadingValues;
  totalCogs: SpreadingValues;
  grossProfit: SpreadingValues;
  grossMarginPct: SpreadingValues;
  totalOpex: SpreadingValues;
  operatingIncomeEbit: SpreadingValues;
  depreciationAmortization: SpreadingValues;
  totalAddbacks: SpreadingValues;
  adjustedEbitda: SpreadingValues;
  ebitdaMarginPct: SpreadingValues;
  baseInterestExpense: SpreadingValues;
  stressedInterestExpense: SpreadingValues;
  totalDebtService: SpreadingValues;
  dscr: SpreadingValues;
  covenantVerdict: 'PASS' | 'BORDERLINE' | 'FAIL';
  verdictLabel: string;
}
