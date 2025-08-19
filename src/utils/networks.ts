export const NETWORKS = {
  testnet: {
    name: 'OneChain Testnet',
    rpc: 'https://rpc-testnet.onelabs.cc:443',
    faucet: 'https://faucet-testnet.onelabs.cc',
  },
  localnet: {
    name: 'OneChain Localnet',
    rpc: 'http://127.0.0.1:9000',
    faucet: 'http://127.0.0.1:9123',
  },
} as const;

export const DEFAULT_NETWORK = 'testnet';

export const FAUCET_ENDPOINTS = {
  testnet: 'https://faucet-testnet.onelabs.cc/v1/gas',
  localnet: 'http://127.0.0.1:9123/gas',
} as const;

export type NetworkType = keyof typeof NETWORKS;
