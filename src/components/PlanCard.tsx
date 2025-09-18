import React from 'react';
import { Check, Star } from 'lucide-react';
import { Plan } from '../types';

interface PlanCardProps {
  plan: Plan;
  onSelect: (plan: Plan) => void;
  loading?: boolean;
}

export const PlanCard: React.FC<PlanCardProps> = ({ plan, onSelect, loading }) => {
  return (
    <div className={`relative bg-white rounded-2xl border transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer ${
      plan.popular ? 'border-purple-200 shadow-lg ring-2 ring-purple-100' : 'border-gray-200 hover:border-purple-200'
    }`} onClick={() => onSelect(plan)}>
      {plan.popular && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-4 py-1 rounded-full text-sm font-medium flex items-center space-x-1">
            <Star className="w-4 h-4 fill-current" />
            <span>Popular</span>
          </div>
        </div>
      )}
      
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{plan.name}</h3>
            <p className="text-gray-600 text-sm">{plan.description}</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-purple-600">{plan.price}π</div>
            <div className="text-sm text-gray-500">{plan.amount}</div>
          </div>
        </div>
        
        {plan.duration && (
          <div className="flex items-center space-x-2 text-sm text-gray-600 mb-4">
            <Check className="w-4 h-4 text-green-500" />
            <span>Valid for {plan.duration}</span>
          </div>
        )}
        
        <button
          disabled={loading}
          className={`w-full py-3 px-4 rounded-xl font-medium transition-all duration-200 ${
            plan.popular
              ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white hover:from-purple-700 hover:to-purple-800 shadow-lg hover:shadow-xl'
              : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
          } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {loading ? 'Processing...' : 'Select Plan'}
        </button>
      </div>
    </div>
  );
};