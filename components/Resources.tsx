import React from 'react';
import { PesticideMarket } from './PesticideMarket';
import { ResourcesDashboard } from './ResourcesDashboard';
import type { PurchaseLog, PesticideRating } from '../types';
import { useTranslation } from '../contexts/LanguageContext';

interface ResourcesProps {
  purchaseLogs: PurchaseLog[];
  onLogPurchase: (purchaseData: Omit<PurchaseLog, 'id' | 'date'>) => void;
  onDeletePurchase: (id: string) => void;
  pesticideRatings: Record<string, PesticideRating>;
  onRatePurchase: (purchaseId: string, rating: number) => void;
}

export const Resources: React.FC<ResourcesProps> = ({ purchaseLogs, onLogPurchase, onDeletePurchase, pesticideRatings, onRatePurchase }) => {
  const { t } = useTranslation();
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-text-primary">{t('resources_title')}</h2>
        <p className="mt-2 text-lg text-text-secondary">{t('resources_description')}</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2">
          <PesticideMarket 
            purchaseLogs={purchaseLogs} 
            onLogPurchase={onLogPurchase} 
            onDeletePurchase={onDeletePurchase}
            pesticideRatings={pesticideRatings}
            onRatePurchase={onRatePurchase}
          />
        </div>
        <div className="space-y-8">
          <ResourcesDashboard />
        </div>
      </div>
    </div>
  );
};
