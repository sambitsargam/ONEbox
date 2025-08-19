import { ONECHAIN_NETWORKS, type NetworkType } from "./onechain-config"

export interface FaucetRequest {
  FixedAmountRequest: {
    recipient: string
  }
}

export interface FaucetResponse {
  transferredGasObjects: Array<{
    amount: number
    id: string
    transferTxDigest: string
  }>
  error?: string
}

export async function requestFaucetTokens(
  recipient: string,
  network: NetworkType = "testnet",
): Promise<FaucetResponse> {
  const faucetUrl = ONECHAIN_NETWORKS[network].faucetUrl

  const response = await fetch(faucetUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      FixedAmountRequest: {
        recipient,
      },
    } as FaucetRequest),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Faucet request failed: ${response.status} ${errorText}`)
  }

  const data = await response.json()

  if (data.error) {
    throw new Error(data.error)
  }

  return data
}
