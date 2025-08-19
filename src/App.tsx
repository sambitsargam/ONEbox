import { useState } from 'react';
import { LandingPage } from './components/LandingPage';
import { MainLayout } from './components/MainLayout';
import { Toast } from './components/Toast';
import { useToast } from './hooks/useToast';
import './App.css';

function App() {
  const [showMainApp, setShowMainApp] = useState(false);
  const { toasts, removeToast } = useToast();

  const handleGetStarted = () => {
    setShowMainApp(true);
  };

  return (
    <div className="min-h-screen">
      {!showMainApp ? (
        <LandingPage onGetStarted={handleGetStarted} />
      ) : (
        <MainLayout />
      )}
      
      {/* Toast notifications */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {toasts.map((toast: any) => (
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

export default App;
