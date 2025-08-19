import { ONECHAIN_NETWORKS, type NetworkType } from "./onechain-config"

export interface TransactionHistoryResponse {
  data: Array<{
    digest: string
    timestampMs?: string | null
    checkpoint?: string
    effects?: {
      status: { status: string }
      gasUsed?: {
        computationCost: string
        storageCost: string
        storageRebate: string
        nonRefundableStorageFee: string
      }
    }
    transaction?: {
      data?: {
        sender?: string
        gasData?: {
          budget: string
        }
      }
    }
  }>
  hasNextPage: boolean
  nextCursor?: string
}

// Alternative API using OneChain explorer API
export async function fetchTransactionHistoryFromExplorer(
  address: string,
  network: NetworkType = "testnet",
): Promise<TransactionHistoryResponse> {
  console.log('Fetching from OneChain explorer API for:', address)
  
  try {
    // Try to fetch from OneChain explorer API
    const explorerUrl = `https://onescan.cc/api/testnet/account/transactions?address=${address}&limit=20`
    
    const response = await fetch(explorerUrl, {
      method: "GET",
      headers: {
        "Accept": "application/json",
      },
    })

    console.log('Explorer API response status:', response.status)

    if (response.ok) {
      const data = await response.json()
      console.log('Explorer API response:', data)
      
      // Transform explorer data to our format
      if (data && Array.isArray(data)) {
        const transformedData = data.map((tx: any) => ({
          digest: tx.hash || tx.digest || tx.id,
          timestampMs: tx.timestamp ? (new Date(tx.timestamp).getTime()).toString() : null,
          checkpoint: tx.checkpoint,
          effects: {
            status: { status: tx.status || 'success' },
            gasUsed: tx.gasUsed || tx.gas
          },
          transaction: {
            data: {
              sender: tx.from || tx.sender,
              gasData: {
                budget: tx.gasLimit || tx.gasUsed?.computationCost
              }
            }
          }
        }))
        
        return {
          data: transformedData,
          hasNextPage: false
        }
      }
    }
  } catch (error) {
    console.error('Explorer API error:', error)
  }

  return { data: [], hasNextPage: false }
}

export async function fetchTransactionHistory(
  address: string,
  network: NetworkType = "testnet",
): Promise<TransactionHistoryResponse> {
  const rpcUrl = ONECHAIN_NETWORKS[network].url

  console.log('Fetching transaction history from:', rpcUrl)
  console.log('For address:', address)

  try {
    // Try multiple query methods to find transactions
    const queries = [
      // Method 1: Query by FromAddress
      {
        filter: { FromAddress: address },
        name: "FromAddress"
      },
      // Method 2: Query by ToAddress  
      {
        filter: { ToAddress: address },
        name: "ToAddress"
      },
      // Method 3: Query by InputObject (for any interaction)
      {
        filter: { InputObject: address },
        name: "InputObject"
      },
      // Method 4: Query by ChangedObject (for balance changes)
      {
        filter: { ChangedObject: address },
        name: "ChangedObject"
      }
    ]

    for (const query of queries) {
      console.log(`Trying ${query.name} query...`)
      
      const response = await fetch(rpcUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: 1,
          method: "suix_queryTransactionBlocks",
          params: [
            {
              filter: query.filter,
              options: {
                showInput: true,
                showEffects: true,
                showEvents: true,
                showObjectChanges: true,
                showBalanceChanges: true,
              },
              limit: 50,
              order: "descending",
            },
          ],
        }),
      })

      console.log(`${query.name} response status:`, response.status)

      if (response.ok) {
        const data = await response.json()
        console.log(`${query.name} response:`, data)

        if (data.result && data.result.data && data.result.data.length > 0) {
          console.log(`Found ${data.result.data.length} transactions with ${query.name}`)
          return data.result
        }
      }
    }

    // If no results from any query, try a simpler approach
    console.log('Trying simple transaction query...')
    const simpleResponse = await fetch(rpcUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "suix_queryTransactionBlocks",
        params: [
          {
            filter: {},
            options: {
              showInput: true,
              showEffects: true,
            },
            limit: 10,
            order: "descending",
          },
        ],
      }),
    })

    if (simpleResponse.ok) {
      const simpleData = await simpleResponse.json()
      console.log('Simple query response:', simpleData)
      
      if (simpleData.result) {
        // Filter transactions that involve our address
        const filteredTxs = simpleData.result.data?.filter((tx: any) => {
          const sender = tx.transaction?.data?.sender
          const recipient = tx.effects?.mutated?.some((obj: any) => 
            obj.owner?.AddressOwner === address
          )
          return sender === address || recipient
        }) || []
        
        return {
          data: filteredTxs,
          hasNextPage: false
        }
      }
    }

    return { data: [], hasNextPage: false }

  } catch (error) {
    console.error('Transaction history fetch error:', error)
    throw error
  }
}
