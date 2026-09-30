import React, { useState } from 'react';
import { Deal } from '../../types/spreading';
import { 
  FileText, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Layers, 
  Eye, 
  Sparkles,
  ChevronDown
} from 'lucide-react';

interface SourceDocumentViewerProps {
  deal: Deal;
  activeLineItemId: string | null;
  onSelectLineItem: (id: string) => void;
}

export const SourceDocumentViewer: React.FC<SourceDocumentViewerProps> = ({
  deal,
  activeLineItemId,
  onSelectLineItem,
}) => {
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [selectedDocIndex, setSelectedDocIndex] = useState<number>(0);
  const [showAllBoundingBoxes, setShowAllBoundingBoxes] = useState<boolean>(true);

  const activeItem = deal.lineItems.find((i) => i.id === activeLineItemId);

  return (
    <div className="flex flex-col h-full glass-panel rounded-3xl p-6 transition-all duration-300">
      
      {/* Top Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-black/[0.04]">
        
        {/* Document Selector */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/70 shadow-sm border border-black/[0.03] text-xs font-medium text-[#0D0D0D]">
              <FileText className="w-3.5 h-3.5 text-indigo-600" />
              <span>{deal.documentPages[selectedDocIndex] || 'Primary Financial Statement'}</span>
              <ChevronDown className="w-3 h-3 text-[#6E6D7A] ml-1" />
            </div>
            <select
              value={selectedDocIndex}
              onChange={(e) => setSelectedDocIndex(Number(e.target.value))}
              aria-label="Select source financial document page"
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
            >
              {deal.documentPages.map((doc, idx) => (
                <option key={idx} value={idx}>
                  {doc}
                </option>
              ))}
            </select>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50/80 text-emerald-800 text-[11px] font-semibold">
            <Sparkles className="w-3 h-3 text-emerald-600" />
            <span>OCR: 94.2% Conf</span>
          </div>
        </div>

        {/* View Controls */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setShowAllBoundingBoxes(!showAllBoundingBoxes)}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
              showAllBoundingBoxes 
                ? 'bg-indigo-50 text-indigo-700 font-semibold' 
                : 'bg-white/50 text-[#6E6D7A] hover:bg-white'
            }`}
            title="Toggle highlight overlay on all extracted cells"
          >
            <Eye className="w-3 h-3" />
            <span className="hidden md:inline">Provenance Overlays</span>
          </button>

          <div className="flex items-center bg-white/60 rounded-xl p-0.5 shadow-sm border border-black/[0.03]">
            <button
              onClick={() => setZoomLevel((prev) => Math.max(75, prev - 15))}
              className="p-1.5 rounded-lg hover:bg-black/[0.04] text-[#6E6D7A] transition-colors"
              title="Zoom out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-[11px] font-mono px-2 text-[#3A3945]">
              {zoomLevel}%
            </span>
            <button
              onClick={() => setZoomLevel((prev) => Math.min(150, prev + 15))}
              className="p-1.5 rounded-lg hover:bg-black/[0.04] text-[#6E6D7A] transition-colors"
              title="Zoom in"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setZoomLevel(100)}
              className="p-1.5 rounded-lg hover:bg-black/[0.04] text-[#6E6D7A] transition-colors ml-0.5"
              title="Reset zoom"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>

      {/* Active Selection Banner */}
      <div className="py-2.5 px-3 my-3 rounded-xl bg-indigo-50/60 text-xs flex items-center justify-between text-indigo-950 border border-indigo-100/60">
        <div className="flex items-center gap-2 truncate">
          <Layers className="w-3.5 h-3.5 text-indigo-600 flex-shrink-0" />
          <span className="truncate">
            {activeItem ? (
              <>
                Selected: <strong className="font-semibold">{activeItem.originalLabel}</strong> (Page {activeItem.pageNumber})
              </>
            ) : (
              <span className="text-[#6E6D7A]">Click any cell in the spread to highlight source provenance on this document.</span>
            )}
          </span>
        </div>
        {activeItem && (
          <span className="text-[10px] font-mono bg-indigo-200/60 text-indigo-800 px-2 py-0.5 rounded-md font-semibold">
            {Math.round(activeItem.confidenceScore * 100)}% Match
          </span>
        )}
      </div>

      {/* Document Viewport Canvas */}
      <div className="flex-1 overflow-auto rounded-2xl bg-slate-200/50 p-4 relative min-h-[520px] flex justify-center items-start shadow-inner">
        <div 
          style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
          className="transition-transform duration-200 w-full max-w-[560px] bg-[#FCFCF9] rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.08)] p-8 text-[#1A1A1A] relative border border-black/[0.06] select-none"
        >
          
          {/* Document Header Mock */}
          <div className="text-center pb-6 border-b border-black/[0.12] mb-6">
            <div className="text-[10px] uppercase font-mono tracking-widest text-[#6E6D7A] mb-1">
              UNITED STATES SECURITIES AND EXCHANGE COMMISSION / GAAP AUDIT REPORT
            </div>
            <h2 className="text-sm font-bold tracking-tight text-[#0D0D0D] uppercase">
              {deal.borrowerName}
            </h2>
            <p className="text-xs font-serif italic text-[#3A3945] mt-0.5">
              CONSOLIDATED STATEMENTS OF OPERATIONS AND COMPREHENSIVE INCOME
            </p>
            <p className="text-[10px] text-[#6E6D7A] mt-1 font-mono">
              (Amounts in USD — Audited by Independent Certified Public Accountants)
            </p>
          </div>

          {/* Table Header Columns */}
          <div className="grid grid-cols-12 text-[10px] font-bold font-mono text-[#6E6D7A] pb-2 border-b border-black/[0.08] mb-4 uppercase">
            <div className="col-span-6">Statement Line Item</div>
            <div className="col-span-2 text-right">FY 2023</div>
            <div className="col-span-2 text-right">FY 2024</div>
            <div className="col-span-2 text-right">FY 2025</div>
          </div>

          {/* Document Content Rows with Line Numbers */}
          <div className="space-y-3 font-serif text-xs">
            {deal.lineItems.map((item, idx) => {
              const isActive = activeLineItemId === item.id;
              return (
                <div
                  key={item.id}
                  onClick={() => onSelectLineItem(item.id)}
                  className={`grid grid-cols-12 items-center py-1.5 px-2 rounded-lg cursor-pointer transition-all duration-200 relative ${
                    isActive
                      ? 'bg-indigo-500/15 ring-2 ring-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.3)]'
                      : showAllBoundingBoxes
                      ? 'hover:bg-slate-100/80 bg-black/[0.015]'
                      : 'hover:bg-slate-100/50'
                  }`}
                >
                  <div className="col-span-6 flex items-baseline gap-2 truncate">
                    <span className="text-[10px] font-mono text-[#9E9DA8] select-none">
                      {(idx + 1).toString().padStart(2, '0')}
                    </span>
                    <span className={`truncate text-xs ${isActive ? 'font-bold text-indigo-950' : 'text-[#1F2937]'}`}>
                      {item.originalLabel}
                    </span>
                  </div>

                  <div className="col-span-2 text-right font-mono text-[11px] text-[#374151]">
                    ${(item.values.fy2023 / 1_000).toLocaleString()}k
                  </div>
                  <div className="col-span-2 text-right font-mono text-[11px] text-[#374151]">
                    ${(item.values.fy2024 / 1_000).toLocaleString()}k
                  </div>
                  <div className="col-span-2 text-right font-mono text-[11px] font-semibold text-[#111827]">
                    ${(item.values.fy2025 / 1_000).toLocaleString()}k
                  </div>

                  {/* Active Bounding Box Highlight Pin */}
                  {isActive && (
                    <div className="absolute -top-3 -right-2 bg-indigo-600 text-white text-[9px] font-mono px-2 py-0.5 rounded-full shadow-md z-10 flex items-center gap-1 font-bold animate-pulse">
                      <span>x:{item.boundingBox.left}% y:{item.boundingBox.top}%</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Document Footer */}
          <div className="mt-8 pt-4 border-t border-black/[0.10] flex items-center justify-between text-[10px] font-mono text-[#6E6D7A]">
            <span>CONFIDENTIAL CREDIT UNDERWRITING DOSSIER</span>
            <span>Page {activeItem?.pageNumber || 1} of 14</span>
          </div>

        </div>
      </div>

    </div>
  );
};
