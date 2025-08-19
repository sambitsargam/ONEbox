import { useState } from 'react';
import { WalletSection } from './WalletSection';
import { FaucetSection } from './FaucetSection';
import { BalancesSection } from './BalancesSection';
import { PTBSection } from './PTBSection';
import { TransactionHistory } from './TransactionHistory';

type Tab = 'wallet' | 'faucet' | 'balances' | 'ptb' | 'history';

export const MainLayout = () => {
  const [activeTab, setActiveTab] = useState<Tab>('wallet');

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: 'wallet', label: 'Wallet', icon: '👛' },
    { id: 'faucet', label: 'Faucet', icon: '🚰' },
    { id: 'balances', label: 'Balances', icon: '💰' },
    { id: 'ptb', label: 'PTB Builder', icon: '🔧' },
    { id: 'history', label: 'History', icon: '📊' },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'wallet':
        return <WalletSection />;
      case 'faucet':
        return <FaucetSection />;
      case 'balances':
        return <BalancesSection />;
      case 'ptb':
        return <PTBSection />;
      case 'history':
        return <TransactionHistory />;
      default:
        return <WalletSection />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-blue-200 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">O</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">ONEbox</h1>
                <p className="text-sm text-gray-600">OneChain Dev Portal</p>
              </div>
            </div>
            
            {/* Network Status */}
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-gray-700">OneChain Testnet</span>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white/60 backdrop-blur-sm border-b border-blue-100">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex space-x-8 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center space-x-2 py-4 px-2 text-sm font-medium border-b-2 transition-colors
                  ${activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                  }
                `}
              >
                <span className="text-lg">{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-soft border border-white/20 p-6">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};
