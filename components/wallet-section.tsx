"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useCurrentAccount, useConnectWallet, useCurrentWallet, useDisconnectWallet, useSuiClientContext, useWallets } from "@onelabs/dapp-kit"
import { Ed25519Keypair } from "@onelabs/sui/keypairs/ed25519"
import { toBase64 } from "@onelabs/sui/utils"
import { Wallet, Copy, LogOut, Network } from "lucide-react"
import { toast } from "sonner"
import { ONECHAIN_NETWORKS, type NetworkType } from "@/lib/onechain-config"
import { logWalletDebugInfo } from "@/lib/wallet-utils"
import { useEffect, useState } from "react"

const DEV_BURNER_RECONNECT_KEY = "onebox:dev-burner:reconnect"
const isUnsafeBurnerEnabled = true

type ExportableDevKeypair = {
  address: string
  publicKeyBase64: string
  privateKeyBech32: string
}

export function WalletSection() {
  const currentAccount = useCurrentAccount()
  const { currentWallet } = useCurrentWallet()
  const { mutateAsync: connectWallet } = useConnectWallet()
  const { mutateAsync: disconnectWallet } = useDisconnectWallet()
  const { selectNetwork, network } = useSuiClientContext()
  const wallets = useWallets()
  const [isClient, setIsClient] = useState(false)
  const [exportableKeypair, setExportableKeypair] = useState<ExportableDevKeypair | null>(null)
  const burnerWallet = wallets.find((wallet) => wallet?.name === "Unsafe Burner Wallet")

  // Ensure we're on the client side to prevent hydration mismatch
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Debug logging
  useEffect(() => {
    if (process.env.NODE_ENV === 'development' && isClient) {
      logWalletDebugInfo()
      console.log('Available wallets from useWallets:', wallets)
    }
  }, [wallets, isClient])

  useEffect(() => {
    const shouldReconnect =
      isUnsafeBurnerEnabled &&
      isClient &&
      typeof window !== "undefined" &&
      window.sessionStorage.getItem(DEV_BURNER_RECONNECT_KEY) === "1"

    if (!shouldReconnect || !burnerWallet) {
      return
    }

    const reconnectBurner = async () => {
      try {
        window.sessionStorage.removeItem(DEV_BURNER_RECONNECT_KEY)

        if (currentWallet && currentWallet.name !== burnerWallet.name) {
          await disconnectWallet()
        }

        await connectWallet({ wallet: burnerWallet })
        toast.success("Dev Burner Wallet regenerated and connected")
      } catch (error) {
        console.error("Dev Burner Wallet post-reload connection error:", error)
        const errorMessage = error instanceof Error ? error.message : "Unknown error occurred"
        toast.error(`Failed to reconnect regenerated Dev Burner Wallet: ${errorMessage}`)
      }
    }

    void reconnectBurner()
  }, [burnerWallet, connectWallet, currentWallet, disconnectWallet, isClient])

  const handleConnect = async () => {
    try {
      // Prioritize OneChain wallet detection
      let availableWallet = wallets.find(wallet => {
        return wallet && wallet.name && (
          wallet.name.toLowerCase().includes('onechain') ||
          wallet.name.toLowerCase().includes('onelabs')
        ) && wallet.features && wallet.features['standard:connect']
      })
      
      // Fallback to any wallet with connect feature
      if (!availableWallet) {
        availableWallet = wallets.find(wallet => {
          return wallet && wallet.features && wallet.features['standard:connect']
        })
      }
      
      if (!availableWallet) {
        toast.error("No OneChain wallet found. Please install the OneChain wallet extension.")
        return
      }

      console.log('Connecting to wallet:', availableWallet.name)

      await connectWallet({ wallet: availableWallet })
      toast.success(`Connected to ${availableWallet.name} successfully!`)
    } catch (error) {
      console.error("Connect function error:", error)
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred"
      toast.error(`Failed to connect wallet: ${errorMessage}`)
    }
  }

  const handleDisconnect = async () => {
    try {
      await disconnectWallet()
      toast.success("Wallet disconnected")
    } catch (error) {
      console.error("Disconnect function error:", error)
      toast.error("Failed to disconnect wallet")
    }
  }

  const handleGenerateDevBurnerWallet = async () => {
    try {
      if (currentWallet) {
        await disconnectWallet()
      }

      if (typeof window !== "undefined") {
        window.sessionStorage.setItem(DEV_BURNER_RECONNECT_KEY, "1")
      }

      toast.info("Regenerating Dev Burner Wallet...")
      window.location.reload()
    } catch (error) {
      console.error("Dev Burner Wallet connection error:", error)
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred"
      toast.error(`Failed to generate Dev Burner Wallet: ${errorMessage}`)
    }
  }

  const copyAddress = async () => {
    if (currentAccount?.address) {
      await navigator.clipboard.writeText(currentAccount.address)
      toast.success("Address copied to clipboard")
    }
  }

  const handleGenerateExportableKeypair = () => {
    try {
      const keypair = Ed25519Keypair.generate()
      setExportableKeypair({
        address: keypair.toSuiAddress(),
        publicKeyBase64: toBase64(keypair.getPublicKey().toRawBytes()),
        privateKeyBech32: keypair.getSecretKey(),
      })
      toast.success("Generated exportable dev keypair")
    } catch (error) {
      console.error("Generate exportable keypair error:", error)
      toast.error("Failed to generate exportable keypair")
    }
  }

  const copyText = async (value: string, label: string) => {
    try {
      await navigator.clipboard.writeText(value)
      toast.success(`${label} copied`)
    } catch {
      toast.error(`Failed to copy ${label.toLowerCase()}`)
    }
  }

  const handleNetworkChange = (networkName: NetworkType) => {
    selectNetwork(networkName)
    toast.success(`Switched to ${ONECHAIN_NETWORKS[networkName].name}`)
  }

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  // Show loading state during hydration to prevent mismatch
  if (!isClient) {
    return (
      <Card className="shadow-sm border-slate-200/60 bg-white/60 backdrop-blur-sm dark:border-slate-700/60 dark:bg-slate-800/60">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
            <Wallet className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            Wallet Connection
          </CardTitle>
          <CardDescription className="text-slate-600 dark:text-slate-400">
            Connect your OneChain wallet to start building on OneChain network
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg border border-slate-200 bg-slate-50/50 p-4 dark:border-slate-700 dark:bg-slate-800/50">
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">Loading...</p>
            <div className="w-full h-10 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="shadow-sm border-slate-200/60 bg-white/60 backdrop-blur-sm dark:border-slate-700/60 dark:bg-slate-800/60">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <Wallet className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          Wallet Connection
        </CardTitle>
        <CardDescription className="text-slate-600 dark:text-slate-400">
          Connect your OneChain wallet to start building on OneChain network
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
                { "OneChain"}
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
                No wallet connected
              </p>
              
              {wallets.length > 0 ? (
                <Button onClick={handleConnect} className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-sm">
                  Connect OneChain Wallet
                </Button>
              ) : (
                <div className="space-y-2">
                  <p className="text-xs text-slate-500 dark:text-slate-500">
                    Please install the OneChain wallet extension:
                  </p>
                  <ul className="text-xs text-slate-500 dark:text-slate-500 list-disc list-inside space-y-1">
                    <li>OneChain Wallet Extension</li>
                    <li>OneLabs Wallet (if available)</li>
                  </ul>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full mt-2"
                    onClick={() => window.open('https://chrome.google.com/webstore', '_blank')}
                  >
                    Install OneChain Wallet
                  </Button>
                </div>
              )}
            </div>

            <div className="text-xs text-slate-500 dark:text-slate-500">
              <p>Supported networks: OneChain Testnet, OneChain Localnet</p>
              {wallets.length > 0 && (
                <p className="mt-1">Detected wallets: {wallets.map(w => w.name).join(", ")}</p>
              )}
            </div>
          </>
        )}

        {/* Development Burner Wallet */}
        {process.env.NODE_ENV === "development" && (
          <div className="pt-4 border-t border-slate-200 dark:border-slate-700 space-y-3">
            <Button
              variant="outline"
              size="sm"
              className="w-full text-xs text-slate-600 dark:text-slate-400 bg-transparent"
              onClick={handleGenerateDevBurnerWallet}
            >
              Generate Dev Burner Wallet
            </Button>

            <Button
              variant="outline"
              size="sm"
              className="w-full text-xs text-slate-600 dark:text-slate-400 bg-transparent"
              onClick={handleGenerateExportableKeypair}
            >
              Generate Exportable Dev Keypair
            </Button>

            {exportableKeypair && (
              <div className="rounded-lg border border-amber-200 bg-amber-50/70 p-3 dark:border-amber-900/60 dark:bg-amber-900/20 space-y-2">
                <p className="text-xs text-amber-800 dark:text-amber-200 font-medium">
                  Dev keypair (keep private key secret)
                </p>

                <div className="space-y-1">
                  <p className="text-[11px] text-slate-600 dark:text-slate-400">Address</p>
                  <div className="flex items-center gap-2">
                    <p className="text-[11px] font-mono break-all text-slate-800 dark:text-slate-200">{exportableKeypair.address}</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={() => copyText(exportableKeypair.address, "Address")}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-1">
                  <p className="text-[11px] text-slate-600 dark:text-slate-400">Public Key (Base64)</p>
                  <div className="flex items-center gap-2">
                    <p className="text-[11px] font-mono break-all text-slate-800 dark:text-slate-200">{exportableKeypair.publicKeyBase64}</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={() => copyText(exportableKeypair.publicKeyBase64, "Public key")}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-1">
                  <p className="text-[11px] text-slate-600 dark:text-slate-400">Private Key (Bech32)</p>
                  <div className="flex items-center gap-2">
                    <p className="text-[11px] font-mono break-all text-slate-800 dark:text-slate-200">{exportableKeypair.privateKeyBech32}</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={() => copyText(exportableKeypair.privateKeyBech32, "Private key")}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
