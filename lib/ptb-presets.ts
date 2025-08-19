import { Transaction } from "@mysten/sui/transactions"

export interface PTBStep {
  id: string
  type: "moveCall" | "transferObjects" | "assignVariable" | "setGasBudget"
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
        id: "gas-budget",
        type: "setGasBudget",
        label: "Set Gas Budget",
        data: { budget: "10000000" },
      },
      {
        id: "split-coin",
        type: "moveCall",
        label: "Split Coin",
        data: {
          target: "0x2::coin::split",
          arguments: ["gas", "amount"],
          typeArguments: ["0x2::sui::SUI"],
        },
      },
      {
        id: "transfer",
        type: "transferObjects",
        label: "Transfer Objects",
        data: {
          objects: ["splitCoin"],
          recipient: "recipient",
        },
      },
    ],
  },
  {
    id: "move-call-transfer",
    name: "Move Call + Transfer",
    description: "Execute a move call and transfer the result",
    steps: [
      {
        id: "gas-budget",
        type: "setGasBudget",
        label: "Set Gas Budget",
        data: { budget: "20000000" },
      },
      {
        id: "move-call",
        type: "moveCall",
        label: "Move Call",
        data: {
          target: "0x2::coin::zero",
          arguments: [],
          typeArguments: ["0x2::sui::SUI"],
        },
      },
      {
        id: "assign-var",
        type: "assignVariable",
        label: "Assign Variable",
        data: {
          variable: "result",
          value: "moveCallResult",
        },
      },
      {
        id: "transfer",
        type: "transferObjects",
        label: "Transfer Result",
        data: {
          objects: ["result"],
          recipient: "recipient",
        },
      },
    ],
  },
]

export function createTransactionFromSteps(steps: PTBStep[], params: Record<string, any>): Transaction {
  const tx = new Transaction()
  const variables: Record<string, any> = {}

  for (const step of steps) {
    switch (step.type) {
      case "setGasBudget":
        tx.setGasBudget(Number(step.data.budget))
        break

      case "moveCall":
        const result = tx.moveCall({
          target: step.data.target,
          arguments: step.data.arguments.map((arg: string) => {
            if (arg === "gas") return tx.gas
            if (arg === "amount") return params.amount || "1000000000"
            if (variables[arg]) return variables[arg]
            return arg
          }),
          typeArguments: step.data.typeArguments || [],
        })
        variables[step.id] = result
        break

      case "transferObjects":
        const objects = step.data.objects.map((obj: string) => {
          if (variables[obj]) return variables[obj]
          return obj
        })
        tx.transferObjects(objects, params.recipient || params.address)
        break

      case "assignVariable":
        variables[step.data.variable] = variables[step.data.value] || step.data.value
        break
    }
  }

  return tx
}
