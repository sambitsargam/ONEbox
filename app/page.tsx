"use client"

import { WalletSection } from "@/components/wallet-section"
import { FaucetSection } from "@/components/faucet-section"
import { BalanceSection } from "@/components/balance-section"
import { PTBSection } from "@/components/ptb-section"
import { TransactionSection } from "@/components/transaction-section"
import { OnboardingBanner } from "@/components/onboarding-banner"
import { useCurrentAccount } from "@onelabs/dapp-kit"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Wallet, Zap, Code, History, Coins, TestTube, Bot, MessageCircle } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  const currentAccount = useCurrentAccount()

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-slate-200/60 bg-white/80 backdrop-blur-sm dark:border-slate-700/60 dark:bg-slate-900/80">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">ONEbox</h1>
              <p className="text-sm text-slate-600 dark:text-slate-400">OneChain Development Portal</p>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                Testnet
              </Badge>
              {currentAccount && (
                <Badge variant="secondary" className="hidden sm:flex items-center gap-2 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                  <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                  Connected
                </Badge>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      {!currentAccount && (
        <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
          <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] dark:bg-grid-slate-700/25 dark:[mask-image:linear-gradient(0deg,rgba(255,255,255,0.1),rgba(255,255,255,0.5))]"></div>
          <div className="relative container mx-auto px-4 py-16 sm:py-24">
            <div className="text-center">
              <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-6xl dark:text-white">
                Build on{" "}
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  OneChain
                </span>
              </h1>
              <p className="mt-6 text-lg leading-8 text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
                Complete development toolkit for OneChain blockchain. Test transactions, manage wallets, 
                explore the ecosystem, and build the future of decentralized applications.
              </p>
              <div className="mt-10 flex items-center justify-center gap-x-6">
                <Button 
                  size="lg" 
                  className="bg-blue-600 hover:bg-blue-700"
                  onClick={() => {
                    const walletSection = document.querySelector('#wallet-section');
                    if (walletSection) {
                      walletSection.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                >
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  onClick={() => window.open('https://doc-testnet.onelabs.cc', '_blank')}
                >
                  View Documentation
                </Button>
              </div>
            </div>

            {/* Feature Cards */}
            <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="p-6 hover:shadow-lg transition-shadow">
                <Wallet className="h-10 w-10 text-blue-600 mb-4" />
                <h3 className="text-lg font-semibold mb-2">Wallet Integration</h3>
                <p className="text-slate-600 dark:text-slate-300 text-sm">
                  Connect and manage OneChain wallets with seamless integration
                </p>
              </Card>
              <Card className="p-6 hover:shadow-lg transition-shadow">
                <Bot className="h-10 w-10 text-purple-600 mb-4" />
                <h3 className="text-lg font-semibold mb-2">AI Assistant</h3>
                <p className="text-slate-600 dark:text-slate-300 text-sm">
                  ChatGPT-powered assistant for OneChain development questions
                </p>
              </Card>
              <Card className="p-6 hover:shadow-lg transition-shadow">
                <TestTube className="h-10 w-10 text-emerald-600 mb-4" />
                <h3 className="text-lg font-semibold mb-2">PTB Simulator</h3>
                <p className="text-slate-600 dark:text-slate-300 text-sm">
                  Test programmable transaction blocks before deployment
                </p>
              </Card>
              <Card className="p-6 hover:shadow-lg transition-shadow">
                <Coins className="h-10 w-10 text-orange-600 mb-4" />
                <h3 className="text-lg font-semibold mb-2">Testnet Faucet</h3>
                <p className="text-slate-600 dark:text-slate-300 text-sm">
                  Get test tokens instantly for development and testing
                </p>
              </Card>
              <Card className="p-6 hover:shadow-lg transition-shadow">
                <History className="h-10 w-10 text-red-600 mb-4" />
                <h3 className="text-lg font-semibold mb-2">Transaction History</h3>
                <p className="text-slate-600 dark:text-slate-300 text-sm">
                  Comprehensive transaction tracking and analysis
                </p>
              </Card>
              <Card className="p-6 hover:shadow-lg transition-shadow">
                <Code className="h-10 w-10 text-indigo-600 mb-4" />
                <h3 className="text-lg font-semibold mb-2">Developer Tools</h3>
                <p className="text-slate-600 dark:text-slate-300 text-sm">
                  Advanced debugging and development utilities
                </p>
              </Card>
            </div>
          </div>
        </section>
      )}

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {!currentAccount && <OnboardingBanner />}

        <div className="grid gap-6 lg:gap-8 xl:grid-cols-2">
          {/* Left Column */}
          <div className="space-y-6 lg:space-y-8">
            <div id="wallet-section">
              <WalletSection />
            </div>
            <FaucetSection />
            <BalanceSection />
          </div>

          {/* Right Column */}
          <div className="space-y-6 lg:space-y-8">
            {/* Chat AI Card */}
            <Card className="shadow-sm border-slate-200/60 bg-white/60 backdrop-blur-sm dark:border-slate-700/60 dark:bg-slate-800/60">
              <div className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Bot className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">OneChain AI Assistant</h3>
                  <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 text-xs">
                    ChatGPT Powered
                  </Badge>
                </div>
                <p className="text-slate-600 dark:text-slate-400 text-sm mb-4">
                  Get instant help with OneChain development, Move programming, PTBs, and more. Powered by ChatGPT with comprehensive OneChain knowledge.
                </p>
                <div className="space-y-3">
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    Ask me about:
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="text-xs">Move Programming</Badge>
                    <Badge variant="outline" className="text-xs">PTB Development</Badge>
                    <Badge variant="outline" className="text-xs">Wallet Integration</Badge>
                    <Badge variant="outline" className="text-xs">Smart Contracts</Badge>
                  </div>
                  <Link href="/chat">
                    <Button className="w-full mt-4 bg-blue-600 hover:bg-blue-700">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Start Chat with AI
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
            
            <PTBSection />
            <TransactionSection />
          </div>
        </div>

        {/* Stats Section */}
        {currentAccount && (
          <section className="mt-16 py-12 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-slate-800 dark:to-slate-700 rounded-2xl">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-8">
                OneChain Development Statistics
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div>
                  <div className="text-3xl font-bold text-blue-600">10+</div>
                  <div className="text-slate-600 dark:text-slate-300">PTB Presets</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-purple-600">∞</div>
                  <div className="text-slate-600 dark:text-slate-300">Test Tokens</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-emerald-600">24/7</div>
                  <div className="text-slate-600 dark:text-slate-300">Network Access</div>
                </div>
              </div>
            </div>
          </section>
        )}

        <footer className="mt-16 pt-8 border-t border-slate-200/60 dark:border-slate-700/60">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-4">
              <span>Built for OneChain developers</span>
              <span className="hidden sm:inline">•</span>
              <a
                href="https://doc-testnet.onelabs.cc/typescript"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
              >
                TypeScript SDK Docs
              </a>
              <span className="hidden sm:inline">•</span>
              <a
                href="https://onescan.cc"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
              >
                OneChain Explorer
              </a>
            </div>
            <div className="text-xs">Made with ❤️ for the OneChain community</div>
          </div>
        </footer>
      </main>
    </div>
  )
}
