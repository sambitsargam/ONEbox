import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SuiClientProvider, WalletProvider } from '@onelabs/dapp-kit';
import { getFullnodeUrl } from '@onelabs/sui/client';
import { createNetworkConfig } from '@onelabs/dapp-kit';
import { MainLayout } from './components/MainLayout';
import { Toast } from './components/Toast';
import { useToast } from './hooks/useToast';
import './App.css';

// Create React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 3,
    },
  },
});

// Network configuration
const { networkConfig } = createNetworkConfig({
  testnet: { url: getFullnodeUrl('testnet') },
  localnet: { url: getFullnodeUrl('localnet') },
});

function AppContent() {
  const { toasts, removeToast } = useToast();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <MainLayout />
      
      {/* Toast notifications */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            {...toast}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SuiClientProvider networks={networkConfig} defaultNetwork="testnet">
        <WalletProvider>
          <AppContent />
        </WalletProvider>
      </SuiClientProvider>
    </QueryClientProvider>
  );
}

export default App;
