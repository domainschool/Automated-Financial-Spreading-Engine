import React, { useState } from 'react';
import { X, UploadCloud, CheckCircle2, Loader2, FileText, ShieldCheck } from 'lucide-react';

interface DocumentUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSimulateUploadSuccess: (filename: string) => void;
}

export const DocumentUploadModal: React.FC<DocumentUploadModalProps> = ({
  isOpen,
  onClose,
  onSimulateUploadSuccess,
}) => {
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [uploading, setUploading] = useState<boolean>(false);
  const [currentStage, setCurrentStage] = useState<number>(0);

  if (!isOpen) return null;

  const handleStartUpload = (filename: string = '2025_Audited_Financial_Statement.pdf') => {
    setUploading(true);
    setCurrentStage(1);

    setTimeout(() => setCurrentStage(2), 700);
    setTimeout(() => setCurrentStage(3), 1500);
    setTimeout(() => setCurrentStage(4), 2300);
    setTimeout(() => {
      setUploading(false);
      onSimulateUploadSuccess(filename);
      onClose();
    }, 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-xl glass-dock rounded-3xl p-8 shadow-[0_30px_90px_rgba(0,0,0,0.25)] border border-white/60 relative">
        
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-black/[0.06]">
          <div>
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-indigo-50 text-indigo-700">
                <UploadCloud className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-[#0D0D0D] tracking-tight">
                Ingest Financial Document
              </h3>
            </div>
            <p className="text-xs text-[#6E6D7A] mt-1">
              Upload PDF Audit Reports, Form 1120 Corporate Tax Returns, or CSV Trial Balances.
            </p>
          </div>

          <button
            onClick={onClose}
            disabled={uploading}
            className="p-2 rounded-full hover:bg-black/[0.05] text-[#6E6D7A] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Upload Area or Progress */}
        {!uploading ? (
          <div className="mt-6 space-y-4">
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragActive(true);
              }}
              onDragLeave={() => setDragActive(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragActive(false);
                const file = e.dataTransfer.files[0];
                handleStartUpload(file ? file.name : 'Borrower_Financial_Audit.pdf');
              }}
              className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer ${
                dragActive
                  ? 'border-indigo-500 bg-indigo-50/50 scale-[1.01]'
                  : 'border-black/[0.12] bg-white/50 hover:bg-white/80'
              }`}
              onClick={() => handleStartUpload('Apex_2025_Audited_Package.pdf')}
            >
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-3 shadow-sm">
                <FileText className="w-6 h-6" />
              </div>
              <p className="text-sm font-bold text-[#0D0D0D]">
                Drop PDF / CSV statement here, or <span className="text-indigo-600 underline">browse</span>
              </p>
              <p className="text-xs text-[#6E6D7A] mt-1">
                Supports Multi-page PDFs (IRS 1120, CPA Audits) up to 25MB
              </p>
            </div>

            <div className="flex items-center justify-between text-xs text-[#6E6D7A] px-1">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                SOC-2 Type II Certified Ingestion
              </span>
              <span>OCR + GAAP AI Mapping Engine</span>
            </div>
          </div>
        ) : (
          <div className="mt-6 space-y-4">
            <div className="bg-white/60 p-6 rounded-2xl border border-black/[0.04] space-y-3">
              
              <div className="flex items-center gap-3">
                {currentStage > 1 ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                ) : currentStage === 1 ? (
                  <Loader2 className="w-5 h-5 text-indigo-600 animate-spin" />
                ) : (
                  <span className="w-5 h-5 rounded-full border border-slate-300" />
                )}
                <span className={`text-xs font-semibold ${currentStage >= 1 ? 'text-[#0D0D0D]' : 'text-[#9E9DA8]'}`}>
                  Stage 1: Document OCR & Tabular Layout Detection
                </span>
              </div>

              <div className="flex items-center gap-3">
                {currentStage > 2 ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                ) : currentStage === 2 ? (
                  <Loader2 className="w-5 h-5 text-indigo-600 animate-spin" />
                ) : (
                  <span className="w-5 h-5 rounded-full border border-slate-300" />
                )}
                <span className={`text-xs font-semibold ${currentStage >= 2 ? 'text-[#0D0D0D]' : 'text-[#9E9DA8]'}`}>
                  Stage 2: Cell Bounding-Box Geometry & Column Association
                </span>
              </div>

              <div className="flex items-center gap-3">
                {currentStage > 3 ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                ) : currentStage === 3 ? (
                  <Loader2 className="w-5 h-5 text-indigo-600 animate-spin" />
                ) : (
                  <span className="w-5 h-5 rounded-full border border-slate-300" />
                )}
                <span className={`text-xs font-semibold ${currentStage >= 3 ? 'text-[#0D0D0D]' : 'text-[#9E9DA8]'}`}>
                  Stage 3: LLM Semantic Line-Item Classification to GAAP
                </span>
              </div>

              <div className="flex items-center gap-3">
                {currentStage === 4 ? (
                  <Loader2 className="w-5 h-5 text-indigo-600 animate-spin" />
                ) : (
                  <span className="w-5 h-5 rounded-full border border-slate-300" />
                )}
                <span className={`text-xs font-semibold ${currentStage >= 4 ? 'text-[#0D0D0D]' : 'text-[#9E9DA8]'}`}>
                  Stage 4: Mathematical Double-Entry Balancing & DSCR Check
                </span>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
};
