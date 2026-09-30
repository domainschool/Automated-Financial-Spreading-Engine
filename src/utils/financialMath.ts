import { SpreadingLineItem, SpreadingValues, UnderwritingMetrics } from '../types/spreading';

/**
 * Formats a number into clean currency format (e.g. $14,100,000 or $14.1M)
 */
export function formatCurrency(value: number, compact: boolean = false): string {
  if (compact) {
    if (Math.abs(value) >= 1_000_000) {
      return `$${(value / 1_000_000).toFixed(2)}M`;
    }
    if (Math.abs(value) >= 1_000) {
      return `$${(value / 1_000).toFixed(0)}k`;
    }
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value);
}

/**
 * Formats ratio into standard banking coverage format (e.g. 1.42x)
 */
export function formatRatio(value: number): string {
  if (isNaN(value) || !isFinite(value) || value <= 0) return '0.00x';
  return `${value.toFixed(2)}x`;
}

/**
 * Formats percentages
 */
export function formatPercent(value: number): string {
  return `${value.toFixed(1)}%`;
}

/**
 * Pure deterministic calculation engine for financial spreading and underwriting covenants.
 */
export function calculateUnderwritingMetrics(
  lineItems: SpreadingLineItem[],
  annualPrincipalService: number,
  interestRateHikePct: number = 0
): UnderwritingMetrics {
  const periods: (keyof SpreadingValues)[] = ['fy2023', 'fy2024', 'fy2025'];

  const grossRevenue: SpreadingValues = { fy2023: 0, fy2024: 0, fy2025: 0 };
  const totalCogs: SpreadingValues = { fy2023: 0, fy2024: 0, fy2025: 0 };
  const grossProfit: SpreadingValues = { fy2023: 0, fy2024: 0, fy2025: 0 };
  const grossMarginPct: SpreadingValues = { fy2023: 0, fy2024: 0, fy2025: 0 };
  const totalOpex: SpreadingValues = { fy2023: 0, fy2024: 0, fy2025: 0 };
  const operatingIncomeEbit: SpreadingValues = { fy2023: 0, fy2024: 0, fy2025: 0 };
  const depreciationAmortization: SpreadingValues = { fy2023: 0, fy2024: 0, fy2025: 0 };
  const totalAddbacks: SpreadingValues = { fy2023: 0, fy2024: 0, fy2025: 0 };
  const adjustedEbitda: SpreadingValues = { fy2023: 0, fy2024: 0, fy2025: 0 };
  const ebitdaMarginPct: SpreadingValues = { fy2023: 0, fy2024: 0, fy2025: 0 };
  const baseInterestExpense: SpreadingValues = { fy2023: 0, fy2024: 0, fy2025: 0 };
  const stressedInterestExpense: SpreadingValues = { fy2023: 0, fy2024: 0, fy2025: 0 };
  const totalDebtService: SpreadingValues = { fy2023: 0, fy2024: 0, fy2025: 0 };
  const dscr: SpreadingValues = { fy2023: 0, fy2024: 0, fy2025: 0 };

  periods.forEach((period) => {
    // 1. REVENUE
    const revItems = lineItems.filter((i) => i.section === 'revenue');
    let revSum = 0;
    revItems.forEach((item) => {
      // Returns or allowances are negative adjustments
      if (item.standardizedCategory.toLowerCase().includes('return') || item.standardizedCategory.toLowerCase().includes('allowance')) {
        revSum -= Math.abs(item.values[period]);
      } else {
        revSum += item.values[period];
      }
    });
    grossRevenue[period] = revSum;

    // 2. COGS
    const cogsItems = lineItems.filter((i) => i.section === 'cogs');
    const cogsSum = cogsItems.reduce((acc, curr) => acc + curr.values[period], 0);
    totalCogs[period] = cogsSum;

    // 3. Gross Profit
    const gp = revSum - cogsSum;
    grossProfit[period] = gp;
    grossMarginPct[period] = revSum > 0 ? (gp / revSum) * 100 : 0;

    // 4. OpEx
    const opexItems = lineItems.filter((i) => i.section === 'opex');
    const opexSum = opexItems.reduce((acc, curr) => acc + curr.values[period], 0);
    totalOpex[period] = opexSum;

    // 5. EBIT (Operating Income)
    const ebit = gp - opexSum;
    operatingIncomeEbit[period] = ebit;

    // 6. Depreciation & Amortization
    const daItems = lineItems.filter(
      (i) =>
        i.standardizedCategory.toLowerCase().includes('depreciation') ||
        i.standardizedCategory.toLowerCase().includes('amortization') ||
        i.originalLabel.toLowerCase().includes('d&a')
    );
    const daSum = daItems.reduce((acc, curr) => acc + curr.values[period], 0);
    depreciationAmortization[period] = daSum;

    // 7. Add-backs & Owner Discretionary adjustments
    let addbackSum = 0;
    lineItems.forEach((item) => {
      if (item.section === 'addbacks' && item.isAddbackActive !== false) {
        addbackSum += item.values[period];
      }
      // Check for Officer Compensation discretionary excess over $400k benchmark
      if (item.standardizedCategory.toLowerCase().includes('officer comp') && item.isAddbackActive) {
        const excess = Math.max(0, item.values[period] - 400_000);
        addbackSum += excess;
      }
    });
    totalAddbacks[period] = addbackSum;

    // 8. Adjusted EBITDA
    const ebitda = ebit + daSum + addbackSum;
    adjustedEbitda[period] = ebitda;
    ebitdaMarginPct[period] = revSum > 0 ? (ebitda / revSum) * 100 : 0;

    // 9. Interest Expense & Stress Testing
    const interestItems = lineItems.filter(
      (i) =>
        i.standardizedCategory.toLowerCase().includes('interest') ||
        i.originalLabel.toLowerCase().includes('interest')
    );
    const baseInterest = interestItems.reduce((acc, curr) => acc + curr.values[period], 0);
    baseInterestExpense[period] = baseInterest;

    // Stress test formula: interest increases proportionally to rate hike
    // Assuming base debt facility around (baseInterest / 0.075), rate hike adds (estimatedDebt * rateHike)
    const estimatedDebt = baseInterest > 0 ? baseInterest / 0.075 : 2_500_000;
    const additionalInterestFromHike = estimatedDebt * (interestRateHikePct / 100);
    const stressedInterest = baseInterest + additionalInterestFromHike;
    stressedInterestExpense[period] = stressedInterest;

    // 10. Total Debt Service = Annual Senior Principal + Stressed Interest
    const debtService = annualPrincipalService + stressedInterest;
    totalDebtService[period] = debtService;

    // 11. DSCR = Adjusted EBITDA / Total Debt Service
    dscr[period] = debtService > 0 ? ebitda / debtService : 0;
  });

  // Target Year for decision verdict is FY2024 or FY2025 Projected
  const targetDscr = dscr.fy2025 > 0 ? dscr.fy2025 : dscr.fy2024;

  let covenantVerdict: 'PASS' | 'BORDERLINE' | 'FAIL' = 'PASS';
  let verdictLabel = 'Pass - Meets Target Covenant';

  if (targetDscr >= 1.30) {
    covenantVerdict = 'PASS';
    verdictLabel = 'Pass - Meets Target Covenant (≥ 1.30x)';
  } else if (targetDscr >= 1.15) {
    covenantVerdict = 'BORDERLINE';
    verdictLabel = 'Borderline - Senior Approval / Mitigants Required (1.15x - 1.29x)';
  } else {
    covenantVerdict = 'FAIL';
    verdictLabel = 'Fail - Below Mandatory Minimum Covenant (< 1.15x)';
  }

  return {
    grossRevenue,
    totalCogs,
    grossProfit,
    grossMarginPct,
    totalOpex,
    operatingIncomeEbit,
    depreciationAmortization,
    totalAddbacks,
    adjustedEbitda,
    ebitdaMarginPct,
    baseInterestExpense,
    stressedInterestExpense,
    totalDebtService,
    dscr,
    covenantVerdict,
    verdictLabel,
  };
}

/**
 * Computes a 5x5 sensitivity matrix: Revenue Contraction vs Rate Hike
 */
export function generateSensitivityMatrix(
  annualPrincipal: number,
  baseRevenue: number,
  baseCogs: number,
  baseOpex: number,
  baseDa: number,
  baseAddbacks: number,
  baseInterest: number
) {
  const revDeltas = [-0.10, -0.05, 0.0, 0.05, 0.10]; // -10%, -5%, Base, +5%, +10%
  const rateHikes = [0.0, 1.0, 2.0, 3.0, 4.0]; // +0 bps, +100 bps, +200 bps, +300 bps, +400 bps

  const matrix = revDeltas.map((revDelta) => {
    const stressedRev = baseRevenue * (1 + revDelta);
    // Variable cost adjustment (COGS moves roughly 70% with revenue, fixed opex stays steady)
    const stressedCogs = baseCogs * (1 + revDelta * 0.75);
    const stressedEbit = stressedRev - stressedCogs - baseOpex;
    const stressedEbitda = stressedEbit + baseDa + baseAddbacks;

    const row = rateHikes.map((hike) => {
      const estimatedDebt = baseInterest > 0 ? baseInterest / 0.075 : 2_500_000;
      const stressedInterest = baseInterest + estimatedDebt * (hike / 100);
      const totalDebtService = annualPrincipal + stressedInterest;
      const dscr = totalDebtService > 0 ? stressedEbitda / totalDebtService : 0;
      return {
        revenueDeltaPct: revDelta * 100,
        rateHikeBps: hike * 100,
        dscr: Number(dscr.toFixed(2)),
        status: dscr >= 1.30 ? 'PASS' : dscr >= 1.15 ? 'BORDERLINE' : 'FAIL',
      };
    });
    return row;
  });

  return { matrix, revDeltas, rateHikes };
}
