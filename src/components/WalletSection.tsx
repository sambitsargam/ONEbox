import { ConnectButton, useCurrentAccount, useCurrentWallet } from '@onelabs/dapp-kit';
import { formatAddress, copyToClipboard } from '../utils/formatting';
import { useToast } from '../hooks/useToast';

export const WalletSection = () => {
  const currentAccount = useCurrentAccount();
  const { currentWallet, connectionStatus } = useCurrentWallet();
  const { showSuccess } = useToast();

  const handleCopyAddress = async () => {
    if (currentAccount?.address) {
      const success = await copyToClipboard(currentAccount.address);
      if (success) {
        showSuccess('Address copied to clipboard!');
      }
    }
  };

  if (!currentAccount) {
    return (
      <div className="text-center py-12">
        <div className="mb-6">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">👛</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Connect Your Wallet</h2>
          <p className="text-gray-600 max-w-md mx-auto">
            Connect your OneChain wallet to start exploring the testnet, request faucet tokens, 
            and build programmable transaction blocks.
          </p>
        </div>
        
        <div className="flex justify-center">
          <ConnectButton className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors" />
        </div>
        
        <div className="mt-8 text-sm text-gray-500">
          <p>Don't have a wallet? Try these options:</p>
          <div className="flex justify-center space-x-4 mt-2">
            <a href="https://chrome.google.com/webstore/detail/sui-wallet/opcgpfmipidbgpenhmajoajpbobppdil" 
               target="_blank" 
               rel="noopener noreferrer"
               className="text-blue-600 hover:underline">
              OneChain Wallet
            </a>
            <a href="https://suiet.app/" 
               target="_blank" 
               rel="noopener noreferrer"
               className="text-blue-600 hover:underline">
              Suiet Wallet
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Wallet Connected</h2>
        <p className="text-gray-600">Your wallet is connected to OneChain Testnet</p>
      </div>

      {/* Wallet Info Card */}
      <div className="bg-white rounded-xl shadow-soft border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Wallet Information</h3>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <span className="text-sm text-gray-600">Connected</span>
          </div>
        </div>
        
        <div className="space-y-4">
          {/* Wallet Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Wallet Type
            </label>
            <div className="flex items-center space-x-2">
              <span className="text-sm bg-blue-50 text-blue-700 px-2 py-1 rounded">
                {currentWallet?.name || 'Unknown Wallet'}
              </span>
            </div>
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Address
            </label>
            <div className="flex items-center space-x-2">
              <code className="flex-1 text-sm bg-gray-50 p-2 rounded border font-mono">
                {formatAddress(currentAccount.address, 8)}
              </code>
              <button
                onClick={handleCopyAddress}
                className="p-2 text-gray-400 hover:text-gray-600 rounded hover:bg-gray-50 transition-colors"
                title="Copy full address"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </button>
            </div>
          </div>

          {/* Full Address (expandable) */}
          <details className="group">
            <summary className="cursor-pointer text-sm text-blue-600 hover:text-blue-700">
              Show full address
            </summary>
            <div className="mt-2 p-3 bg-gray-50 rounded border text-xs font-mono break-all">
              {currentAccount.address}
            </div>
          </details>

          {/* Connection Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Connection Status
            </label>
            <div className="flex items-center space-x-2">
              <span className={`
                text-sm px-2 py-1 rounded
                ${connectionStatus === 'connected' 
                  ? 'bg-green-50 text-green-700' 
                  : 'bg-yellow-50 text-yellow-700'
                }
              `}>
                {connectionStatus}
              </span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 pt-4 border-t border-gray-100">
          <div className="flex space-x-3">
            <ConnectButton className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors">
              Switch Wallet
            </ConnectButton>
          </div>
        </div>
      </div>
    </div>
  );
};
