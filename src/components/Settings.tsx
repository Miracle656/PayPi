import React, { useState } from 'react';
import { User, Bell, Shield, HelpCircle, LogOut, Edit3 } from 'lucide-react';

interface SettingsProps {
  user: any;
  onLogout: () => void;
}

export const Settings: React.FC<SettingsProps> = ({ user, onLogout }) => {
  const [notifications, setNotifications] = useState(true);
  const [biometric, setBiometric] = useState(false);

  const settingsItems = [
    {
      icon: User,
      title: 'Profile Information',
      description: 'Manage your account details',
      action: () => {},
    },
    {
      icon: Bell,
      title: 'Notifications',
      description: 'Transaction and renewal alerts',
      action: () => setNotifications(!notifications),
      toggle: notifications,
    },
    {
      icon: Shield,
      title: 'Biometric Security',
      description: 'Use fingerprint or face ID',
      action: () => setBiometric(!biometric),
      toggle: biometric,
    },
    {
      icon: HelpCircle,
      title: 'Help & Support',
      description: 'Get help or contact support',
      action: () => {},
    },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Settings</h2>
      
      {/* User Profile Card */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-700 rounded-full flex items-center justify-center">
            <User className="w-8 h-8 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-medium text-gray-900">Pi User</h3>
            <p className="text-gray-600 text-sm font-mono">
              {user?.piAddress?.slice(0, 8)}...{user?.piAddress?.slice(-8)}
            </p>
            <p className="text-gray-500 text-sm">{user?.email || 'No email set'}</p>
          </div>
          <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-50 transition-colors">
            <Edit3 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Settings Items */}
      <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-200">
        {settingsItems.map(({ icon: Icon, title, description, action, toggle }, index) => (
          <div key={index} className="p-6 hover:bg-gray-50 transition-colors cursor-pointer" onClick={action}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Icon className="w-6 h-6 text-gray-400" />
                <div>
                  <h4 className="text-sm font-medium text-gray-900">{title}</h4>
                  <p className="text-sm text-gray-600">{description}</p>
                </div>
              </div>
              {typeof toggle === 'boolean' && (
                <div className={`w-11 h-6 rounded-full transition-colors ${
                  toggle ? 'bg-purple-600' : 'bg-gray-200'
                }`}>
                  <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${
                    toggle ? 'translate-x-6' : 'translate-x-0.5'
                  } mt-0.5`} />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Logout Button */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <button
          onClick={onLogout}
          className="flex items-center space-x-3 w-full text-red-600 hover:text-red-700 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>

      <div className="text-center text-gray-500 text-sm">
        PiTopUp v1.0.0 • Made with ❤️ for Pi Network
      </div>
    </div>
  );
};