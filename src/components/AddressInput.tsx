import React, { useState } from 'react';

interface AddressInputProps {
  onAddressSubmit: (address: string) => void;
  currentAddress?: string;
}

export const AddressInput: React.FC<AddressInputProps> = ({ 
  onAddressSubmit, 
  currentAddress 
}) => {
  const [address, setAddress] = useState(currentAddress || '');
  const [error, setError] = useState('');

  const validateAddress = (addr: string): boolean => {
    // Basic OneChain/Sui address validation
    return addr.startsWith('0x') && addr.length === 66;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!address.trim()) {
      setError('Please enter an address');
      return;
    }

    if (!validateAddress(address.trim())) {
      setError('Please enter a valid OneChain address (0x... 64 characters)');
      return;
    }

    setError('');
    onAddressSubmit(address.trim());
  };

  const handleGenerateRandom = () => {
    // Generate a sample address for testing
    const randomHex = Array.from({ length: 64 }, () => 
      Math.floor(Math.random() * 16).toString(16)
    ).join('');
    const sampleAddress = `0x${randomHex}`;
    setAddress(sampleAddress);
    setError('');
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Address Input</h2>
        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
            OneChain Address
          </label>
          <div className="relative">
            <input
              type="text"
              id="address"
              value={address}
              onChange={(e) => {
                setAddress(e.target.value);
                setError('');
              }}
              placeholder="0x1234567890abcdef..."
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 font-mono text-sm"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
          {error && (
            <p className="mt-2 text-sm text-red-600 flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </p>
          )}
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            Set Address
          </button>
          <button
            type="button"
            onClick={handleGenerateRandom}
            className="px-4 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-all duration-200"
            title="Generate sample address for testing"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
      </form>

      {currentAddress && (
        <div className="mt-6 p-4 bg-green-50 rounded-xl border border-green-200">
          <div className="flex items-center text-green-800">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-medium">Active Address:</span>
          </div>
          <p className="mt-1 font-mono text-sm text-green-700 break-all">
            {currentAddress}
          </p>
        </div>
      )}

      <div className="mt-4 text-xs text-gray-500">
        <p>💡 <strong>Tip:</strong> Use the generate button to create a sample address for testing</p>
      </div>
    </div>
  );
};
