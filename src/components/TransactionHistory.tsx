import { useCurrentAccount, useSuiClientQuery } from '@onelabs/dapp-kit';
import { formatAddress, formatTimeAgo, copyToClipboard } from '../utils/formatting';
import { useToast } from '../hooks/useToast';

export const TransactionHistory = () => {
  const currentAccount = useCurrentAccount();
  const { showSuccess } = useToast();

  // Get transaction history for the current account
  const { data: transactions, isLoading, error } = useSuiClientQuery(
    'queryTransactionBlocks',
    {
      filter: {
        FromAddress: currentAccount?.address || '',
      },
      options: {
        showInput: true,
        showEffects: true,
        showEvents: true,
        showObjectChanges: true,
        showBalanceChanges: true,
      },
      limit: 20,
    },
    {
      enabled: !!currentAccount?.address,
    }
  );

  const handleCopyDigest = async (digest: string) => {
    const success = await copyToClipboard(digest);
    if (success) {
      showSuccess('Transaction digest copied to clipboard!');
    }
  };

  if (!currentAccount) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-3xl">📊</span>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Transaction History</h2>
        <p className="text-gray-600 max-w-md mx-auto">
          Connect your wallet to view your transaction history on OneChain Testnet.
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="w-8 h-8 border-3 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600">Loading transaction history...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-3xl">❌</span>
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Error Loading History</h2>
        <p className="text-gray-600">Failed to load transaction history. Please try again.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Transaction History</h2>
        <p className="text-gray-600">Your recent transactions on OneChain Testnet</p>
      </div>

      <div className="bg-white rounded-xl shadow-soft border border-gray-100 p-6">
        {!transactions?.data || transactions.data.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl">📊</span>
            </div>
            <p className="text-gray-600">No transactions found</p>
            <p className="text-sm text-gray-500 mt-1">
              Your transaction history will appear here
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-sm text-gray-600 mb-4">
              Showing {transactions.data.length} recent transactions
            </div>
            
            {transactions.data.map((tx, index) => (
              <div
                key={tx.digest}
                className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className={`
                      w-3 h-3 rounded-full
                      ${tx.effects?.status?.status === 'success' ? 'bg-green-400' : 'bg-red-400'}
                    `}></div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-gray-900">
                          Transaction #{index + 1}
                        </span>
                        <span className={`
                          text-xs px-2 py-1 rounded
                          ${tx.effects?.status?.status === 'success' 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-red-100 text-red-700'
                          }
                        `}>
                          {tx.effects?.status?.status || 'Unknown'}
                        </span>
                      </div>
                      <div className="text-sm text-gray-500">
                        {tx.timestampMs && formatTimeAgo(tx.timestampMs)}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  {/* Transaction Digest */}
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-500 w-16">Digest:</span>
                    <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                      {formatAddress(tx.digest, 8)}
                    </code>
                    <button
                      onClick={() => handleCopyDigest(tx.digest)}
                      className="text-gray-400 hover:text-gray-600"
                      title="Copy transaction digest"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </button>
                  </div>

                  {/* Gas Used */}
                  {tx.effects?.gasUsed && (
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-500 w-16">Gas:</span>
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                        {parseInt(tx.effects.gasUsed.computationCost).toLocaleString()} MIST
                      </span>
                    </div>
                  )}

                  {/* Checkpoint */}
                  {tx.checkpoint && (
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-500 w-16">Block:</span>
                      <span className="text-xs">{tx.checkpoint}</span>
                    </div>
                  )}

                  {/* Balance Changes */}
                  {tx.balanceChanges && tx.balanceChanges.length > 0 && (
                    <div className="mt-3">
                      <span className="text-gray-500 text-xs">Balance Changes:</span>
                      <div className="mt-1 space-y-1">
                        {tx.balanceChanges.slice(0, 3).map((change, changeIndex) => (
                          <div key={changeIndex} className="text-xs bg-gray-50 p-2 rounded">
                            <div className="flex items-center justify-between">
                              <span>{change.coinType === '0x2::sui::SUI' ? 'OCT' : 'Token'}</span>
                              <span className={`font-medium ${
                                parseInt(change.amount) > 0 ? 'text-green-600' : 'text-red-600'
                              }`}>
                                {parseInt(change.amount) > 0 ? '+' : ''}{change.amount} MIST
                              </span>
                            </div>
                          </div>
                        ))}
                        {tx.balanceChanges.length > 3 && (
                          <div className="text-xs text-gray-500">
                            +{tx.balanceChanges.length - 3} more changes
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Error Message */}
                  {tx.effects?.status?.status !== 'success' && tx.effects?.status?.error && (
                    <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded">
                      <span className="text-xs text-red-700">
                        Error: {tx.effects.status.error}
                      </span>
                    </div>
                  )}
                </div>

                {/* Expandable Details */}
                <details className="group mt-3">
                  <summary className="cursor-pointer text-xs text-blue-600 hover:text-blue-700">
                    Show full details
                  </summary>
                  <div className="mt-2 p-3 bg-gray-50 rounded text-xs">
                    <pre className="overflow-x-auto whitespace-pre-wrap">
                      {JSON.stringify(tx, null, 2)}
                    </pre>
                  </div>
                </details>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
