/**
 * Dashboard Header Component
 * Contains title, refresh controls, and last update timestamp
 */
export default function Header({
  onRefresh,
  autoRefresh,
  onToggleAutoRefresh,
  lastUpdate,
  isLoading
}) {
  const formatTime = (isoDate) => {
    if (!isoDate) return '--:--:--';
    const date = new Date(isoDate);
    return date.toLocaleTimeString('fr-FR');
  };

  return (
    <header className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-6 px-8 shadow-lg">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          {/* Title */}
          <div>
            <h1 className="text-4xl font-black mb-1">
              Bitcoin Dashboard
            </h1>
            <p className="text-blue-100 text-sm">
              Analyse Trading & Macro avec précision validée 70-83%
            </p>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-4">
            {/* Auto-refresh toggle */}
            <button
              onClick={onToggleAutoRefresh}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                autoRefresh
                  ? 'bg-green-500 hover:bg-green-600'
                  : 'bg-gray-500 hover:bg-gray-600'
              }`}
            >
              Auto-refresh {autoRefresh ? 'ON' : 'OFF'}
            </button>

            {/* Manual refresh */}
            <button
              onClick={onRefresh}
              disabled={isLoading}
              className="px-4 py-2 bg-white text-blue-600 rounded-lg font-medium hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              <span className={isLoading ? 'animate-spin' : ''}>🔄</span>
              Actualiser
            </button>

            {/* Last update */}
            <div className="text-sm">
              <p className="text-blue-100">Dernière mise à jour</p>
              <p className="font-mono font-bold">{formatTime(lastUpdate)}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
