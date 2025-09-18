import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { PlanGrid } from './components/PlanGrid';
import { TransactionHistory } from './components/TransactionHistory';
import { SubscriptionManager } from './components/SubscriptionManager';
import { Settings } from './components/Settings';
import { usePiNetwork } from './hooks/usePiNetwork';
import { useReloadly } from './hooks/useReloadly';
import { 
  airtimePlans, 
  dataPlans, 
  mockTransactions, 
  mockSubscriptions 
} from './data/mockData';
import { Plan, Transaction, Subscription } from './types';

function App() {
  const { user, isLoading: piLoading, authenticate, logout } = usePiNetwork();
  const { operators, isLoading: operatorsLoading } = useReloadly();
  const [activeTab, setActiveTab] = useState('airtime');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [balance, setBalance] = useState(127.45); // Mock balance - in production, fetch from Pi Network

  useEffect(() => {
    // Simulate loading user data
    const loadUserData = () => {
      setTransactions(mockTransactions);
      setSubscriptions(mockSubscriptions);
    };

    if (user) {
      loadUserData();
    }
  }, [user]);

  const handleConnectWallet = async () => {
    try {
      await authenticate();
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    }
  };

  const handleLogout = () => {
    logout();
    setBalance(127.45); // Reset to mock balance
    setTransactions([]);
    setSubscriptions([]);
    setActiveTab('airtime');
  };

  const handlePurchase = async (plan: Plan, phoneNumber: string) => {
    if (!user || balance < plan.price) {
      throw new Error('Insufficient balance or user not connected');
    }

    // Create transaction record
    const newTransaction: Transaction = {
      id: `tx-${Date.now()}`,
      type: plan.type,
      planName: plan.name,
      amount: plan.amount,
      price: plan.price,
      status: 'completed',
      timestamp: new Date(),
      txHash: `0x${Math.random().toString(16).substr(2, 40)}`,
    };

    setTransactions(prev => [newTransaction, ...prev]);
    setBalance(prev => prev - plan.price);

    // Create subscription for data plans
    if (plan.type === 'data') {
      const newSubscription: Subscription = {
        id: `sub-${Date.now()}`,
        planId: plan.id,
        planName: plan.name,
        amount: plan.amount,
        renewalDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        isActive: true,
        autoRenew: true,
      };
      setSubscriptions(prev => [newSubscription, ...prev]);
    }
  };

  const handleToggleAutoRenew = (subscriptionId: string, autoRenew: boolean) => {
    setSubscriptions(prev =>
      prev.map(sub =>
        sub.id === subscriptionId ? { ...sub, autoRenew } : sub
      )
    );
  };

  const renderContent = () => {
    if (!user) {
      return (
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-700 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-2xl font-bold text-white">π</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Welcome to PiTopUp</h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Connect your Pi Network wallet to start purchasing real airtime and data with Pi tokens
            </p>
            <button
              onClick={handleConnectWallet}
              disabled={piLoading}
              className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-8 py-3 rounded-xl font-medium hover:from-purple-700 hover:to-purple-800 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {piLoading ? 'Connecting...' : 'Connect Pi Wallet'}
            </button>
          </div>
        </div>
      );
    }

    switch (activeTab) {
      case 'airtime':
        return (
          <PlanGrid
            plans={airtimePlans}
            title="Airtime Plans"
            userBalance={balance}
            onPurchase={handlePurchase}
          />
        );
      case 'data':
        return (
          <PlanGrid
            plans={dataPlans}
            title="Data Plans"
            userBalance={balance}
            onPurchase={handlePurchase}
          />
        );
      case 'subscriptions':
        return (
          <SubscriptionManager
            subscriptions={subscriptions}
            onToggleAutoRenew={handleToggleAutoRenew}
          />
        );
      case 'history':
        return <TransactionHistory transactions={transactions} />;
      case 'settings':
        return <Settings user={user} onLogout={handleLogout} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-16 md:pb-0">
      <Header
        user={user ? { piAddress: user.uid, balance } : null}
        balance={balance}
        onConnectWallet={handleConnectWallet}
        onMenuToggle={() => setIsMenuOpen(!isMenuOpen)}
      />
      
      {user && (
        <Navigation
          activeTab={activeTab}
          onTabChange={setActiveTab}
          isOpen={isMenuOpen}
        />
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderContent()}
      </main>
    </div>
  );
}

export default App;