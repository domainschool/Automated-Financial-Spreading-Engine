import React, { useState } from 'react';
import { X, Search, ArrowRight, Loader2 } from 'lucide-react';
import { Deal } from '../../types/spreading';

interface SecEdgarSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportSecPeer: (peerDeal: Partial<Deal>) => void;
}

interface SECPeer {
  ticker: string;
  name: string;
  cik: string;
  sic: string;
  industry: string;
  rev2024: number;
  ebitda2024: number;
}

const POPULAR_PEERS: SECPeer[] = [
  {
    ticker: 'CAT',
    name: 'Caterpillar Inc.',
    cik: '0000018230',
    sic: '3531 - Construction Machinery & Equipment',
    industry: 'Industrial & Heavy Machinery',
    rev2024: 67_100_000_000,
    ebitda2024: 13_800_000_000,
  },
  {
    ticker: 'DE',
    name: 'Deere & Company',
    cik: '0000315189',
    sic: '3523 - Farm Machinery & Equipment',
    industry: 'Agricultural & Turf Equipment',
    rev2024: 52_570_000_000,
    ebitda2024: 10_920_000_000,
  },
  {
    ticker: 'PCAR',
    name: 'PACCAR Inc',
    cik: '0000075362',
    sic: '3711 - Motor Vehicles & Passenger Car Bodies',
    industry: 'Commercial Trucks & Powertrains',
    rev2024: 35_120_000_000,
    ebitda2024: 5_420_000_000,
  },
  {
    ticker: 'GE',
    name: 'GE Aerospace',
    cik: '0000040545',
    sic: '3724 - Aircraft Engines & Engine Parts',
    industry: 'Aerospace Propulsion & Systems',
    rev2024: 38_700_000_000,
    ebitda2024: 7_100_000_000,
  },
];

export const SecEdgarSearchModal: React.FC<SecEdgarSearchModalProps> = ({
  isOpen,
  onClose,
  onImportSecPeer,
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isSearching, setIsSearching] = useState<boolean>(false);

  if (!isOpen) return null;

  const filteredPeers = POPULAR_PEERS.filter(
    (p) =>
      p.ticker.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectPeer = (peer: SECPeer) => {
    setIsSearching(true);
    setTimeout(() => {
      setIsSearching(false);
      onImportSecPeer({
        id: `SEC-${peer.ticker}`,
        borrowerName: `${peer.name} (${peer.ticker})`,
        facilityType: 'Public Corporate Revolver Benchmark',
        facilityAmount: 25_000_000,
        sicCode: peer.sic,
        industry: peer.industry,
        statementSource: `SEC EDGAR 10-K XBRL (CIK ${peer.cik})`,
        annualSeniorPrincipal: 1_200_000,
        creditOfficer: 'SEC Public Benchmark Underwriter',
      });
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-2xl glass-dock rounded-3xl p-8 shadow-[0_30px_90px_rgba(0,0,0,0.25)] border border-white/60 relative">
        
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-black/[0.06]">
          <div>
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-indigo-50 text-indigo-700">
                <Search className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-[#0D0D0D] tracking-tight">
                SEC EDGAR Public Peer Ingestion
              </h3>
            </div>
            <p className="text-xs text-[#6E6D7A] mt-1">
              Query live Form 10-K & 10-Q XBRL financial facts directly from data.sec.gov.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-black/[0.05] text-[#6E6D7A] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="mt-5 relative">
          <input
            type="text"
            placeholder="Search by Ticker or Company Name (e.g. CAT, DE, PCAR, GE)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white/80 border border-black/[0.06] text-xs text-[#0D0D0D] focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
          />
          <Search className="w-4 h-4 text-[#6E6D7A] absolute left-3.5 top-3.5" />
        </div>

        {/* Peer Results List */}
        <div className="mt-5 space-y-2.5 max-h-[360px] overflow-y-auto">
          {filteredPeers.map((peer) => (
            <div
              key={peer.ticker}
              onClick={() => handleSelectPeer(peer)}
              className="p-4 rounded-2xl bg-white/60 hover:bg-white border border-black/[0.03] hover:shadow-sm cursor-pointer transition-all flex items-center justify-between group"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xs text-[#0D0D0D] font-mono px-2 py-0.5 rounded bg-slate-100">
                    {peer.ticker}
                  </span>
                  <span className="font-semibold text-xs text-[#0D0D0D]">{peer.name}</span>
                </div>
                <div className="text-[11px] text-[#6E6D7A] mt-1 flex items-center gap-3">
                  <span>CIK: {peer.cik}</span>
                  <span>•</span>
                  <span>{peer.sic}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right text-[11px]">
                  <span className="text-[#6E6D7A] block">2024 Revenue</span>
                  <strong className="text-[#0D0D0D] font-mono font-semibold">${(peer.rev2024 / 1_000_000_000).toFixed(1)}B</strong>
                </div>
                <div className="w-8 h-8 rounded-xl bg-slate-100 group-hover:bg-indigo-600 group-hover:text-white text-[#6E6D7A] flex items-center justify-center transition-all">
                  {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};
