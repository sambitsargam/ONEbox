import { useCurrentAccount, useSuiClientQuery } from '@onelabs/dapp-kit';
import { formatBalance, formatAddress, copyToClipboard } from '../utils/formatting';
import { useToast } from '../hooks/useToast';

export const BalancesSection = () => {
  const currentAccount = useCurrentAccount();
  const { showSuccess } = useToast();

  // Get all balances for the current account
  const { data: balances, isLoading: balancesLoading, error: balancesError } = useSuiClientQuery(
    'getAllBalances',
    {
      owner: currentAccount?.address || '',
    },
    {
      enabled: !!currentAccount?.address,
    }
  );

  // Get owned objects
  const { data: ownedObjects, isLoading: objectsLoading } = useSuiClientQuery(
    'getOwnedObjects',
    {
      owner: currentAccount?.address || '',
      options: {
        showType: true,
        showContent: true,
        showDisplay: true,
      },
    },
    {
      enabled: !!currentAccount?.address,
    }
  );

  const handleCopyObjectId = async (objectId: string) => {
    const success = await copyToClipboard(objectId);
    if (success) {
      showSuccess('Object ID copied to clipboard!');
    }
  };

  if (!currentAccount) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-3xl">💰</span>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Balances & Assets</h2>
        <p className="text-gray-600 max-w-md mx-auto">
          Connect your wallet to view your balances and owned objects on OneChain Testnet.
        </p>
      </div>
    );
  }

  if (balancesLoading || objectsLoading) {
    return (
      <div className="text-center py-12">
        <div className="w-8 h-8 border-3 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600">Loading balances and assets...</p>
      </div>
    );
  }

  if (balancesError) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-3xl">❌</span>
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Error Loading Balances</h2>
        <p className="text-gray-600">Failed to load balances. Please try again.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Balances & Assets</h2>
        <p className="text-gray-600">Your OneChain Testnet holdings</p>
      </div>

      {/* Balances Table */}
      <div className="bg-white rounded-xl shadow-soft border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Token Balances</h3>
        
        {!balances || balances.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl">💰</span>
            </div>
            <p className="text-gray-600">No token balances found</p>
            <p className="text-sm text-gray-500 mt-1">
              Try requesting tokens from the faucet first
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Token Type</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-700">Balance</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-700">Object Count</th>
                </tr>
              </thead>
              <tbody>
                {balances.map((balance, index) => (
                  <tr key={index} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div>
                        <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                          {balance.coinType === '0x2::sui::SUI' ? 'OCT' : formatAddress(balance.coinType)}
                        </code>
                        {balance.coinType === '0x2::sui::SUI' && (
                          <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                            Native Token
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right font-mono">
                      <span className="text-lg font-semibold">
                        {formatBalance(balance.totalBalance)}
                      </span>
                      <span className="text-sm text-gray-500 ml-1">
                        {balance.coinType === '0x2::sui::SUI' ? 'OCT' : 'tokens'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="text-sm bg-gray-100 px-2 py-1 rounded">
                        {balance.coinObjectCount}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Owned Objects */}
      <div className="bg-white rounded-xl shadow-soft border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Owned Objects</h3>
        
        {!ownedObjects?.data || ownedObjects.data.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl">📦</span>
            </div>
            <p className="text-gray-600">No objects found</p>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="text-sm text-gray-600 mb-4">
              Showing {ownedObjects.data.length} objects
              {ownedObjects.hasNextPage && ' (partial list)'}
            </div>
            
            <div className="grid gap-3">
              {ownedObjects.data.slice(0, 10).map((object, index) => (
                <div
                  key={object.data?.objectId || index}
                  className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-sm font-medium text-gray-900">
                          Object #{index + 1}
                        </span>
                        {object.data?.type && (
                          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                            {object.data.type.split('::').pop()}
                          </span>
                        )}
                      </div>
                      
                      <div className="space-y-1 text-sm">
                        <div className="flex items-center space-x-2">
                          <span className="text-gray-500">ID:</span>
                          <code className="text-xs bg-gray-100 px-1 py-0.5 rounded">
                            {formatAddress(object.data?.objectId || '', 6)}
                          </code>
                          <button
                            onClick={() => handleCopyObjectId(object.data?.objectId || '')}
                            className="text-gray-400 hover:text-gray-600"
                            title="Copy object ID"
                          >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                          </button>
                        </div>
                        
                        {object.data?.type && (
                          <div className="flex items-start space-x-2">
                            <span className="text-gray-500">Type:</span>
                            <code className="text-xs bg-gray-100 px-1 py-0.5 rounded break-all">
                              {object.data.type}
                            </code>
                          </div>
                        )}
                        
                        <div className="flex items-center space-x-2">
                          <span className="text-gray-500">Version:</span>
                          <span className="text-xs">{object.data?.version || 'Unknown'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {ownedObjects.data.length > 10 && (
              <div className="text-center pt-4">
                <p className="text-sm text-gray-500">
                  Showing first 10 objects. Total: {ownedObjects.data.length}+
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
