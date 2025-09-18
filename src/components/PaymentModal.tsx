import React, { useState, useEffect } from 'react';
import { X, Smartphone, Wifi, Loader, CheckCircle, AlertCircle } from 'lucide-react';
import { Plan } from '../types';
import { PaymentService } from '../services/paymentService';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: Plan | null;
  userBalance: number;
  onConfirmPayment: (plan: Plan, phoneNumber: string) => Promise<void>;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  plan,
  userBalance,
  onConfirmPayment
}) => {
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const paymentService = PaymentService.getInstance();

  useEffect(() => {
    if (!isOpen) {
      setPaymentStatus('idle');
      setPhoneNumber('');
      setErrorMessage('');
    }
  }, [isOpen]);

  const handlePayment = async () => {
    if (!plan || !phoneNumber) return;
    
    setPaymentStatus('processing');
    setErrorMessage('');
    
    try {
      const result = await paymentService.processPayment(plan, phoneNumber);
      
      if (result.success) {
        await onConfirmPayment(plan, phoneNumber);
        setPaymentStatus('success');
        setTimeout(() => {
          onClose();
        }, 2000);
      } else {
        setPaymentStatus('error');
        setErrorMessage(result.error || 'Payment failed');
      }
    } catch (error) {
      setPaymentStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Payment failed');
    }
  };

  if (!isOpen || !plan) return null;

  const canProceed = userBalance >= plan.price && phoneNumber.length >= 10;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Confirm Purchase</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Plan Details */}
          <div className="bg-gray-50 rounded-xl p-4">
            <div className="flex items-center space-x-3 mb-3">
              {plan.type === 'airtime' ? (
                <Smartphone className="w-6 h-6 text-purple-600" />
              ) : (
                <Wifi className="w-6 h-6 text-purple-600" />
              )}
              <div>
                <h3 className="font-medium text-gray-900">{plan.name}</h3>
                <p className="text-sm text-gray-600">{plan.description}</p>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold text-gray-900">{plan.amount}</span>
              <span className="text-xl font-bold text-purple-600">{plan.price}π</span>
            </div>
          </div>

          {/* Phone Number Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="Enter phone number"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
              disabled={paymentStatus === 'processing'}
            />
          </div>

          {/* Balance Check */}
          <div className="bg-purple-50 rounded-xl p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-purple-700">Your Balance:</span>
              <span className="font-semibold text-purple-800">{userBalance.toFixed(2)}π</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-purple-700">Amount Required:</span>
              <span className="font-semibold text-purple-800">{plan.price}π</span>
            </div>
            {userBalance < plan.price && (
              <div className="mt-2 flex items-center space-x-2 text-red-600">
                <AlertCircle className="w-4 h-4" />
                <span className="text-sm">Insufficient balance</span>
              </div>
            )}
          </div>

          {/* Payment Status */}
          {paymentStatus === 'processing' && (
            <div className="flex items-center justify-center space-x-2 py-4">
              <Loader className="w-5 h-5 animate-spin text-purple-600" />
              <span className="text-purple-600">Processing payment...</span>
            </div>
          )}

          {paymentStatus === 'success' && (
            <div className="flex items-center justify-center space-x-2 py-4 text-green-600">
              <CheckCircle className="w-5 h-5" />
              <span>Payment successful!</span>
            </div>
          )}

          {paymentStatus === 'error' && (
            <div className="flex items-center justify-center space-x-2 py-4 text-red-600">
              <AlertCircle className="w-5 h-5" />
              <span>{errorMessage || 'Payment failed. Please try again.'}</span>
            </div>
          )}

          {/* Action Buttons */}
          {paymentStatus === 'idle' && (
            <div className="flex space-x-3">
              <button
                onClick={onClose}
                className="flex-1 py-3 px-4 border border-gray-300 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handlePayment}
                disabled={!canProceed}
                className={`flex-1 py-3 px-4 rounded-xl font-medium transition-colors ${
                  canProceed
                    ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white hover:from-purple-700 hover:to-purple-800'
                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                }`}
              >
                Pay {plan.price}π
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};