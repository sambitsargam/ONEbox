import React, { useState } from 'react';

interface FaucetSectionProps {
  currentAddress?: string;
}

export const FaucetSection: React.FC<FaucetSectionProps> = ({ currentAddress }) => {
  const [isRequesting, setIsRequesting] = useState(false);
  const [lastRequest, setLastRequest] = useState<string | null>(null);
  const [customAddress, setCustomAddress] = useState('');

  const handleFaucetRequest = async () => {
    const targetAddress = customAddress || currentAddress;
    
    if (!targetAddress) {
      alert('Please provide an address');
      return;
    }

    setIsRequesting(true);
    
    try {
      // Simulate faucet request to OneChain testnet
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setLastRequest(new Date().toLocaleString());
      alert('🎉 Faucet request successful! OCT tokens have been sent to your address.');
      setCustomAddress('');
    } catch (error) {
      console.error('Faucet request failed:', error);
      alert('❌ Faucet request failed. Please try again.');
    } finally {
      setIsRequesting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-3xl">�</span>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">OneChain Testnet Faucet</h2>
        <p className="text-gray-600">Request OCT tokens for testing and development</p>
      </div>

      {/* Faucet Form */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
        <div className="space-y-6">
          <div>
            <label htmlFor="recipient" className="block text-sm font-medium text-gray-700 mb-3">
              Recipient Address
            </label>
            <div className="space-y-3">
              <input
                id="recipient"
                type="text"
                value={customAddress}
                onChange={(e) => setCustomAddress(e.target.value)}
                placeholder="Enter OneChain address (0x...) or use current address"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 font-mono text-sm"
              />
              {currentAddress && (
                <button
                  onClick={() => setCustomAddress(currentAddress)}
                  className="text-sm text-blue-600 hover:text-blue-700 underline flex items-center space-x-1"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  <span>Use current address ({currentAddress.slice(0, 6)}...{currentAddress.slice(-4)})</span>
                </button>
              )}
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-4">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="text-sm">
                <p className="font-semibold text-blue-900 mb-2">Faucet Information:</p>
                <ul className="space-y-1 text-blue-800">
                  <li>• Get 10 OCT tokens per request</li>
                  <li>• Rate limited to 1 request per hour</li>
                  <li>• Only works on OneChain Testnet</li>
                  <li>• Tokens have no real value</li>
                </ul>
              </div>
            </div>
          </div>

          <button
            onClick={handleFaucetRequest}
            disabled={isRequesting || (!customAddress && !currentAddress)}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed text-white py-4 px-6 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            {isRequesting ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Requesting tokens...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center space-x-2">
                <span>💰</span>
                <span>Request OCT Tokens</span>
              </div>
            )}
          </button>
        </div>
      </div>

      {/* Last Request Info */}
      {lastRequest && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-6">
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-green-900 mb-2">
                Last Request Successful!
              </h3>
              <p className="text-sm text-green-800">
                <strong>Time:</strong> {lastRequest}
              </p>
              <p className="text-sm text-green-800">
                <strong>Amount:</strong> 10 OCT tokens
              </p>
              <p className="text-xs text-green-700 mt-2">
                Check your balance to see the received tokens.
              </p>
            </div>
          </div>
        </div>
      )}

      {!currentAddress && (
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-6">
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-orange-900 mb-2">
                Address Recommended
              </h3>
              <p className="text-sm text-orange-800">
                Set an address in the Address tab for easier token requests.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
