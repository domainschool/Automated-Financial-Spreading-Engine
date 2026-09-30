import React from 'react';
import { UnderwritingMetrics } from '../../types/spreading';
import { formatCurrency, formatRatio, formatPercent } from '../../utils/financialMath';
import { CheckCircle2, AlertTriangle, XCircle, TrendingUp, DollarSign, Activity, Percent } from 'lucide-react';

interface CovenantRibbonProps {
  metrics: UnderwritingMetrics;
  rateHike: number;
  onRateHikeChange: (val: number) => void;
  annualPrincipal: number;
  targetPeriod: 'fy2023' | 'fy2024' | 'fy2025';
  onTargetPeriodChange: (period: 'fy2023' | 'fy2024' | 'fy2025') => void;
}

export const CovenantRibbon: React.FC<CovenantRibbonProps> = ({
  metrics,
  rateHike,
  onRateHikeChange,
  annualPrincipal,
  targetPeriod,
  onTargetPeriodChange,
}) => {
  const currentDscr = metrics.dscr[targetPeriod];
  const ebitda = metrics.adjustedEbitda[targetPeriod];
  const ebitdaMargin = metrics.ebitdaMarginPct[targetPeriod];
  const debtService = metrics.totalDebtService[targetPeriod];
  const stressedInterest = metrics.stressedInterestExpense[targetPeriod];
  const baseInterest = metrics.baseInterestExpense[targetPeriod];

  // Verdict styling
  const isPass = currentDscr >= 1.30;
  const isBorderline = currentDscr >= 1.15 && currentDscr < 1.30;
  const isFail = currentDscr < 1.15;

  return (
    <div className="w-full glass-panel-elevated rounded-3xl p-6 mb-8 transition-all duration-300">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        
        {/* Metric 1: Adjusted EBITDA */}
        <div className="flex-1 bg-white/60 backdrop-blur-xl rounded-2xl p-5 shadow-[0_10px_30px_rgba(20,20,30,0.03)] border border-black/[0.03]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold tracking-wider text-[#6E6D7A] uppercase flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-indigo-500" />
              Adjusted Underwriting EBITDA
            </span>
            <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700">
              {formatPercent(ebitdaMargin)} Margin
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tightest text-[#0D0D0D] tabular-numbers">
              {formatCurrency(ebitda)}
            </span>
            <span className="text-xs text-[#6E6D7A]">
              ({targetPeriod.toUpperCase()})
            </span>
          </div>
          <p className="text-[11px] text-[#6E6D7A] mt-1">
            Includes D&A + verified owner addbacks
          </p>
        </div>

        {/* Metric 2: Total Debt Service */}
        <div className="flex-1 bg-white/60 backdrop-blur-xl rounded-2xl p-5 shadow-[0_10px_30px_rgba(20,20,30,0.03)] border border-black/[0.03]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold tracking-wider text-[#6E6D7A] uppercase flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5 text-indigo-500" />
              Total Debt Service (Annual)
            </span>
            {rateHike > 0 && (
              <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-amber-50 text-amber-700">
                +{rateHike.toFixed(1)}% Stressed
              </span>
            )}
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tightest text-[#0D0D0D] tabular-numbers">
              {formatCurrency(debtService)}
            </span>
            <span className="text-xs text-[#6E6D7A]">
              (P&I)
            </span>
          </div>
          <p className="text-[11px] text-[#6E6D7A] mt-1">
            Principal: {formatCurrency(annualPrincipal, true)} | Interest: {formatCurrency(stressedInterest, true)}
            {rateHike > 0 && ` (Base: ${formatCurrency(baseInterest, true)})`}
          </p>
        </div>

        {/* Metric 3: Live DSCR & Covenant Verdict */}
        <div className={`flex-1 rounded-2xl p-5 transition-all duration-500 border ${
          isPass 
            ? 'bg-emerald-50/70 border-emerald-200/50 shadow-lucent-emerald' 
            : isBorderline 
            ? 'bg-amber-50/70 border-amber-200/50 shadow-lucent-amber' 
            : 'bg-rose-50/70 border-rose-200/50 shadow-lucent-rose'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold tracking-wider uppercase flex items-center gap-1.5 text-[#0D0D0D]">
              <Activity className="w-3.5 h-3.5" />
              Coverage Ratio (DSCR)
            </span>
            <div className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
              isPass 
                ? 'bg-emerald-600 text-white' 
                : isBorderline 
                ? 'bg-amber-500 text-white' 
                : 'bg-rose-600 text-white'
            }`}>
              {isPass && <CheckCircle2 className="w-3 h-3" />}
              {isBorderline && <AlertTriangle className="w-3 h-3" />}
              {isFail && <XCircle className="w-3 h-3" />}
              <span>{isPass ? 'PASS' : isBorderline ? 'BORDERLINE' : 'FAIL'}</span>
            </div>
          </div>
          
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold tracking-tightest text-[#0D0D0D] tabular-numbers">
              {formatRatio(currentDscr)}
            </span>
            <span className="text-xs font-medium text-[#3A3945]">
              (Target: ≥ 1.30x)
            </span>
          </div>

          <p className="text-[11px] font-medium text-[#3A3945] mt-1">
            {isPass && '✓ Policy compliant — Approved for term credit'}
            {isBorderline && '⚠ Mitigants or Senior Underwriter exception required'}
            {isFail && '✕ Declined — Insufficient cash flow to service facility'}
          </p>
        </div>

        {/* Interactive Debt Stress-Testing Slider */}
        <div className="w-full lg:w-72 bg-white/60 backdrop-blur-xl rounded-2xl p-5 shadow-[0_10px_30px_rgba(20,20,30,0.03)] border border-black/[0.03] flex flex-col justify-between">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold tracking-wider text-[#6E6D7A] uppercase flex items-center gap-1.5">
              <Percent className="w-3.5 h-3.5 text-indigo-500" />
              Rate Shock Slider
            </span>
            <span className="text-xs font-bold font-mono text-[#0D0D0D]">
              +{rateHike.toFixed(1)}% ({Math.round(rateHike * 100)} bps)
            </span>
          </div>
          
          <div className="py-2">
            <input
              type="range"
              min="0"
              max="3.0"
              step="0.25"
              value={rateHike}
              onChange={(e) => onRateHikeChange(parseFloat(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#0D0D0D]"
              aria-label="Simulate interest rate hike"
            />
            <div className="flex justify-between text-[10px] text-[#6E6D7A] mt-1 font-mono">
              <span>+0.0%</span>
              <span>+1.5%</span>
              <span>+3.0%</span>
            </div>
          </div>

          {/* Period Selector Tabs */}
          <div className="flex items-center gap-1 bg-slate-100/80 p-1 rounded-xl mt-2">
            {(['fy2023', 'fy2024', 'fy2025'] as const).map((period) => (
              <button
                key={period}
                onClick={() => onTargetPeriodChange(period)}
                className={`flex-1 text-[10px] font-semibold py-1 rounded-lg transition-all ${
                  targetPeriod === period
                    ? 'bg-white text-[#0D0D0D] shadow-sm'
                    : 'text-[#6E6D7A] hover:text-[#0D0D0D]'
                }`}
              >
                {period === 'fy2025' ? 'FY25 (Proj)' : period.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
