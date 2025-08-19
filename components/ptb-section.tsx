"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { useCurrentAccount, useSignAndExecuteTransaction, useSuiClient } from "@onelabs/dapp-kit"
import { useMutation } from "@tanstack/react-query"
import { Code2, Play, Send, Plus, Trash2, Copy, AlertCircle, CheckCircle } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import { PTB_PRESETS, createTransactionFromSteps, type PTBStep } from "@/lib/ptb-presets"

export function PTBSection() {
  const currentAccount = useCurrentAccount()
  const suiClient = useSuiClient()
  const { mutate: signAndExecute } = useSignAndExecuteTransaction()

  const [selectedPreset, setSelectedPreset] = useState<string>("")
  const [customSteps, setCustomSteps] = useState<PTBStep[]>([])
  const [params, setParams] = useState<Record<string, string>>({
    recipient: "",
    amount: "1000000000", // 1 OCT in MIST
  })
  const [simulationResult, setSimulationResult] = useState<any>(null)
  const [executionResult, setExecutionResult] = useState<any>(null)

  const simulateMutation = useMutation({
    mutationFn: async (steps: PTBStep[]) => {
      if (!currentAccount?.address) throw new Error("No wallet connected")

      const tx = createTransactionFromSteps(steps, {
        ...params,
        address: currentAccount.address,
      })

      const result = await suiClient.dryRunTransactionBlock({
        transactionBlock: await tx.build({ client: suiClient }),
      })

      return result
    },
    onSuccess: (result) => {
      setSimulationResult(result)
      toast.success("Transaction simulation completed!")
    },
    onError: (error) => {
      toast.error(`Simulation failed: ${error.message}`)
      setSimulationResult({ error: error.message })
    },
  })

  const executeMutation = useMutation({
    mutationFn: async (steps: PTBStep[]) => {
      if (!currentAccount?.address) throw new Error("No wallet connected")

      const tx = createTransactionFromSteps(steps, {
        ...params,
        address: currentAccount.address,
      })

      return new Promise((resolve, reject) => {
        signAndExecute(
          { transaction: tx },
          {
            onSuccess: (result) => {
              setExecutionResult(result)
              resolve(result)
            },
            onError: reject,
          },
        )
      })
    },
    onSuccess: (result: any) => {
      toast.success(`Transaction executed! Digest: ${result.digest}`)
    },
    onError: (error) => {
      toast.error(`Execution failed: ${error.message}`)
      setExecutionResult({ error: error.message })
    },
  })

  const handlePresetSelect = (presetId: string) => {
    const preset = PTB_PRESETS.find((p) => p.id === presetId)
    if (preset) {
      setSelectedPreset(presetId)
      setCustomSteps([...preset.steps])
      setSimulationResult(null)
      setExecutionResult(null)
    }
  }

  const addCustomStep = () => {
    const newStep: PTBStep = {
      id: `step-${Date.now()}`,
      type: "moveCall",
      label: "New Step",
      data: { target: "", arguments: [], typeArguments: [] },
    }
    setCustomSteps([...customSteps, newStep])
  }

  const removeStep = (stepId: string) => {
    setCustomSteps(customSteps.filter((step) => step.id !== stepId))
  }

  const updateStep = (stepId: string, updates: Partial<PTBStep>) => {
    setCustomSteps(customSteps.map((step) => (step.id === stepId ? { ...step, ...updates } : step)))
  }

  const getCurrentSteps = (): PTBStep[] => {
    if (selectedPreset && customSteps.length === 0) {
      const preset = PTB_PRESETS.find((p) => p.id === selectedPreset)
      return preset?.steps || []
    }
    return customSteps
  }

  const handleSimulate = () => {
    const steps = getCurrentSteps()
    if (steps.length === 0) {
      toast.error("No steps to simulate")
      return
    }
    simulateMutation.mutate(steps)
  }

  const handleExecute = () => {
    const steps = getCurrentSteps()
    if (steps.length === 0) {
      toast.error("No steps to execute")
      return
    }
    executeMutation.mutate(steps)
  }

  const copyToClipboard = async (text: string, label: string) => {
    await navigator.clipboard.writeText(text)
    toast.success(`${label} copied to clipboard`)
  }

  if (!currentAccount) {
    return (
      <Card className="shadow-sm border-slate-200/60 bg-white/60 backdrop-blur-sm dark:border-slate-700/60 dark:bg-slate-800/60">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
            <Code2 className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            PTB Builder
          </CardTitle>
          <CardDescription className="text-slate-600 dark:text-slate-400">
            Build and simulate Programmable Transaction Blocks
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg border border-slate-200 bg-slate-50/50 p-6 text-center dark:border-slate-700 dark:bg-slate-800/50">
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">Connect wallet to start building PTBs</p>
            <div className="flex gap-2 justify-center">
              <Button variant="outline" size="sm" disabled>
                <Play className="h-4 w-4 mr-2" />
                Simulate
              </Button>
              <Button size="sm" disabled>
                <Send className="h-4 w-4 mr-2" />
                Send
              </Button>
            </div>
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-500">
            <p>Available presets: OCT Transfer, Move Call + Transfer</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="shadow-sm border-slate-200/60 bg-white/60 backdrop-blur-sm dark:border-slate-700/60 dark:bg-slate-800/60">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <Code2 className="h-5 w-5 text-purple-600 dark:text-purple-400" />
          PTB Builder
        </CardTitle>
        <CardDescription className="text-slate-600 dark:text-slate-400">
          Build and simulate Programmable Transaction Blocks
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs defaultValue="builder" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="builder">Builder</TabsTrigger>
            <TabsTrigger value="results">Results</TabsTrigger>
          </TabsList>

          <TabsContent value="builder" className="space-y-4">
            {/* Parameters */}
            <div className="space-y-4 p-4 rounded-lg border border-slate-200 bg-slate-50/30 dark:border-slate-700 dark:bg-slate-800/30">
              <h4 className="font-medium text-slate-900 dark:text-slate-100">Parameters</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="recipient">Recipient Address</Label>
                  <Input
                    id="recipient"
                    value={params.recipient}
                    onChange={(e) => setParams({ ...params, recipient: e.target.value })}
                    placeholder="0x..."
                    className="font-mono text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount (MIST)</Label>
                  <Input
                    id="amount"
                    value={params.amount}
                    onChange={(e) => setParams({ ...params, amount: e.target.value })}
                    placeholder="1000000000"
                    className="font-mono text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Presets */}
            <div className="space-y-2">
              <Label>Presets</Label>
              <Select value={selectedPreset} onValueChange={handlePresetSelect}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a preset or build custom" />
                </SelectTrigger>
                <SelectContent>
                  {PTB_PRESETS.map((preset) => (
                    <SelectItem key={preset.id} value={preset.id}>
                      <div>
                        <div className="font-medium">{preset.name}</div>
                        <div className="text-xs text-slate-500">{preset.description}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Steps */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Transaction Steps</Label>
                <Button variant="outline" size="sm" onClick={addCustomStep}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Step
                </Button>
              </div>

              <div className="space-y-2">
                {getCurrentSteps().map((step, index) => (
                  <div
                    key={step.id}
                    className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 bg-white/50 dark:border-slate-700 dark:bg-slate-800/50"
                  >
                    <Badge variant="secondary" className="text-xs">
                      {index + 1}
                    </Badge>
                    <div className="flex-1">
                      <div className="font-medium text-sm">{step.label}</div>
                      <div className="text-xs text-slate-500 capitalize">{step.type}</div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeStep(step.id)}
                      className="h-6 w-6 p-0 text-slate-400 hover:text-red-600"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                ))}

                {getCurrentSteps().length === 0 && (
                  <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                    <p className="text-sm">No steps added yet</p>
                    <p className="text-xs">Choose a preset or add custom steps</p>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-4">
              <Button
                variant="outline"
                onClick={handleSimulate}
                disabled={getCurrentSteps().length === 0 || simulateMutation.isPending}
                className="flex-1 bg-transparent"
              >
                {simulateMutation.isPending ? (
                  <>
                    <Play className="h-4 w-4 mr-2 animate-spin" />
                    Simulating...
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    Simulate
                  </>
                )}
              </Button>
              <Button
                onClick={handleExecute}
                disabled={getCurrentSteps().length === 0 || executeMutation.isPending}
                className="flex-1 bg-purple-600 hover:bg-purple-700"
              >
                {executeMutation.isPending ? (
                  <>
                    <Send className="h-4 w-4 mr-2 animate-spin" />
                    Executing...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Execute
                  </>
                )}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="results" className="space-y-4">
            {/* Simulation Results */}
            {simulationResult && (
              <div className="space-y-2">
                <Label>Simulation Result</Label>
                <div
                  className={`rounded-lg border p-4 ${
                    simulationResult.error
                      ? "border-red-200 bg-red-50/50 dark:border-red-800 dark:bg-red-900/20"
                      : "border-green-200 bg-green-50/50 dark:border-green-800 dark:bg-green-900/20"
                  }`}
                >
                  <div className="flex items-start gap-2">
                    {simulationResult.error ? (
                      <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
                    ) : (
                      <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      {simulationResult.error ? (
                        <p className="text-sm text-red-800 dark:text-red-200">{simulationResult.error}</p>
                      ) : (
                        <div>
                          <p className="text-sm font-medium text-green-800 dark:text-green-200 mb-2">
                            Simulation successful!
                          </p>
                          <div className="text-xs text-green-600 dark:text-green-400 space-y-1">
                            <p>Gas used: {simulationResult.effects?.gasUsed?.computationCost || "N/A"}</p>
                            <p>Status: {simulationResult.effects?.status?.status || "Unknown"}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Execution Results */}
            {executionResult && (
              <div className="space-y-2">
                <Label>Execution Result</Label>
                <div
                  className={`rounded-lg border p-4 ${
                    executionResult.error
                      ? "border-red-200 bg-red-50/50 dark:border-red-800 dark:bg-red-900/20"
                      : "border-green-200 bg-green-50/50 dark:border-green-800 dark:bg-green-900/20"
                  }`}
                >
                  <div className="flex items-start gap-2">
                    {executionResult.error ? (
                      <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
                    ) : (
                      <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      {executionResult.error ? (
                        <p className="text-sm text-red-800 dark:text-red-200">{executionResult.error}</p>
                      ) : (
                        <div>
                          <p className="text-sm font-medium text-green-800 dark:text-green-200 mb-2">
                            Transaction executed successfully!
                          </p>
                          <div className="text-xs text-green-600 dark:text-green-400 space-y-1">
                            <div className="flex items-center gap-2">
                              <span>Digest: {executionResult.digest}</span>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => copyToClipboard(executionResult.digest, "Transaction digest")}
                                className="h-4 w-4 p-0"
                              >
                                <Copy className="h-3 w-3" />
                              </Button>
                            </div>
                            <p>Gas used: {executionResult.effects?.gasUsed?.computationCost || "N/A"}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {!simulationResult && !executionResult && (
              <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                <p className="text-sm">No results yet</p>
                <p className="text-xs">Run a simulation or execute a transaction to see results</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
