"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Bot, Briefcase, Copy, Github, Layers, Rocket, Shield, Sparkles } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

const AGENT_SKILL_URL = process.env.NEXT_PUBLIC_AGENT_SKILL_URL || "https://onebox-app.vercel.app/skill.md"

export default function HomePage() {
  const curlCommand = `curl -s ${AGENT_SKILL_URL}`
  const chatPrompt = "Hello."

  const copyText = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast.success(`${label} copied`)
    } catch {
      toast.error(`Failed to copy ${label.toLowerCase()}`)
    }
  }

  return (
    <div className="relative min-h-screen overflow-x-clip bg-[#f5f8f7] text-slate-900">
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-24 top-[-6rem] h-72 w-72 rounded-full bg-[#0d9488]/25 blur-3xl animate-float-slow" />
        <div className="absolute right-[-6rem] top-24 h-80 w-80 rounded-full bg-[#f97316]/20 blur-3xl animate-float-medium" />
        <div className="absolute bottom-[-8rem] left-1/3 h-96 w-96 rounded-full bg-[#0284c7]/18 blur-3xl animate-float-slow" />
      </div>

      <header className="sticky top-0 z-40 border-b border-white/30 bg-white/70 backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-5 py-5 sm:px-8">
          <div>
            <p className="text-xs font-semibold tracking-[0.18em] text-teal-700 uppercase">OneChain Build System</p>
            <h1 className="text-xl font-semibold text-slate-900 sm:text-2xl">ONEbox</h1>
          </div>
          <div className="flex items-center gap-3">
            <Badge className="rounded-full border border-teal-300 bg-teal-100 px-3 py-1 text-teal-800">
              Professional Workflow
            </Badge>
            <Link href="/dashboard">
              <Button className="rounded-full bg-slate-900 px-5 text-white hover:bg-slate-800">Dashboard</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-[82rem] flex-col gap-16 px-5 py-12 sm:px-8 lg:py-16">
        <section className="space-y-8">
          <div className="mx-auto w-full max-w-7xl space-y-8 animate-enter-up">
            <div className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr] lg:items-center">
              <div className="space-y-5">
                <Badge className="rounded-full border border-slate-300/60 bg-white/85 px-5 py-2 text-sm text-slate-700 shadow-sm">
                  <Sparkles className="mr-2 h-3.5 w-3.5 text-amber-500" />
                  Complete OneChain developer workspace
                </Badge>

                <div className="space-y-4">
                  <h2 className="text-5xl font-semibold leading-tight tracking-tight text-slate-900 sm:text-6xl lg:text-7xl xl:text-[4.8rem]">
                    Build, test, and ship
                    <span className="block bg-gradient-to-r from-[#0f766e] via-[#0284c7] to-[#f97316] bg-clip-text text-transparent">
                      OneChain applications
                    </span>
                    from one dashboard.
                  </h2>
                  <p className="max-w-3xl text-lg leading-relaxed text-slate-600 sm:text-xl lg:text-2xl">
                    ONEbox brings wallet connection, network switching, OCT faucet, live balances, PTB simulation,
                    transaction history, AI guidance, and docs into one place so you can move from setup to execution faster.
                  </p>
                </div>
              </div>

              <div className="relative hidden h-[240px] w-[240px] overflow-hidden rounded-2xl border border-white/70 bg-white/85 shadow-[0_20px_45px_rgba(2,8,23,0.08)] lg:ml-auto lg:translate-x-4 lg:flex lg:items-center lg:justify-center animate-float-medium">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(20,184,166,0.15),transparent_55%),radial-gradient(circle_at_70%_70%,rgba(14,165,233,0.16),transparent_52%)]" />
                <div className="absolute h-[170px] w-[170px] rounded-full border border-teal-200/80 animate-spin [animation-duration:14s]" />
                <div className="absolute h-[120px] w-[120px] rounded-full border border-sky-300/80 animate-spin [animation-duration:10s] [animation-direction:reverse]" />
                <div className="absolute left-8 top-7 h-2.5 w-2.5 rounded-full bg-teal-400 animate-pulse" />
                <div className="absolute bottom-8 right-7 h-2.5 w-2.5 rounded-full bg-sky-400 animate-pulse" />
                <div className="relative flex h-16 w-16 items-center justify-center rounded-xl border border-teal-300/70 bg-white/90 shadow-sm">
                  <Bot className="h-8 w-8 text-teal-700" />
                </div>
              </div>
            </div>


            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <Link href={`/chat?prompt=${encodeURIComponent(chatPrompt)}`}>
                <Button size="lg" className="h-14 rounded-full bg-[#0f766e] px-7 text-lg text-white hover:bg-[#115e59] sm:text-xl">
                  <Bot className="mr-2 h-5 w-5" />
                  Ask OneChain AI Assistant
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button
                  size="lg"
                  className="h-14 rounded-full bg-slate-900 px-7 text-lg text-white hover:bg-slate-800 sm:text-xl"
                >
                  Go to Dashboard
                </Button>
              </Link>
              <Link href="/docs">
                <Button
                  size="lg"
                  variant="outline"
                  className="h-14 rounded-full border-slate-300 bg-white/80 px-7 text-lg text-slate-700 hover:bg-white sm:text-xl"
                >
                  View Documentation
                </Button>
              </Link>
            </div>

            <Card className="relative w-full overflow-hidden rounded-3xl border-white/70 bg-white/90 p-5 shadow-[0_20px_50px_rgba(2,8,23,0.12)] animate-enter-up-delay sm:p-6">
              <div className="absolute right-5 top-5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                Developer Ready
              </div>
              <p className="text-xs font-semibold tracking-[0.14em] text-slate-500 uppercase">Automation Command</p>
              <h3 className="mt-3 text-2xl font-semibold text-slate-900 sm:text-3xl">Load ONEbox workflow into your agent</h3>
              <p className="mt-2 text-sm text-slate-600 sm:text-base">Use this when you want to scaffold and automate OneChain tasks from your coding agent.</p>

              <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50/80 p-3 sm:p-4">
                <p className="mb-1.5 text-sm font-medium text-slate-500">Curl Command</p>
                <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center">
                  <p className="flex-1 break-all font-mono text-sm text-slate-700 sm:text-base">{curlCommand}</p>
                  <Button
                    variant="outline"
                    size="default"
                    className="h-9 rounded-full px-4"
                    onClick={() => copyText(curlCommand, "Curl command")}
                  >
                    <Copy className="mr-1.5 h-4 w-4" />
                    Copy
                  </Button>
                </div>
              </div>
            </Card>


            <div className="grid gap-4 sm:grid-cols-3">
              <Card className="rounded-2xl border-white/70 bg-white/80 p-5 shadow-[0_10px_30px_rgba(2,8,23,0.06)]">
                <Rocket className="h-6 w-6 text-cyan-700" />
                <p className="mt-2 text-xs font-medium tracking-wide text-slate-500 uppercase">Fast Start</p>
                <p className="mt-1 text-base font-semibold text-slate-800">Connect wallet, switch network, and start in minutes</p>
              </Card>
              <Card className="rounded-2xl border-white/70 bg-white/80 p-5 shadow-[0_10px_30px_rgba(2,8,23,0.06)]">
                <Layers className="h-6 w-6 text-teal-700" />
                <p className="mt-2 text-xs font-medium tracking-wide text-slate-500 uppercase">Core Toolkit</p>
                <p className="mt-1 text-base font-semibold text-slate-800">Faucet, balances, PTB builder, and transaction tracking</p>
              </Card>
              <Card className="rounded-2xl border-white/70 bg-white/80 p-5 shadow-[0_10px_30px_rgba(2,8,23,0.06)]">
                <Shield className="h-6 w-6 text-orange-600" />
                <p className="mt-2 text-xs font-medium tracking-wide text-slate-500 uppercase">Guided Delivery</p>
                <p className="mt-1 text-base font-semibold text-slate-800">AI support plus docs to build confidently on testnet</p>
              </Card>
            </div>
          </div>
        </section>

        <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="rounded-2xl border-white/70 bg-white/80 p-6 shadow-[0_10px_30px_rgba(2,8,23,0.06)] animate-enter-up">
            <Briefcase className="h-6 w-6 text-[#0f766e]" />
            <h4 className="mt-3 text-lg font-semibold text-slate-900">Wallet and Network Control</h4>
            <p className="mt-1 text-base text-slate-600">Connect supported wallets, copy addresses, and switch OneChain networks.</p>
          </Card>
          <Card className="rounded-2xl border-white/70 bg-white/80 p-6 shadow-[0_10px_30px_rgba(2,8,23,0.06)] animate-enter-up-delay">
            <Bot className="h-6 w-6 text-[#0284c7]" />
            <h4 className="mt-3 text-lg font-semibold text-slate-900">AI Assistant and Support</h4>
            <p className="mt-1 text-base text-slate-600">Get help for Move, PTBs, smart contracts, and OneChain development flow.</p>
          </Card>
          <Card className="rounded-2xl border-white/70 bg-white/80 p-6 shadow-[0_10px_30px_rgba(2,8,23,0.06)] animate-enter-up">
            <Copy className="h-6 w-6 text-[#f97316]" />
            <h4 className="mt-3 text-lg font-semibold text-slate-900">Testnet Execution Toolkit</h4>
            <p className="mt-1 text-base text-slate-600">Request OCT, inspect balances and assets, run PTBs, and review transactions.</p>
          </Card>
          <Card className="rounded-2xl border-white/70 bg-white/80 p-6 shadow-[0_10px_30px_rgba(2,8,23,0.06)] animate-enter-up-delay">
            <Sparkles className="h-6 w-6 text-[#7c3aed]" />
            <h4 className="mt-3 text-lg font-semibold text-slate-900">Docs and Resources</h4>
            <p className="mt-1 text-base text-slate-600">Jump to SDK docs, explorer links, quick references, and onboarding guides.</p>
          </Card>
        </section>
      </main>

      <footer className="border-t border-white/40 bg-white/60 py-6 backdrop-blur-lg">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-3 px-5 text-sm text-slate-600 sm:flex-row sm:px-8">
          <p>ONEbox •.   Made with ❤️ for the OneChain Community</p>
          <div className="flex items-center gap-4">
            <Link href="/docs" className="hover:text-slate-900 transition-colors">Docs</Link>
            <a
              href="https://doc-testnet.onelabs.cc/typescript"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-slate-900 transition-colors"
            >
              TypeScript SDK
            </a>
            <a
              href="https://github.com/sambitsargam/ONEbox"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-slate-900 transition-colors"
            >
              <Github className="h-4 w-4" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
