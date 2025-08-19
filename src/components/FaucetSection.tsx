import { useState } from 'react';
import { useCurrentAccount } from '@onelabs/dapp-kit';
import { useMutation } from '@tanstack/react-query';
import { FAUCET_ENDPOINTS } from '../utils/networks';
import { formatAddress } from '../utils/formatting';
import { useToast } from '../hooks/useToast';
import type { FaucetRequest, FaucetResponse } from '../types';

export const FaucetSection = () => {
  const currentAccount = useCurrentAccount();
  const [recipientAddress, setRecipientAddress] = useState('');
  const { showSuccess, showError } = useToast();

  // Faucet mutation
  const faucetMutation = useMutation({
    mutationFn: async (address: string): Promise<FaucetResponse> => {
      const requestBody: FaucetRequest = {
        FixedAmountRequest: {
          recipient: address,
        },
      };

      const response = await fetch(FAUCET_ENDPOINTS.testnet, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`Faucet request failed: ${response.status}`);
      }

      const data = await response.json();
      return data;
    },
    onSuccess: (data) => {
      if (data.error) {
        showError(`Faucet error: ${data.error}`);
      } else {
        showSuccess('OCT tokens successfully sent!');
        setRecipientAddress('');
      }
    },
    onError: (error: Error) => {
      showError(`Failed to request tokens: ${error.message}`);
    },
  });

  const handleRequestTokens = () => {
    const address = recipientAddress || currentAccount?.address;
    if (!address) {
      showError('Please provide a recipient address');
      return;
    }
    faucetMutation.mutate(address);
  };

  const handleUseConnectedWallet = () => {
    if (currentAccount?.address) {
      setRecipientAddress(currentAccount.address);
    }
  };

  if (!currentAccount) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-3xl">🚰</span>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Faucet</h2>
        <p className="text-gray-600 max-w-md mx-auto mb-6">
          Connect your wallet to request testnet OCT tokens.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">OneChain Testnet Faucet</h2>
        <p className="text-gray-600">Request OCT tokens for testing and development</p>
      </div>

      {/* Faucet Form */}
      <div className="bg-white rounded-xl shadow-soft border border-gray-100 p-6">
        <div className="space-y-4">
          <div>
            <label htmlFor="recipient" className="block text-sm font-medium text-gray-700 mb-2">
              Recipient Address
            </label>
            <div className="space-y-2">
              <input
                id="recipient"
                type="text"
                value={recipientAddress}
                onChange={(e) => setRecipientAddress(e.target.value)}
                placeholder="Enter OneChain address (0x...)"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
              {currentAccount && (
                <button
                  onClick={handleUseConnectedWallet}
                  className="text-sm text-blue-600 hover:text-blue-700 underline"
                >
                  Use connected wallet ({formatAddress(currentAccount.address)})
                </button>
              )}
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start space-x-2">
              <span className="text-blue-500 mt-0.5">ℹ️</span>
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">Faucet Information:</p>
                <ul className="space-y-1 text-blue-700">
                  <li>• Each request provides a fixed amount of OCT tokens</li>
                  <li>• Rate limited to prevent abuse</li>
                  <li>• Only works on OneChain Testnet</li>
                  <li>• Tokens have no real value</li>
                </ul>
              </div>
            </div>
          </div>

          <button
            onClick={handleRequestTokens}
            disabled={faucetMutation.isPending || (!recipientAddress && !currentAccount)}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-3 px-4 rounded-lg font-medium transition-colors"
          >
            {faucetMutation.isPending ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Requesting tokens...</span>
              </div>
            ) : (
              'Request OCT Tokens'
            )}
          </button>
        </div>
      </div>

      {/* Recent Faucet Result */}
      {faucetMutation.data && !faucetMutation.data.error && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-6">
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-green-600">✓</span>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-green-900 mb-2">
                Tokens Successfully Sent!
              </h3>
              <div className="space-y-2 text-sm text-green-800">
                {faucetMutation.data.transferredGasObjects.map((obj, index) => (
                  <div key={index} className="bg-green-100 rounded-lg p-3">
                    <p><strong>Amount:</strong> {obj.amount} OCT</p>
                    <p><strong>Object ID:</strong> <code className="text-xs">{formatAddress(obj.id)}</code></p>
                    <p><strong>Transaction:</strong> <code className="text-xs">{formatAddress(obj.transferTxDigest)}</code></p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Error State */}
      {faucetMutation.error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
              <span className="text-red-600">✕</span>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-red-900 mb-2">
                Request Failed
              </h3>
              <p className="text-sm text-red-800">
                {faucetMutation.error.message}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
