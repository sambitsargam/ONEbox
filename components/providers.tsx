"use client"

import type React from "react"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { createNetworkConfig, SuiClientProvider, WalletProvider } from "@onelabs/dapp-kit"
import { getFullnodeUrl } from "@mysten/sui/client"
import { useState } from "react"
import { Toaster } from "sonner"

// Configure network for OneChain similar to your working example
const { networkConfig } = createNetworkConfig({
  testnet: { url: 'https://rpc-testnet.onelabs.cc:443' },
  localnet: { url: getFullnodeUrl('localnet') },
})

const queryClient = new QueryClient()

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <SuiClientProvider networks={networkConfig} defaultNetwork="testnet">
        <WalletProvider 
          autoConnect={true}
          enableUnsafeBurner={process.env.NODE_ENV === 'development'}
        >
          {children}
          <Toaster position="top-right" />
        </WalletProvider>
      </SuiClientProvider>
    </QueryClientProvider>
  )
}
