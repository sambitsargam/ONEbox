export interface FaucetRequest {
  FixedAmountRequest: {
    recipient: string;
  };
}

export interface FaucetResponse {
  transferredGasObjects: Array<{
    amount: number;
    id: string;
    transferTxDigest: string;
  }>;
  error?: string;
}

export interface Balance {
  coinType: string;
  coinObjectCount: number;
  totalBalance: string;
}

export interface TransactionSummary {
  digest: string;
  checkpoint?: string;
  timestampMs?: string;
  effects: {
    status: {
      status: string;
      error?: string;
    };
    gasUsed: {
      computationCost: string;
      storageCost: string;
      storageRebate: string;
      nonRefundableStorageFee: string;
    };
  };
}

export interface PTBStep {
  id: string;
  type: 'move_call' | 'transfer' | 'assign_variable' | 'gas_budget';
  description: string;
  data: any;
}

export interface PTBPreset {
  id: string;
  name: string;
  description: string;
  steps: PTBStep[];
}
