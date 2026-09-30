import React from 'react';
import { Deal } from '../../types/spreading';
import { formatCurrency } from '../../utils/financialMath';
import { 
  Building2, 
  ChevronDown, 
  Download, 
  Search, 
  UploadCloud, 
  Sliders, 
  Sparkles,
  ShieldCheck
} from 'lucide-react';

interface HeaderProps {
  deals: Deal[];
  currentDeal: Deal;
  onSelectDeal: (deal: Deal) => void;
  onOpenSecSearch: () => void;
  onOpenFileUpload: () => void;
  onOpenSensitivityModal: () => void;
  onOpenCreditMemoModal: () => void;
  onOpenAboutModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  deals,
  currentDeal,
  onSelectDeal,
  onOpenSecSearch,
  onOpenFileUpload,
  onOpenSensitivityModal,
  onOpenCreditMemoModal,
  onOpenAboutModal,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full glass-dock px-6 py-4 transition-all duration-300">
      <div className="max-w-[1720px] mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        
        {/* Left Section: Logo & Platform Identity */}
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#0D0D0D] to-[#3A3945] text-white shadow-[0_12px_24px_rgba(13,13,13,0.18)]">
            <Sparkles className="w-5 h-5 text-amber-200" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold tracking-tightest text-[#0D0D0D]">
                SpreadSense <span className="text-indigo-600 font-extrabold">AI</span>
              </h1>
              <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full bg-slate-100 text-[#6E6D7A]">
                v1.0 MVP
              </span>
            </div>
            <p className="text-xs text-[#6E6D7A] font-medium tracking-tight">
              Automated Commercial Financial Spreading & Underwriting Engine
            </p>
          </div>
        </div>

        {/* Center: Deal Selector Dropdown */}
        <div className="flex items-center gap-3">
          <div className="relative group">
            <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/70 backdrop-blur-md shadow-sm border border-black/[0.04] text-xs">
              <Building2 className="w-3.5 h-3.5 text-indigo-600" />
              <div className="flex flex-col text-left">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[#6E6D7A]">
                  Active Borrower File
                </span>
                <span className="text-xs font-semibold text-[#0D0D0D] truncate max-w-[200px] sm:max-w-[260px]">
                  {currentDeal.id} — {currentDeal.borrowerName}
                </span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-[#6E6D7A] ml-1" />
            </div>

            <select
              value={currentDeal.id}
              onChange={(e) => {
                const found = deals.find((d) => d.id === e.target.value);
                if (found) onSelectDeal(found);
              }}
              aria-label="Select active borrower deal"
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
            >
              {deals.map((deal) => (
                <option key={deal.id} value={deal.id}>
                  {deal.id} - {deal.borrowerName} ({formatCurrency(deal.facilityAmount, true)})
                </option>
              ))}
            </select>
          </div>

          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100/70 text-xs text-[#6E6D7A]">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Facility: <strong className="text-[#0D0D0D] font-semibold">{formatCurrency(currentDeal.facilityAmount)}</strong> ({currentDeal.facilityType})</span>
          </div>
        </div>

        {/* Right Section: Tool Actions */}
        <div className="flex items-center flex-wrap gap-2">
          <button
            onClick={onOpenSecSearch}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-[#3A3945] rounded-xl bg-white/60 hover:bg-white transition-all shadow-sm border border-black/[0.03] active:scale-95"
            title="Query SEC EDGAR public company facts & financial statements"
          >
            <Search className="w-3.5 h-3.5 text-indigo-500" />
            <span>SEC Public Peer</span>
          </button>

          <button
            onClick={onOpenFileUpload}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-[#3A3945] rounded-xl bg-white/60 hover:bg-white transition-all shadow-sm border border-black/[0.03] active:scale-95"
            title="Upload custom PDF or CSV financial statements"
          >
            <UploadCloud className="w-3.5 h-3.5 text-indigo-500" />
            <span>Ingest Document</span>
          </button>

          <button
            onClick={onOpenSensitivityModal}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-[#3A3945] rounded-xl bg-white/60 hover:bg-white transition-all shadow-sm border border-black/[0.03] active:scale-95"
            title="Open 5x5 DSCR Stress Sensitivity Matrix"
          >
            <Sliders className="w-3.5 h-3.5 text-indigo-500" />
            <span>Stress Matrix</span>
          </button>

          <button
            onClick={onOpenAboutModal}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-indigo-900 rounded-xl bg-indigo-50 hover:bg-indigo-100/80 transition-all shadow-sm border border-indigo-200/60 active:scale-95"
            title="Open SpreadSense AI Educational Guide, Systems Architecture & AI Prompt Runway"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>Architecture & Learning Deck</span>
          </button>

          <button
            onClick={onOpenCreditMemoModal}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white rounded-xl bg-[#0D0D0D] hover:bg-[#2A2935] transition-all shadow-[0_10px_25px_rgba(13,13,13,0.15)] active:scale-95"
          >
            <Download className="w-3.5 h-3.5 text-amber-300" />
            <span>Export Credit Spread</span>
          </button>
        </div>

      </div>
    </header>
  );
};
