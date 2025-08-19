// Utility functions for wallet detection and debugging

export const detectAvailableWallets = () => {
  const wallets = []
  
  // Check for Sui Wallet
  if (typeof window !== 'undefined' && window.suiWallet) {
    wallets.push('Sui Wallet')
  }
  
  // Check for Ethos Wallet
  if (typeof window !== 'undefined' && window.ethereum) {
    wallets.push('Ethos Wallet (detected)')
  }
  
  // Check for Suiet Wallet
  if (typeof window !== 'undefined' && window.suiet) {
    wallets.push('Suiet Wallet')
  }
  
  return wallets
}

export const logWalletDebugInfo = () => {
  if (typeof window !== 'undefined') {
    console.log('=== Wallet Debug Info ===')
    console.log('Available wallets:', detectAvailableWallets())
    console.log('window.suiWallet:', !!window.suiWallet)
    console.log('window.ethereum:', !!window.ethereum)
    console.log('window.suiet:', !!window.suiet)
    console.log('========================')
  }
}

// Type augmentation for window object
declare global {
  interface Window {
    suiWallet?: any
    suiet?: any
    ethereum?: any
  }
}
