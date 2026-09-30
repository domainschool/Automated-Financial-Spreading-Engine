import React, { useState } from 'react';
import { SpreadingLineItem, UnderwritingMetrics, GAAPSection } from '../../types/spreading';
import { formatCurrency } from '../../utils/financialMath';
import { 
  AlertTriangle, 
  CheckCircle2, 
  Filter, 
  Info, 
  RefreshCw,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';

interface SpreadingGridProps {
  lineItems: SpreadingLineItem[];
  metrics: UnderwritingMetrics;
  activeLineItemId: string | null;
  onSelectLineItem: (id: string) => void;
  onUpdateLineItemValue: (id: string, period: 'fy2023' | 'fy2024' | 'fy2025', value: number) => void;
  onToggleAddback: (id: string) => void;
  onResetToDefaults: () => void;
}

export const SpreadingGrid: React.FC<SpreadingGridProps> = ({
  lineItems,
  metrics,
  activeLineItemId,
  onSelectLineItem,
  onUpdateLineItemValue,
  onToggleAddback,
  onResetToDefaults,
}) => {
  const [onlyFlagged, setOnlyFlagged] = useState<boolean>(false);
  const [editingCell, setEditingCell] = useState<{ id: string; period: 'fy2023' | 'fy2024' | 'fy2025' } | null>(null);
  const [editInputValue, setEditInputValue] = useState<string>('');
  const [hoveredRationale, setHoveredRationale] = useState<string | null>(null);

  // Filter items if low confidence filter is active
  const filteredItems = onlyFlagged
    ? lineItems.filter((i) => i.confidenceScore < 0.85)
    : lineItems;

  const startEditing = (id: string, period: 'fy2023' | 'fy2024' | 'fy2025', currentValue: number) => {
    setEditingCell({ id, period });
    setEditInputValue(currentValue.toString());
  };

  const saveEditing = () => {
    if (editingCell) {
      const num = parseFloat(editInputValue.replace(/[^0-9.-]/g, ''));
      if (!isNaN(num)) {
        onUpdateLineItemValue(editingCell.id, editingCell.period, num);
      }
      setEditingCell(null);
    }
  };

  const renderSectionHeader = (title: string, section: GAAPSection) => (
    <tr className="bg-slate-100/60 text-[#3A3945]">
      <td colSpan={6} className="py-2.5 px-4 text-xs font-bold tracking-wider uppercase">
        <div className="flex items-center justify-between">
          <span>{title}</span>
          <span className="text-[10px] font-mono text-[#6E6D7A] font-normal lowercase">
            gaap standard section [{section}]
          </span>
        </div>
      </td>
    </tr>
  );

  const renderSubtotalRow = (title: string, values: { fy2023: number; fy2024: number; fy2025: number }, isHighlight: boolean = false) => (
    <tr className={`${isHighlight ? 'bg-indigo-50/70 font-bold text-[#0D0D0D]' : 'bg-slate-50/70 font-semibold text-[#1F2937]'} border-t border-b border-black/[0.06]`}>
      <td className="py-2.5 px-4 text-xs tracking-tight" colSpan={2}>
        {title}
      </td>
      <td className="py-2.5 px-3 text-[11px] text-center text-[#6E6D7A]">
        —
      </td>
      <td className="py-2.5 px-4 text-xs text-right font-mono tabular-numbers">
        {formatCurrency(values.fy2023)}
      </td>
      <td className="py-2.5 px-4 text-xs text-right font-mono tabular-numbers">
        {formatCurrency(values.fy2024)}
      </td>
      <td className="py-2.5 px-4 text-xs text-right font-mono tabular-numbers font-bold text-indigo-950">
        {formatCurrency(values.fy2025)}
      </td>
    </tr>
  );

  const renderDataRow = (item: SpreadingLineItem) => {
    const isActive = activeLineItemId === item.id;
    const isLowConfidence = item.confidenceScore < 0.85;
    const isCritical = item.confidenceScore < 0.70;

    return (
      <tr
        key={item.id}
        onClick={() => onSelectLineItem(item.id)}
        className={`group cursor-pointer transition-all duration-200 border-b border-black/[0.02] ${
          isActive
            ? 'bg-indigo-50/80 ring-1 ring-indigo-400'
            : isCritical
            ? 'bg-rose-50/40 hover:bg-rose-50/70'
            : isLowConfidence
            ? 'bg-amber-50/30 hover:bg-amber-50/60'
            : 'hover:bg-slate-50/70'
        }`}
      >
        {/* Standardized Category */}
        <td className="py-2.5 px-4 text-xs">
          <div className="flex items-center gap-2">
            <span className={`font-semibold ${isActive ? 'text-indigo-950' : 'text-[#0D0D0D]'}`}>
              {item.standardizedCategory}
            </span>
            {item.isUserEdited && (
              <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 font-bold">
                EDITED
              </span>
            )}
            {item.isPotentialAddback && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleAddback(item.id);
                }}
                className="text-xs text-indigo-600 hover:text-indigo-800 transition-colors ml-1"
                title={item.isAddbackActive ? "Discretionary addback active (click to disable)" : "Addback disabled (click to enable)"}
              >
                {item.isAddbackActive ? (
                  <ToggleRight className="w-4 h-4 text-emerald-600 inline" />
                ) : (
                  <ToggleLeft className="w-4 h-4 text-slate-400 inline" />
                )}
              </button>
            )}
          </div>
        </td>

        {/* Original Borrower Source Label */}
        <td className="py-2.5 px-4 text-xs text-[#6E6D7A] font-serif italic truncate max-w-[180px]">
          <span title={item.originalLabel}>{item.originalLabel}</span>
        </td>

        {/* Confidence Score Badge */}
        <td className="py-2.5 px-3 text-center">
          <div className="relative inline-block">
            <span
              onMouseEnter={() => setHoveredRationale(item.mappingRationale || null)}
              onMouseLeave={() => setHoveredRationale(null)}
              className={`inline-flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                item.confidenceScore >= 0.90
                  ? 'bg-emerald-50 text-emerald-700'
                  : item.confidenceScore >= 0.75
                  ? 'bg-amber-50 text-amber-700 ring-1 ring-amber-300'
                  : 'bg-rose-50 text-rose-700 ring-1 ring-rose-300'
              }`}
            >
              {item.confidenceScore < 0.85 ? (
                <AlertTriangle className="w-2.5 h-2.5" />
              ) : (
                <CheckCircle2 className="w-2.5 h-2.5" />
              )}
              {Math.round(item.confidenceScore * 100)}%
            </span>
          </div>
        </td>

        {/* Periods (FY23, FY24, FY25) with inline edit */}
        {(['fy2023', 'fy2024', 'fy2025'] as const).map((period) => {
          const isEditing = editingCell?.id === item.id && editingCell?.period === period;
          const val = item.values[period];

          return (
            <td
              key={period}
              onDoubleClick={(e) => {
                e.stopPropagation();
                startEditing(item.id, period, val);
              }}
              className="py-2.5 px-4 text-xs text-right font-mono tabular-numbers select-none"
              title="Double click to edit value directly"
            >
              {isEditing ? (
                <input
                  type="text"
                  autoFocus
                  value={editInputValue}
                  onChange={(e) => setEditInputValue(e.target.value)}
                  onBlur={saveEditing}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') saveEditing();
                    if (e.key === 'Escape') setEditingCell(null);
                  }}
                  className="w-24 text-right py-0.5 px-1.5 text-xs font-mono bg-white border border-indigo-500 rounded shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  aria-label="Edit line item value"
                />
              ) : (
                <span className="group-hover:text-indigo-600 transition-colors">
                  {formatCurrency(val)}
                </span>
              )}
            </td>
          );
        })}
      </tr>
    );
  };

  return (
    <div className="flex flex-col h-full glass-panel rounded-3xl p-6 transition-all duration-300">
      
      {/* Grid Top Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-black/[0.04]">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold tracking-tight text-[#0D0D0D]">
              Standardized GAAP Financial Spread
            </h2>
            <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-[#6E6D7A]">
              HITL Verified
            </span>
          </div>
          <p className="text-xs text-[#6E6D7A] mt-0.5">
            Double-click any cell to adjust values. Edits automatically trigger real-time covenant recalculations.
          </p>
        </div>

        {/* Filters and Reset Button */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setOnlyFlagged(!onlyFlagged)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
              onlyFlagged
                ? 'bg-amber-100 text-amber-900 font-semibold shadow-sm'
                : 'bg-white/60 text-[#3A3945] hover:bg-white border border-black/[0.03]'
            }`}
          >
            <Filter className="w-3.5 h-3.5 text-amber-600" />
            <span>Flagged Items (&lt;85%)</span>
            {lineItems.filter((i) => i.confidenceScore < 0.85).length > 0 && (
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-amber-200 text-amber-900 font-bold">
                {lineItems.filter((i) => i.confidenceScore < 0.85).length}
              </span>
            )}
          </button>

          <button
            onClick={onResetToDefaults}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs text-[#6E6D7A] hover:text-[#0D0D0D] hover:bg-white/70 transition-all border border-black/[0.03]"
            title="Reset spread adjustments to original AI extractions"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset Defaults</span>
          </button>
        </div>
      </div>

      {/* Rationale Banner / Tooltip if hovered */}
      {hoveredRationale && (
        <div className="my-2 p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-center gap-2 animate-fadeIn">
          <Info className="w-4 h-4 text-amber-600 flex-shrink-0" />
          <span><strong>AI Mapping Rationale:</strong> {hoveredRationale}</span>
        </div>
      )}

      {/* Table Container */}
      <div className="flex-1 overflow-auto rounded-2xl bg-white/40 mt-4 shadow-sm border border-black/[0.03]">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white/80 sticky top-0 z-20 text-[11px] font-bold text-[#6E6D7A] uppercase tracking-wider border-b border-black/[0.06] backdrop-blur-md">
              <th className="py-3 px-4 w-[28%]">GAAP Classification</th>
              <th className="py-3 px-4 w-[26%]">Borrower Raw Label</th>
              <th className="py-3 px-3 text-center w-[12%]">Confidence</th>
              <th className="py-3 px-4 text-right w-[11%]">FY 2023</th>
              <th className="py-3 px-4 text-right w-[11%]">FY 2024</th>
              <th className="py-3 px-4 text-right w-[12%] text-indigo-950">FY 2025 (Proj)</th>
            </tr>
          </thead>
          <tbody>
            
            {/* 1. REVENUE SECTION */}
            {renderSectionHeader('1. Revenue & Gross Billings', 'revenue')}
            {filteredItems.filter((i) => i.section === 'revenue').map(renderDataRow)}
            {renderSubtotalRow('Total Net Revenue', metrics.grossRevenue, true)}

            {/* 2. COGS SECTION */}
            {renderSectionHeader('2. Cost of Goods Sold (COGS)', 'cogs')}
            {filteredItems.filter((i) => i.section === 'cogs').map(renderDataRow)}
            {renderSubtotalRow('Total Cost of Goods Sold', metrics.totalCogs)}
            {renderSubtotalRow('Gross Profit (Net Rev - COGS)', metrics.grossProfit, true)}

            {/* 3. OPERATING EXPENSES */}
            {renderSectionHeader('3. Operating Expenses (OpEx)', 'opex')}
            {filteredItems.filter((i) => i.section === 'opex').map(renderDataRow)}
            {renderSubtotalRow('Total Operating Expenses', metrics.totalOpex)}
            {renderSubtotalRow('Operating Income (EBIT)', metrics.operatingIncomeEbit, true)}

            {/* 4. NON-CASH & DISCRETIONARY ADDBACKS */}
            {renderSectionHeader('4. Non-Cash Charges & Underwriting Add-Backs', 'addbacks')}
            {filteredItems.filter((i) => i.section === 'addbacks').map(renderDataRow)}
            {renderSubtotalRow('Total Add-Backs & Adjustments', metrics.totalAddbacks)}

            {/* 5. FINAL ADJUSTED EBITDA */}
            {renderSubtotalRow('Adjusted Underwriting EBITDA', metrics.adjustedEbitda, true)}

          </tbody>
        </table>
      </div>

    </div>
  );
};
