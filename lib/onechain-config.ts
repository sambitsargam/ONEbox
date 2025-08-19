// OneChain network configurations
export const ONECHAIN_NETWORKS = {
  testnet: {
    name: "OneChain Testnet",
    url: "https://rpc-testnet.onelabs.cc",
    faucetUrl: "https://faucet-testnet.onelabs.cc/v1/gas",
  },
  localnet: {
    name: "OneChain Localnet",
    url: "http://localhost:9000",
    faucetUrl: "http://localhost:9123/gas",
  },
} as const

export type NetworkType = keyof typeof ONECHAIN_NETWORKS
