import { Transaction } from "@onelabs/sui/transactions"

/**
 * PTB (Programmable Transaction Block) Simulator for OneChain Development
 * 
 * This is a developer tool for building and testing transaction logic before deployment.
 * 
 * Key Features:
 * - Simulate complex transaction flows
 * - Test Move contract interactions
 * - Validate transaction arguments and types
 * - Debug gas usage and execution paths
 * 
 * Step Types:
 * - splitCoin: Split coins for transfers
 * - moveCall: Call Move contract functions
 * - transferObjects: Transfer objects between addresses
 * - assignVariable: Store intermediate results
 * - setGasBudget: Set transaction gas limits
 */

export interface PTBStep {
  id: string
  type: "moveCall" | "transferObjects" | "assignVariable" | "setGasBudget" | "splitCoin"
  label: string
  data: any
}

export interface PTBPreset {
  id: string
  name: string
  description: string
  steps: PTBStep[]
}

export const PTB_PRESETS: PTBPreset[] = [
  {
    id: "oct-transfer",
    name: "OCT Transfer Simulation",
    description: "Simulate transferring OCT tokens to another address",
    steps: [
      {
        id: "split-coin",
        type: "splitCoin",
        label: "Split OCT Coin",
        data: {
          coin: "gas",
          amount: "amount",
        },
      },
      {
        id: "transfer",
        type: "transferObjects",
        label: "Transfer Split Coin",
        data: {
          objects: ["split-coin"],
          recipient: "recipient",
        },
      },
    ],
  },
  {
    id: "move-call-example",
    name: "Move Call Simulation", 
    description: "Simulate a basic Move contract call",
    steps: [
      {
        id: "move-call",
        type: "moveCall",
        label: "Create Zero Coin",
        data: {
          target: "0x2::coin::zero",
          arguments: [],
          typeArguments: ["0x2::sui::SUI"],
        },
      },
    ],
  },
  {
    id: "developer-demo",
    name: "Developer Demo PTB",
    description: "Complex PTB for testing multiple operations",
    steps: [
      {
        id: "split-for-demo",
        type: "splitCoin",
        label: "Split Coin for Demo",
        data: {
          coin: "gas",
          amount: "amount",
        },
      },
      {
        id: "demo-call",
        type: "moveCall",
        label: "Demo Move Call",
        data: {
          target: "0x2::coin::zero",
          arguments: [],
          typeArguments: ["0x2::sui::SUI"],
        },
      },
      {
        id: "demo-transfer",
        type: "transferObjects",
        label: "Demo Transfer",
        data: {
          objects: ["split-for-demo"],
          recipient: "recipient",
        },
      },
    ],
  },
]

export function createTransactionFromSteps(steps: PTBStep[], params: Record<string, any>): Transaction {
  const tx = new Transaction()
  const variables: Record<string, any> = {}

  // Set a reasonable gas budget for OneChain
  tx.setGasBudget(20000000)

  for (const step of steps) {
    try {
      switch (step.type) {
        case "setGasBudget":
          tx.setGasBudget(Number(step.data.budget))
          break

        case "splitCoin":
          // Use the new splitCoin method with proper argument conversion
          const splitAmount = params.amount || step.data.amount || "1000000000"
          const coinToSplit = step.data.coin === "gas" ? tx.gas : step.data.coin
          
          // Convert string amount to proper transaction argument
          const splitResult = tx.splitCoins(coinToSplit, [tx.pure.u64(splitAmount)])
          variables[step.id] = splitResult[0]
          break

        case "moveCall":
          const args = step.data.arguments?.map((arg: string) => {
            if (arg === "gas") return tx.gas
            if (arg === "amount") return tx.pure.u64(params.amount || "1000000000")
            if (variables[arg]) return variables[arg]
            // For other string arguments, treat as pure values
            if (typeof arg === "string" && arg.startsWith("0x")) {
              return tx.pure.address(arg)
            }
            return tx.pure.string(arg)
          }) || []

          const moveCallResult = tx.moveCall({
            target: step.data.target,
            arguments: args,
            typeArguments: step.data.typeArguments || [],
          })
          variables[step.id] = moveCallResult
          break

        case "transferObjects":
          const objects = step.data.objects.map((obj: string) => {
            if (variables[obj]) return variables[obj]
            return obj
          })
          
          const recipient = params.recipient || params.address
          if (!recipient) {
            throw new Error("No recipient address provided")
          }
          
          tx.transferObjects(objects, recipient)
          break

        case "assignVariable":
          variables[step.data.variable] = variables[step.data.value] || step.data.value
          break

        default:
          console.warn(`Unknown step type: ${step.type}`)
      }
    } catch (error) {
      console.error(`Error processing step ${step.id}:`, error)
      throw new Error(`Failed to process step "${step.label}": ${error instanceof Error ? error.message : String(error)}`)
    }
  }

  return tx
}
