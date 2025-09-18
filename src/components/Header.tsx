import React from 'react';
import { Smartphone, Wallet, User, Menu } from 'lucide-react';

interface HeaderProps {
  user: any;
  balance: number;
  onConnectWallet: () => void;
  onMenuToggle: () => void;
}

export const Header: React.FC<HeaderProps> = ({ user, balance, onConnectWallet, onMenuToggle }) => {
  return (
    <header className="bg-white/90 backdrop-blur-md border-b border-purple-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <button
              onClick={onMenuToggle}
              className="md:hidden p-2 rounded-lg hover:bg-purple-50 transition-colors"
            >
              <Menu className="w-5 h-5 text-purple-600" />
            </button>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-700 rounded-full flex items-center justify-center">
                <Smartphone className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">PiTopUp</span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <div className="hidden sm:flex items-center space-x-2 bg-gradient-to-r from-purple-50 to-purple-100 px-3 py-2 rounded-lg">
                  <Wallet className="w-4 h-4 text-purple-600" />
                  <span className="text-sm font-medium text-purple-700">{balance.toFixed(2)} π</span>
                </div>
                <div className="flex items-center space-x-2 bg-gray-50 px-3 py-2 rounded-lg">
                  <User className="w-4 h-4 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700 hidden sm:inline">
                    {user.piAddress.slice(0, 6)}...{user.piAddress.slice(-4)}
                  </span>
                </div>
              </div>
            ) : (
              <button
                onClick={onConnectWallet}
                className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-4 py-2 rounded-lg font-medium hover:from-purple-700 hover:to-purple-800 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Connect Wallet
              </button>
            )}
          </div>
        </div>
        
        {user && (
          <div className="sm:hidden pb-3">
            <div className="flex items-center justify-center space-x-2 bg-gradient-to-r from-purple-50 to-purple-100 px-3 py-2 rounded-lg">
              <Wallet className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-medium text-purple-700">{balance.toFixed(2)} π</span>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};