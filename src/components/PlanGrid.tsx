import React, { useState } from 'react';
import { PlanCard } from './PlanCard';
import { PaymentModal } from './PaymentModal';
import { Plan } from '../types';

interface PlanGridProps {
  plans: Plan[];
  title: string;
  userBalance: number;
  onPurchase: (plan: Plan) => Promise<void>;
}

export const PlanGrid: React.FC<PlanGridProps> = ({ plans, title, userBalance, onPurchase }) => {
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const handlePlanSelect = (plan: Plan) => {
    setSelectedPlan(plan);
    setShowPaymentModal(true);
  };

  const handleCloseModal = () => {
    setShowPaymentModal(false);
    setSelectedPlan(null);
  };

  const handleConfirmPayment = async (plan: Plan) => {
    await onPurchase(plan);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {plans.map((plan) => (
          <PlanCard
            key={plan.id}
            plan={plan}
            onSelect={handlePlanSelect}
          />
        ))}
      </div>

      <PaymentModal
        isOpen={showPaymentModal}
        onClose={handleCloseModal}
        plan={selectedPlan}
        userBalance={userBalance}
        onConfirmPayment={handleConfirmPayment}
      />
    </div>
  );
};