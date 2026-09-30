import React, { useState, useMemo } from 'react';
import { Header } from './components/layout/Header';
import { CovenantRibbon } from './components/covenant/CovenantRibbon';
import { SourceDocumentViewer } from './components/document/SourceDocumentViewer';
import { SpreadingGrid } from './components/grid/SpreadingGrid';
import { SensitivityMatrixModal } from './components/analytics/SensitivityMatrixModal';
import { CreditMemoModal } from './components/export/CreditMemoModal';
import { DocumentUploadModal } from './components/upload/DocumentUploadModal';
import { SecEdgarSearchModal } from './components/sec/SecEdgarSearchModal';
import { AboutModal } from './components/about/AboutModal';
import { MOCK_DEALS } from './data/mockDeals';
import { Deal } from './types/spreading';
import { calculateUnderwritingMetrics } from './utils/financialMath';

export const App: React.FC = () => {
  const [deals, setDeals] = useState<Deal[]>(MOCK_DEALS);
  const [currentDeal, setCurrentDeal] = useState<Deal>(MOCK_DEALS[0]);
  const [rateHike, setRateHike] = useState<number>(0.0);
  const [targetPeriod, setTargetPeriod] = useState<'fy2023' | 'fy2024' | 'fy2025'>('fy2025');
  const [activeLineItemId, setActiveLineItemId] = useState<string | null>(
    MOCK_DEALS[0].lineItems[0]?.id || null
  );

  // Modal States
  const [isSensitivityModalOpen, setIsSensitivityModalOpen] = useState<boolean>(false);
  const [isCreditMemoModalOpen, setIsCreditMemoModalOpen] = useState<boolean>(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState<boolean>(false);
  const [isSecModalOpen, setIsSecModalOpen] = useState<boolean>(false);
  const [isAboutModalOpen, setIsAboutModalOpen] = useState<boolean>(false);

  // Live Real-Time Financial Calculations
  const metrics = useMemo(() => {
    return calculateUnderwritingMetrics(
      currentDeal.lineItems,
      currentDeal.annualSeniorPrincipal,
      rateHike
    );
  }, [currentDeal.lineItems, currentDeal.annualSeniorPrincipal, rateHike]);

  // Handle inline edits in spreading table
  const handleUpdateLineItemValue = (
    id: string,
    period: 'fy2023' | 'fy2024' | 'fy2025',
    value: number
  ) => {
    const updatedLineItems = currentDeal.lineItems.map((item) => {
      if (item.id === id) {
        return {
          ...item,
          values: {
            ...item.values,
            [period]: value,
          },
          isUserEdited: true,
        };
      }
      return item;
    });

    const updatedDeal: Deal = {
      ...currentDeal,
      lineItems: updatedLineItems,
    };

    setCurrentDeal(updatedDeal);
    setDeals((prev) => prev.map((d) => (d.id === updatedDeal.id ? updatedDeal : d)));
  };

  // Handle add-back toggle
  const handleToggleAddback = (id: string) => {
    const updatedLineItems = currentDeal.lineItems.map((item) => {
      if (item.id === id) {
        return {
          ...item,
          isAddbackActive: !item.isAddbackActive,
          isUserEdited: true,
        };
      }
      return item;
    });

    const updatedDeal: Deal = {
      ...currentDeal,
      lineItems: updatedLineItems,
    };

    setCurrentDeal(updatedDeal);
    setDeals((prev) => prev.map((d) => (d.id === updatedDeal.id ? updatedDeal : d)));
  };

  // Reset to original mock values
  const handleResetToDefaults = () => {
    const original = MOCK_DEALS.find((d) => d.id === currentDeal.id);
    if (original) {
      setCurrentDeal(JSON.parse(JSON.stringify(original)));
    }
  };

  // Switch active deal
  const handleSelectDeal = (deal: Deal) => {
    setCurrentDeal(deal);
    setActiveLineItemId(deal.lineItems[0]?.id || null);
    setRateHike(0.0);
  };

  // Handle SEC peer import
  const handleImportSecPeer = (peerDeal: Partial<Deal>) => {
    const newDeal: Deal = {
      ...currentDeal,
      ...peerDeal,
      id: peerDeal.id || `SEC-${Date.now()}`,
    };
    setDeals((prev) => [newDeal, ...prev]);
    setCurrentDeal(newDeal);
  };

  // Handle uploaded document mock processing
  const handleSimulateUploadSuccess = (filename: string) => {
    const uploadedDeal: Deal = {
      ...currentDeal,
      id: `UPLOAD-${Date.now().toString().slice(-4)}`,
      borrowerName: filename.replace(/\.[^/.]+$/, '').replace(/_/g, ' '),
      statementSource: `Extracted via OCR from ${filename}`,
      documentPages: [filename, 'Debt Schedule & Notes'],
    };
    setDeals((prev) => [uploadedDeal, ...prev]);
    setCurrentDeal(uploadedDeal);
    setActiveLineItemId(uploadedDeal.lineItems[0]?.id || null);
  };

  return (
    <div className="min-h-screen canvas-ambient-gradient flex flex-col selection:bg-indigo-100 selection:text-indigo-900">
      
      {/* Top Header */}
      <Header
        deals={deals}
        currentDeal={currentDeal}
        onSelectDeal={handleSelectDeal}
        onOpenSecSearch={() => setIsSecModalOpen(true)}
        onOpenFileUpload={() => setIsUploadModalOpen(true)}
        onOpenSensitivityModal={() => setIsSensitivityModalOpen(true)}
        onOpenCreditMemoModal={() => setIsCreditMemoModalOpen(true)}
        onOpenAboutModal={() => setIsAboutModalOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-[1720px] w-full mx-auto p-6 md:p-10 flex flex-col">
        
        {/* Underwriting Covenant Executive Ribbon */}
        <CovenantRibbon
          metrics={metrics}
          rateHike={rateHike}
          onRateHikeChange={setRateHike}
          annualPrincipal={currentDeal.annualSeniorPrincipal}
          targetPeriod={targetPeriod}
          onTargetPeriodChange={setTargetPeriod}
        />

        {/* Split-Screen Workspace (HITL) */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Pane (45% width on large screens): Source Document Viewport */}
          <div className="lg:col-span-5 h-[760px]">
            <SourceDocumentViewer
              deal={currentDeal}
              activeLineItemId={activeLineItemId}
              onSelectLineItem={setActiveLineItemId}
            />
          </div>

          {/* Right Pane (55% width on large screens): Standardized GAAP Spreading Grid */}
          <div className="lg:col-span-7 h-[760px]">
            <SpreadingGrid
              lineItems={currentDeal.lineItems}
              metrics={metrics}
              activeLineItemId={activeLineItemId}
              onSelectLineItem={setActiveLineItemId}
              onUpdateLineItemValue={handleUpdateLineItemValue}
              onToggleAddback={handleToggleAddback}
              onResetToDefaults={handleResetToDefaults}
            />
          </div>

        </div>

      </main>

      {/* Modals */}
      <AboutModal
        isOpen={isAboutModalOpen}
        onClose={() => setIsAboutModalOpen(false)}
      />

      <SensitivityMatrixModal
        isOpen={isSensitivityModalOpen}
        onClose={() => setIsSensitivityModalOpen(false)}
        deal={currentDeal}
        metrics={metrics}
      />

      <CreditMemoModal
        isOpen={isCreditMemoModalOpen}
        onClose={() => setIsCreditMemoModalOpen(false)}
        deal={currentDeal}
        metrics={metrics}
        rateHike={rateHike}
      />

      <DocumentUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onSimulateUploadSuccess={handleSimulateUploadSuccess}
      />

      <SecEdgarSearchModal
        isOpen={isSecModalOpen}
        onClose={() => setIsSecModalOpen(false)}
        onImportSecPeer={handleImportSecPeer}
      />

    </div>
  );
};
