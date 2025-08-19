import React, { useState } from 'react';
import { AddressInput } from './AddressInput';
import { FaucetSection } from './FaucetSection';
import { BalancesSection } from './BalancesSection';
import { PTBSection } from './PTBSection';
import { TransactionHistory } from './TransactionHistory';

type Tab = 'address' | 'faucet' | 'balances' | 'ptb' | 'transactions';

export const MainLayout: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('address');
  const [currentAddress, setCurrentAddress] = useState<string>('');

  const tabs = [
    { id: 'address' as Tab, label: 'Address', icon: '🏠' },
    { id: 'faucet' as Tab, label: 'Faucet', icon: '�' },
    { id: 'balances' as Tab, label: 'Balances', icon: '💰' },
    { id: 'ptb' as Tab, label: 'PTB Builder', icon: '🔧' },
    { id: 'transactions' as Tab, label: 'Transactions', icon: '�' },
  ];

  const handleAddressSubmit = (address: string) => {
    setCurrentAddress(address);
    setActiveTab('faucet'); // Auto-navigate to faucet after setting address
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'address':
        return (
          <AddressInput 
            onAddressSubmit={handleAddressSubmit}
            currentAddress={currentAddress}
          />
        );
      case 'faucet':
        return <FaucetSection currentAddress={currentAddress} />;
      case 'balances':
        return <BalancesSection currentAddress={currentAddress} />;
      case 'ptb':
        return <PTBSection currentAddress={currentAddress} />;
      case 'transactions':
        return <TransactionHistory currentAddress={currentAddress} />;
      default:
        return (
          <AddressInput 
            onAddressSubmit={handleAddressSubmit}
            currentAddress={currentAddress}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-lg border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  ONE<span className="text-blue-600">box</span>
                </h1>
                <p className="text-sm text-gray-600">OneChain Developer Portal</p>
              </div>
            </div>
            
            {currentAddress && (
              <div className="hidden md:flex items-center space-x-3 bg-green-50 px-4 py-2 rounded-xl border border-green-200">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-green-800 font-medium">Connected</span>
                <span className="text-xs text-green-600 font-mono">
                  {currentAddress.slice(0, 6)}...{currentAddress.slice(-4)}
                </span>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-3 border-b-2 whitespace-nowrap transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600 bg-blue-50'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="text-lg">{tab.icon}</span>
                <span className="font-medium">{tab.label}</span>
                {tab.id !== 'address' && !currentAddress && (
                  <span className="w-2 h-2 bg-orange-400 rounded-full"></span>
                )}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderContent()}
      </main>
    </div>
  );
};
