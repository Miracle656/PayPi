import React from 'react';
import { Clock, CheckCircle, AlertCircle, Smartphone, Wifi } from 'lucide-react';
import { Transaction } from '../types';

interface TransactionHistoryProps {
  transactions: Transaction[];
}

export const TransactionHistory: React.FC<TransactionHistoryProps> = ({ transactions }) => {
  const getStatusIcon = (status: Transaction['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'failed':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: Transaction['status']) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-50';
      case 'failed':
        return 'text-red-600 bg-red-50';
      case 'pending':
        return 'text-yellow-600 bg-yellow-50';
    }
  };

  if (transactions.length === 0) {
    return (
      <div className="text-center py-12">
        <Clock className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No transactions yet</h3>
        <p className="text-gray-500">Your transaction history will appear here</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Transaction History</h2>
      
      {transactions.map((transaction) => (
        <div key={transaction.id} className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0">
              {transaction.type === 'airtime' ? (
                <Smartphone className="w-8 h-8 text-purple-600" />
              ) : (
                <Wifi className="w-8 h-8 text-purple-600" />
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-sm font-medium text-gray-900">{transaction.planName}</h3>
                <span className="text-sm font-medium text-purple-600">{transaction.price}π</span>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">{transaction.amount}</p>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}>
                  {getStatusIcon(transaction.status)}
                  <span className="ml-1 capitalize">{transaction.status}</span>
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {transaction.timestamp.toLocaleDateString()} at {transaction.timestamp.toLocaleTimeString()}
              </p>
              {transaction.txHash && (
                <p className="text-xs text-gray-400 mt-1 font-mono">
                  TX: {transaction.txHash.slice(0, 8)}...{transaction.txHash.slice(-8)}
                </p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};