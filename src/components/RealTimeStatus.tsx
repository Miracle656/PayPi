import React, { useState, useEffect } from 'react';
import { CheckCircle, Clock, AlertCircle, RefreshCw } from 'lucide-react';
import { PaymentService } from '../services/paymentService';

interface RealTimeStatusProps {
  transactionId?: number;
  onStatusUpdate?: (status: string) => void;
}

export const RealTimeStatus: React.FC<RealTimeStatusProps> = ({
  transactionId,
  onStatusUpdate
}) => {
  const [status, setStatus] = useState<'PENDING' | 'SUCCESSFUL' | 'FAILED'>('PENDING');
  const [isChecking, setIsChecking] = useState(false);
  const paymentService = PaymentService.getInstance();

  useEffect(() => {
    if (!transactionId) return;

    const checkStatus = async () => {
      try {
        setIsChecking(true);
        const result = await paymentService.getTransactionStatus(transactionId);
        setStatus(result.status);
        onStatusUpdate?.(result.status);
      } catch (error) {
        console.error('Failed to check transaction status:', error);
        setStatus('FAILED');
      } finally {
        setIsChecking(false);
      }
    };

    // Check immediately
    checkStatus();

    // Then check every 10 seconds for pending transactions
    const interval = setInterval(() => {
      if (status === 'PENDING') {
        checkStatus();
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [transactionId, status, onStatusUpdate]);

  const getStatusIcon = () => {
    if (isChecking) {
      return <RefreshCw className="w-5 h-5 animate-spin text-blue-500" />;
    }

    switch (status) {
      case 'SUCCESSFUL':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'FAILED':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'PENDING':
        return <Clock className="w-5 h-5 text-yellow-500" />;
    }
  };

  const getStatusText = () => {
    if (isChecking) return 'Checking status...';
    
    switch (status) {
      case 'SUCCESSFUL':
        return 'Top-up completed successfully';
      case 'FAILED':
        return 'Top-up failed';
      case 'PENDING':
        return 'Processing top-up...';
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'SUCCESSFUL':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'FAILED':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'PENDING':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    }
  };

  if (!transactionId) return null;

  return (
    <div className={`flex items-center space-x-2 p-3 rounded-lg border ${getStatusColor()}`}>
      {getStatusIcon()}
      <span className="text-sm font-medium">{getStatusText()}</span>
    </div>
  );
};