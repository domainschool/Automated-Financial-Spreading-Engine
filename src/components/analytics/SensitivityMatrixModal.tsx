import React from 'react';
import { UnderwritingMetrics, Deal } from '../../types/spreading';
import { generateSensitivityMatrix, formatCurrency } from '../../utils/financialMath';
import { X, Sliders, ShieldAlert } from 'lucide-react';

interface SensitivityMatrixModalProps {
  isOpen: boolean;
  onClose: () => void;
  deal: Deal;
  metrics: UnderwritingMetrics;
}

export const SensitivityMatrixModal: React.FC<SensitivityMatrixModalProps> = ({
  isOpen,
  onClose,
  deal,
  metrics,
}) => {
  if (!isOpen) return null;

  // Use FY2025 Projected (or FY2024) for stress testing
  const targetPeriod = 'fy2025';
  const baseRev = metrics.grossRevenue[targetPeriod];
  const baseCogs = metrics.totalCogs[targetPeriod];
  const baseOpex = metrics.totalOpex[targetPeriod];
  const baseDa = metrics.depreciationAmortization[targetPeriod];
  const baseAddbacks = metrics.totalAddbacks[targetPeriod];
  const baseInterest = metrics.baseInterestExpense[targetPeriod];

  const { matrix, revDeltas, rateHikes } = generateSensitivityMatrix(
    deal.annualSeniorPrincipal,
    baseRev,
    baseCogs,
    baseOpex,
    baseDa,
    baseAddbacks,
    baseInterest
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-4xl glass-dock rounded-3xl p-8 shadow-[0_30px_90px_rgba(0,0,0,0.25)] border border-white/60 relative">
        
        {/* Header */}
        <div className="flex items-start justify-between pb-6 border-b border-black/[0.06]">
          <div>
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-indigo-50 text-indigo-700">
                <Sliders className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-[#0D0D0D] tracking-tight">
                5x5 DSCR Sensitivity & Stress-Test Matrix
              </h3>
            </div>
            <p className="text-xs text-[#6E6D7A] mt-1">
              Simulating simultaneous revenue contraction (-10% to +10%) and interest rate hikes (+0 to +400 bps) for {deal.borrowerName}.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-black/[0.05] text-[#6E6D7A] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-6 py-4 text-xs font-medium">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
            <span className="text-[#3A3945]">≥ 1.30x (Pass / Compliant)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-amber-400"></span>
            <span className="text-[#3A3945]">1.15x - 1.29x (Borderline / Exception)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-rose-500"></span>
            <span className="text-[#3A3945]">&lt; 1.15x (Breach / Default Risk)</span>
          </div>
        </div>

        {/* Matrix Grid */}
        <div className="overflow-x-auto rounded-2xl bg-white/60 p-4 shadow-sm border border-black/[0.04]">
          <table className="w-full text-center border-collapse">
            <thead>
              <tr>
                <th className="p-3 text-left text-xs font-bold uppercase text-[#6E6D7A] tracking-wider">
                  Rev Shock \ Rate Shock
                </th>
                {rateHikes.map((hike) => (
                  <th key={hike} className="p-3 text-xs font-mono font-bold text-[#0D0D0D]">
                    +{hike * 100} bps ({hike === 0 ? 'Base' : `+${hike}%`})
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {matrix.map((row, rowIdx) => {
                const revDelta = revDeltas[rowIdx];
                return (
                  <tr key={revDelta} className="border-t border-black/[0.04]">
                    <td className="p-3 text-left font-mono text-xs font-bold text-[#0D0D0D]">
                      {revDelta > 0 ? `+${revDelta * 100}%` : revDelta < 0 ? `${revDelta * 100}%` : 'Base Rev (0%)'}
                    </td>
                    {row.map((cell, colIdx) => {
                      const isBase = revDelta === 0 && rateHikes[colIdx] === 0;
                      return (
                        <td key={colIdx} className="p-2">
                          <div
                            className={`py-2 px-3 rounded-xl font-mono text-xs font-bold transition-all shadow-sm ${
                              cell.status === 'PASS'
                                ? 'bg-emerald-100 text-emerald-900 ring-1 ring-emerald-300'
                                : cell.status === 'BORDERLINE'
                                ? 'bg-amber-100 text-amber-900 ring-1 ring-amber-300'
                                : 'bg-rose-100 text-rose-900 ring-1 ring-rose-300'
                            } ${isBase ? 'ring-2 ring-indigo-600 shadow-md' : ''}`}
                          >
                            <span>{cell.dscr.toFixed(2)}x</span>
                            {isBase && <span className="block text-[8px] font-sans uppercase">Base Deal</span>}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer Notes */}
        <div className="mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-[#6E6D7A] pt-4 border-t border-black/[0.04]">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-indigo-600" />
            <span>Facility Principal Service: {formatCurrency(deal.annualSeniorPrincipal)} / year</span>
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#0D0D0D] text-white font-semibold text-xs hover:bg-[#2A2935] transition-all"
          >
            Close Matrix
          </button>
        </div>

      </div>
    </div>
  );
};
