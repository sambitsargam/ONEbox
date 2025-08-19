import { Transaction } from "@onelabs/sui/transactions"

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
    name: "Simple OCT Transfer",
    description: "Transfer OCT tokens to another address",
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
    name: "Move Call Example", 
    description: "Example move call transaction",
    steps: [
      {
        id: "move-call",
        type: "moveCall",
        label: "Example Move Call",
        data: {
          target: "0x2::coin::zero",
          arguments: [],
          typeArguments: ["0x2::sui::SUI"],
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
          // Use the new splitCoin method
          const splitAmount = params.amount || step.data.amount || "1000000000"
          const coinToSplit = step.data.coin === "gas" ? tx.gas : step.data.coin
          const splitResult = tx.splitCoins(coinToSplit, [splitAmount])
          variables[step.id] = splitResult[0]
          break

        case "moveCall":
          const args = step.data.arguments?.map((arg: string) => {
            if (arg === "gas") return tx.gas
            if (arg === "amount") return params.amount || "1000000000"
            if (variables[arg]) return variables[arg]
            return arg
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
