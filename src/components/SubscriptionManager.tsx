import React from 'react';
import { Calendar, ToggleLeft, ToggleRight, Smartphone, Wifi } from 'lucide-react';
import { Subscription } from '../types';

interface SubscriptionManagerProps {
  subscriptions: Subscription[];
  onToggleAutoRenew: (subscriptionId: string, autoRenew: boolean) => void;
}

export const SubscriptionManager: React.FC<SubscriptionManagerProps> = ({
  subscriptions,
  onToggleAutoRenew
}) => {
  if (subscriptions.length === 0) {
    return (
      <div className="text-center py-12">
        <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No active subscriptions</h3>
        <p className="text-gray-500">Subscribe to a plan to manage your renewals here</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">My Subscriptions</h2>
      
      {subscriptions.map((subscription) => (
        <div key={subscription.id} className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                {subscription.planId.startsWith('airtime') ? (
                  <Smartphone className="w-8 h-8 text-purple-600" />
                ) : (
                  <Wifi className="w-8 h-8 text-purple-600" />
                )}
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-gray-900">{subscription.planName}</h3>
                <p className="text-gray-600">{subscription.amount}</p>
                <div className="flex items-center space-x-4 mt-2">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">
                      Renews: {subscription.renewalDate.toLocaleDateString()}
                    </span>
                  </div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    subscription.isActive
                      ? 'text-green-800 bg-green-100'
                      : 'text-gray-800 bg-gray-100'
                  }`}>
                    {subscription.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col items-end space-y-3">
              <button
                onClick={() => onToggleAutoRenew(subscription.id, !subscription.autoRenew)}
                className="flex items-center space-x-2 text-sm font-medium text-gray-700 hover:text-purple-600 transition-colors"
              >
                {subscription.autoRenew ? (
                  <ToggleRight className="w-5 h-5 text-purple-600" />
                ) : (
                  <ToggleLeft className="w-5 h-5 text-gray-400" />
                )}
                <span>Auto-renew</span>
              </button>
              
              {subscription.isActive && (
                <button className="text-sm text-red-600 hover:text-red-700 font-medium">
                  Cancel Subscription
                </button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};