"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useCurrentAccount, useConnectWallet, useDisconnectWallet, useSuiClientContext, useWallets } from "@onelabs/dapp-kit"
import { Wallet, Copy, LogOut, Network } from "lucide-react"
import { toast } from "sonner"
import { ONECHAIN_NETWORKS, type NetworkType } from "@/lib/onechain-config"
import { logWalletDebugInfo } from "@/lib/wallet-utils"
import { useEffect } from "react"

export function WalletSection() {
  const currentAccount = useCurrentAccount()
  const { mutate: connect } = useConnectWallet()
  const { mutate: disconnect } = useDisconnectWallet()
  const { selectNetwork, network } = useSuiClientContext()
  const wallets = useWallets()

  // Debug logging
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      logWalletDebugInfo()
      console.log('Available wallets from useWallets:', wallets)
    }
  }, [wallets])

  const handleConnect = async () => {
    try {
      // Find the first available wallet
      const availableWallet = wallets.find(wallet => {
        // Check if wallet has connect feature and is properly initialized
        return wallet && wallet.features && wallet.features['standard:connect']
      })
      
      if (!availableWallet) {
        toast.error("No compatible wallet found. Please install a Sui-compatible wallet.")
        return
      }

      connect(
        { wallet: availableWallet },
        {
          onSuccess: () => {
            toast.success(`Wallet connected successfully!`)
          },
          onError: (error) => {
            console.error("Wallet connection error:", error)
            const errorMessage = error?.message || error?.toString() || 'Unknown error occurred'
            toast.error(`Failed to connect wallet: ${errorMessage}`)
          },
        },
      )
    } catch (error) {
      console.error("Connect function error:", error)
      toast.error("Failed to initialize wallet connection")
    }
  }

  const handleDisconnect = () => {
    disconnect()
    toast.success("Wallet disconnected")
  }

  const copyAddress = async () => {
    if (currentAccount?.address) {
      await navigator.clipboard.writeText(currentAccount.address)
      toast.success("Address copied to clipboard")
    }
  }

  const handleNetworkChange = (networkName: NetworkType) => {
    selectNetwork(networkName)
    toast.success(`Switched to ${ONECHAIN_NETWORKS[networkName].name}`)
  }

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  return (
    <Card className="shadow-sm border-slate-200/60 bg-white/60 backdrop-blur-sm dark:border-slate-700/60 dark:bg-slate-800/60">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <Wallet className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          Wallet Connection
        </CardTitle>
        <CardDescription className="text-slate-600 dark:text-slate-400">
          Connect your wallet to start building on OneChain
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {currentAccount ? (
          <>
            {/* Connected Wallet Info */}
            <div className="rounded-lg border border-slate-200 bg-slate-50/50 p-4 dark:border-slate-700 dark:bg-slate-800/50">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-green-500"></div>
                  <span className="text-sm font-medium text-slate-900 dark:text-slate-100">Connected</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDisconnect}
                  className="h-8 px-2 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex items-center gap-2 mb-3">
                <code className="text-sm font-mono text-slate-700 dark:text-slate-300">
                  {formatAddress(currentAccount.address)}
                </code>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={copyAddress}
                  className="h-6 w-6 p-0 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                >
                  <Copy className="h-3 w-3" />
                </Button>
              </div>

              <Badge variant="secondary" className="text-xs">
                {currentAccount.chains?.[0] || "OneChain"}
              </Badge>
            </div>

            {/* Network Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <Network className="h-4 w-4" />
                Network
              </label>
              <Select value={network} onValueChange={handleNetworkChange}>
                <SelectTrigger className="bg-white/80 border-slate-200 dark:bg-slate-800/80 dark:border-slate-700">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(ONECHAIN_NETWORKS).map(([key, config]) => (
                    <SelectItem key={key} value={key}>
                      {config.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </>
        ) : (
          <>
            {/* Connect Wallet */}
            <div className="rounded-lg border border-slate-200 bg-slate-50/50 p-4 dark:border-slate-700 dark:bg-slate-800/50">
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                {wallets.length > 0 ? "No wallet connected" : "No wallet detected"}
              </p>
              
              {wallets.length > 0 ? (
                <Button onClick={handleConnect} className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-sm">
                  Connect Wallet
                </Button>
              ) : (
                <div className="space-y-2">
                  <p className="text-xs text-slate-500 dark:text-slate-500">
                    Please install a Sui-compatible wallet like:
                  </p>
                  <ul className="text-xs text-slate-500 dark:text-slate-500 list-disc list-inside space-y-1">
                    <li>Sui Wallet</li>
                    <li>Ethos Wallet</li>
                    <li>Suiet Wallet</li>
                  </ul>
                </div>
              )}
            </div>

            <div className="text-xs text-slate-500 dark:text-slate-500">
              <p>Supported networks: OneChain Testnet, Localnet</p>
              {wallets.length > 0 && (
                <p className="mt-1">Detected wallets: {wallets.map(w => w.name).join(", ")}</p>
              )}
            </div>
          </>
        )}

        {/* Development Burner Wallet */}
        {process.env.NODE_ENV === "development" && (
          <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
            <Button
              variant="outline"
              size="sm"
              className="w-full text-xs text-slate-600 dark:text-slate-400 bg-transparent"
              onClick={() => toast.info("Burner wallet feature coming soon")}
            >
              Generate Dev Burner Wallet
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
