"use client"

import { WalletSection } from "@/components/wallet-section"
import { FaucetSection } from "@/components/faucet-section"
import { BalanceSection } from "@/components/balance-section"
import { PTBSection } from "@/components/ptb-section"
import { TransactionSection } from "@/components/transaction-section"
import { OnboardingBanner } from "@/components/onboarding-banner"
import { useCurrentAccount } from "@onelabs/dapp-kit"

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
              <div className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                Testnet
              </div>
              {currentAccount && (
                <div className="hidden sm:flex items-center gap-2 rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                  <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                  Connected
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {!currentAccount && <OnboardingBanner />}

        <div className="grid gap-6 lg:gap-8 xl:grid-cols-2">
          {/* Left Column */}
          <div className="space-y-6 lg:space-y-8">
            <WalletSection />
            <FaucetSection />
            <BalanceSection />
          </div>

          {/* Right Column */}
          <div className="space-y-6 lg:space-y-8">
            <PTBSection />
            <TransactionSection />
          </div>
        </div>

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
            </div>
            <div className="text-xs">Made with ❤️ for the OneChain community</div>
          </div>
        </footer>
      </main>
    </div>
  )
}
