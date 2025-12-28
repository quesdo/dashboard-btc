import { useState } from 'react';
import useDashboardData from './hooks/useDashboardData';
import Header from './components/Header';
import BitcoinPriceCard from './components/BitcoinPriceCard';
import ModeSelector from './components/ModeSelector';
import TradingSection from './components/TradingSection';
import MacroSection from './components/MacroSection';
import GlobalSynthesis from './components/GlobalSynthesis';
import Footer from './components/Footer';

function App() {
  const [mode, setMode] = useState('both'); // 'trading', 'macro', or 'both'

  const {
    data,
    loading,
    error,
    lastUpdate,
    autoRefresh,
    setAutoRefresh,
    refresh
  } = useDashboardData();

  const handleModeChange = (newMode) => {
    setMode(newMode);
  };

  const handleToggleAutoRefresh = () => {
    setAutoRefresh(!autoRefresh);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header
        onRefresh={refresh}
        autoRefresh={autoRefresh}
        onToggleAutoRefresh={handleToggleAutoRefresh}
        lastUpdate={lastUpdate}
        isLoading={loading}
      />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Loading State */}
        {loading && !data && (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="animate-spin text-6xl mb-4">🔄</div>
              <p className="text-xl text-gray-600">Chargement des données...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border-2 border-red-300 rounded-lg p-6 mb-6">
            <div className="flex items-center gap-3">
              <span className="text-3xl">❌</span>
              <div>
                <h3 className="text-xl font-bold text-red-800">Erreur</h3>
                <p className="text-red-700">{error}</p>
                <button
                  onClick={refresh}
                  className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Réessayer
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Data Display */}
        {data && (
          <div className="space-y-8">
            {/* Bitcoin Price Card */}
            <BitcoinPriceCard
              price={data.btc.price}
              change24h={data.btc.change24h}
              marketCap={data.btc.marketCap}
              volume24h={data.btc.volume24h}
            />

            {/* Mode Selector */}
            <ModeSelector mode={mode} onModeChange={handleModeChange} />

            {/* Trading Section */}
            {(mode === 'trading' || mode === 'both') && (
              <TradingSection tradingData={data.trading} />
            )}

            {/* Macro Section */}
            {(mode === 'macro' || mode === 'both') && (
              <MacroSection macroData={data.macro} />
            )}

            {/* Global Synthesis (only in 'both' mode) */}
            {mode === 'both' && (
              <GlobalSynthesis
                tradingScore={data.trading.score}
                macroScore={data.macro.score}
              />
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default App;
