import { useState } from 'react';
import { useCurrentAccount, useSignAndExecuteTransaction } from '@onelabs/dapp-kit';
import { Transaction } from '@onelabs/sui/transactions';
import { formatAddress } from '../utils/formatting';
import { useToast } from '../hooks/useToast';
import type { PTBStep, PTBPreset } from '../types';

const PRESETS: PTBPreset[] = [
  {
    id: 'simple_transfer',
    name: 'Simple OCT Transfer',
    description: 'Transfer OCT tokens to another address',
    steps: [
      {
        id: '1',
        type: 'transfer',
        description: 'Transfer OCT tokens',
        data: { amount: '1000000000', recipient: '' }, // 1 OCT
      },
    ],
  },
  {
    id: 'split_transfer',
    name: 'Split & Transfer',
    description: 'Split coins and transfer to multiple recipients',
    steps: [
      {
        id: '1',
        type: 'transfer',
        description: 'Split and transfer OCT',
        data: { amount: '500000000', recipient: '' }, // 0.5 OCT
      },
      {
        id: '2',
        type: 'transfer',
        description: 'Transfer remaining OCT',
        data: { amount: '500000000', recipient: '' }, // 0.5 OCT
      },
    ],
  },
];

export const PTBSection = () => {
  const currentAccount = useCurrentAccount();
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();
  const { showSuccess, showError } = useToast();
  
  const [steps, setSteps] = useState<PTBStep[]>([]);
  const [gasBudget, setGasBudget] = useState('100000000'); // 0.1 OCT
  const [isExecuting, setIsExecuting] = useState(false);

  const addStep = (type: PTBStep['type']) => {
    const newStep: PTBStep = {
      id: Date.now().toString(),
      type,
      description: getStepDescription(type),
      data: getDefaultStepData(type),
    };
    setSteps([...steps, newStep]);
  };

  const removeStep = (stepId: string) => {
    setSteps(steps.filter(step => step.id !== stepId));
  };

  const updateStep = (stepId: string, data: any) => {
    setSteps(steps.map(step => 
      step.id === stepId ? { ...step, data } : step
    ));
  };

  const loadPreset = (preset: PTBPreset) => {
    setSteps(preset.steps);
    showSuccess(`Loaded preset: ${preset.name}`);
  };

  const buildTransaction = (): Transaction => {
    const tx = new Transaction();
    tx.setGasBudget(parseInt(gasBudget));

    steps.forEach(step => {
      switch (step.type) {
        case 'transfer':
          if (step.data.recipient && step.data.amount) {
            const [coin] = tx.splitCoins(tx.gas, [step.data.amount]);
            tx.transferObjects([coin], step.data.recipient);
          }
          break;
        // Add more step types as needed
      }
    });

    return tx;
  };

  const handleExecute = () => {
    if (steps.length === 0) {
      showError('Please add at least one step to execute');
      return;
    }

    try {
      const transaction = buildTransaction();
      setIsExecuting(true);
      
      signAndExecute({
        transaction: transaction as any, // Type workaround for version compatibility
      }, {
        onSuccess: (result) => {
          showSuccess(`Transaction executed! Digest: ${formatAddress(result.digest)}`);
          setSteps([]);
          setIsExecuting(false);
        },
        onError: (error) => {
          showError(`Transaction failed: ${error.message}`);
          setIsExecuting(false);
        },
      });
    } catch (error: any) {
      showError(`Failed to execute transaction: ${error.message}`);
      setIsExecuting(false);
    }
  };

  const getStepDescription = (type: PTBStep['type']): string => {
    switch (type) {
      case 'transfer': return 'Transfer objects';
      case 'move_call': return 'Call Move function';
      case 'assign_variable': return 'Assign variable';
      case 'gas_budget': return 'Set gas budget';
      default: return 'Unknown step';
    }
  };

  const getDefaultStepData = (type: PTBStep['type']): any => {
    switch (type) {
      case 'transfer': return { amount: '1000000000', recipient: '' };
      case 'move_call': return { package: '', module: '', function: '', args: [] };
      case 'assign_variable': return { name: '', value: '' };
      default: return {};
    }
  };

  if (!currentAccount) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-3xl">🔧</span>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">PTB Builder</h2>
        <p className="text-gray-600 max-w-md mx-auto">
          Connect your wallet to build and execute Programmable Transaction Blocks.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">PTB Builder</h2>
        <p className="text-gray-600">Build and simulate Programmable Transaction Blocks</p>
      </div>

      {/* Presets */}
      <div className="bg-white rounded-xl shadow-soft border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Start Presets</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {PRESETS.map(preset => (
            <div key={preset.id} className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-1">{preset.name}</h4>
              <p className="text-sm text-gray-600 mb-3">{preset.description}</p>
              <button
                onClick={() => loadPreset(preset)}
                className="text-sm bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-1 rounded transition-colors"
              >
                Load Preset
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Step Builder */}
      <div className="bg-white rounded-xl shadow-soft border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Transaction Steps</h3>
          <div className="flex space-x-2">
            <button
              onClick={() => addStep('transfer')}
              className="text-sm bg-green-100 hover:bg-green-200 text-green-700 px-3 py-1 rounded transition-colors"
            >
              + Transfer
            </button>
            <button
              onClick={() => addStep('move_call')}
              className="text-sm bg-purple-100 hover:bg-purple-200 text-purple-700 px-3 py-1 rounded transition-colors"
            >
              + Move Call
            </button>
          </div>
        </div>

        {steps.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl">🔧</span>
            </div>
            <p className="text-gray-600">No steps added yet</p>
            <p className="text-sm text-gray-500">Add steps to build your transaction</p>
          </div>
        ) : (
          <div className="space-y-3">
            {steps.map((step, index) => (
              <div key={step.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <span className="w-6 h-6 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </span>
                    <span className="font-medium text-gray-900">{step.description}</span>
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                      {step.type}
                    </span>
                  </div>
                  <button
                    onClick={() => removeStep(step.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {step.type === 'transfer' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Amount (MIST)
                      </label>
                      <input
                        type="text"
                        value={step.data.amount || ''}
                        onChange={(e) => updateStep(step.id, { ...step.data, amount: e.target.value })}
                        placeholder="1000000000"
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Recipient Address
                      </label>
                      <input
                        type="text"
                        value={step.data.recipient || ''}
                        onChange={(e) => updateStep(step.id, { ...step.data, recipient: e.target.value })}
                        placeholder="0x..."
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Gas Budget */}
        <div className="mt-6 pt-4 border-t border-gray-100">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Gas Budget (MIST)
          </label>
          <input
            type="text"
            value={gasBudget}
            onChange={(e) => setGasBudget(e.target.value)}
            className="w-full max-w-xs px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="bg-white rounded-xl shadow-soft border border-gray-100 p-6">
        <div className="flex space-x-4">
          <button
            onClick={handleExecute}
            disabled={isExecuting || steps.length === 0}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-3 px-4 rounded-lg font-medium transition-colors"
          >
            {isExecuting ? 'Executing...' : 'Execute Transaction'}
          </button>
        </div>
        <p className="text-sm text-gray-500 mt-2 text-center">
          Note: Simulation feature will be added in a future update
        </p>
      </div>
    </div>
  );
};
