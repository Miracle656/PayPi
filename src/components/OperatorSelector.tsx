import React from 'react';
import { Smartphone, Wifi } from 'lucide-react';
import { ReloadlyOperator } from '../services/reloadly';

interface OperatorSelectorProps {
  operators: ReloadlyOperator[];
  selectedOperator: ReloadlyOperator | null;
  onSelect: (operator: ReloadlyOperator) => void;
  isLoading: boolean;
}

export const OperatorSelector: React.FC<OperatorSelectorProps> = ({
  operators,
  selectedOperator,
  onSelect,
  isLoading
}) => {
  if (isLoading) {
    return (
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Select Mobile Operator
        </label>
        <div className="animate-pulse bg-gray-200 h-12 rounded-xl"></div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        Select Mobile Operator
      </label>
      <div className="grid grid-cols-1 gap-2 max-h-40 overflow-y-auto">
        {operators.map((operator) => (
          <button
            key={operator.id}
            onClick={() => onSelect(operator)}
            className={`flex items-center space-x-3 p-3 rounded-xl border transition-all duration-200 ${
              selectedOperator?.id === operator.id
                ? 'border-purple-500 bg-purple-50 text-purple-700'
                : 'border-gray-200 hover:border-purple-200 hover:bg-purple-50'
            }`}
          >
            {operator.logoUrls && operator.logoUrls.length > 0 ? (
              <img
                src={operator.logoUrls[0]}
                alt={operator.name}
                className="w-8 h-8 rounded-full object-cover"
              />
            ) : (
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-700 rounded-full flex items-center justify-center">
                <Smartphone className="w-4 h-4 text-white" />
              </div>
            )}
            <div className="flex-1 text-left">
              <div className="font-medium text-sm">{operator.name}</div>
              <div className="text-xs text-gray-500">{operator.country.name}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};