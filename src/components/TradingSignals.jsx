import { getAllTradingSignals, getPrimarySignal } from '../utils/tradingStrategies';

/**
 * Trading Signals Component
 * Displays active trading signals and recommendations
 */
export default function TradingSignals({ data }) {
  if (!data) return null;

  const activeSignals = getAllTradingSignals(data);
  const primarySignal = getPrimarySignal(activeSignals);

  const getSignalBadgeColor = (signal) => {
    const colors = {
      'BUY': 'bg-green-100 text-green-800 border-green-300',
      'SELL': 'bg-red-100 text-red-800 border-red-300',
      'ACCUMULATE': 'bg-blue-100 text-blue-800 border-blue-300',
      'REDUCE': 'bg-orange-100 text-orange-800 border-orange-300',
      'HOLD': 'bg-gray-100 text-gray-800 border-gray-300',
      'DCA_INCREASE': 'bg-green-100 text-green-800 border-green-300',
      'DCA_NORMAL': 'bg-gray-100 text-gray-800 border-gray-300',
      'DCA_REDUCE': 'bg-yellow-100 text-yellow-800 border-yellow-300'
    };
    return colors[signal] || 'bg-gray-100 text-gray-800 border-gray-300';
  };

  const getSignalEmoji = (signal) => {
    const emojis = {
      'BUY': '📈',
      'SELL': '📉',
      'ACCUMULATE': '💰',
      'REDUCE': '⚠️',
      'HOLD': '⏸️',
      'DCA_INCREASE': '💪',
      'DCA_NORMAL': '🔄',
      'DCA_REDUCE': '🔻'
    };
    return emojis[signal] || '⏸️';
  };

  const getSignalText = (signal) => {
    const texts = {
      'BUY': 'ACHAT',
      'SELL': 'VENTE',
      'ACCUMULATE': 'ACCUMULATION',
      'REDUCE': 'RÉDUCTION',
      'HOLD': 'CONSERVER',
      'DCA_INCREASE': 'DCA AUGMENTÉ',
      'DCA_NORMAL': 'DCA NORMAL',
      'DCA_REDUCE': 'DCA RÉDUIT'
    };
    return texts[signal] || 'ATTENTE';
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
        <span>🎯</span>
        Signaux de Trading
      </h2>

      {/* Primary Signal - Big Badge */}
      <div className={`${getSignalBadgeColor(primarySignal.signal)} border-4 rounded-xl p-8 shadow-lg`}>
        <div className="flex flex-col md:flex-row gap-6 items-center">
          {/* Left - Signal */}
          <div className="flex-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-4 mb-4">
              <span className="text-6xl">{getSignalEmoji(primarySignal.signal)}</span>
              <div>
                <p className="text-sm font-medium opacity-75">SIGNAL PRINCIPAL</p>
                <h3 className="text-4xl font-black">
                  {getSignalText(primarySignal.signal)}
                </h3>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-xl font-bold">{primarySignal.action}</p>
              <p className="text-base opacity-90">{primarySignal.reason}</p>
              {primarySignal.details && (
                <p className="text-sm opacity-75">{primarySignal.details}</p>
              )}
            </div>
          </div>

          {/* Right - Stats */}
          <div className="bg-white/50 rounded-lg p-6 min-w-[200px]">
            <div className="space-y-3">
              <div>
                <p className="text-sm opacity-75">Niveau d'entrée</p>
                <p className="text-lg font-bold">{primarySignal.entryLevel || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm opacity-75">Précision historique</p>
                <p className="text-lg font-bold">{primarySignal.precision || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm opacity-75">Stratégies actives</p>
                <p className="text-lg font-bold">{primarySignal.activeStrategies || 0}</p>
              </div>
              {primarySignal.timeframe && (
                <div>
                  <p className="text-sm opacity-75">Horizon</p>
                  <p className="text-base font-medium">{primarySignal.timeframe}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Active Strategies List */}
      {activeSignals.length > 0 && (
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">
            Stratégies Actives ({activeSignals.length})
          </h3>

          <div className="space-y-4">
            {activeSignals.map((strategy, index) => (
              <div
                key={index}
                className={`${getSignalBadgeColor(strategy.signal.signal)} border-2 rounded-lg p-4`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl">{getSignalEmoji(strategy.signal.signal)}</span>
                      <h4 className="font-bold text-lg">{strategy.name}</h4>
                      <span className="px-2 py-1 bg-white/50 rounded text-sm font-medium">
                        {strategy.signal.precision}
                      </span>
                    </div>
                    <p className="font-semibold mb-1">{strategy.signal.action}</p>
                    <p className="text-sm opacity-90">{strategy.signal.reason}</p>
                    {strategy.signal.details && (
                      <p className="text-xs opacity-75 mt-1">{strategy.signal.details}</p>
                    )}
                  </div>
                  <div className="text-center">
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-bold ${
                      strategy.signal.strength === 'VERY_STRONG' ? 'bg-green-500 text-white' :
                      strategy.signal.strength === 'STRONG' ? 'bg-blue-500 text-white' :
                      strategy.signal.strength === 'MEDIUM' ? 'bg-yellow-500 text-white' :
                      'bg-gray-400 text-white'
                    }`}>
                      {strategy.signal.strength === 'VERY_STRONG' ? 'Très Fort' :
                       strategy.signal.strength === 'STRONG' ? 'Fort' :
                       strategy.signal.strength === 'MEDIUM' ? 'Moyen' : 'Neutre'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No Signals */}
      {activeSignals.length === 0 && (
        <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-8 text-center">
          <p className="text-3xl mb-2">⏸️</p>
          <p className="text-lg font-medium text-gray-700">Aucun signal fort actuellement</p>
          <p className="text-sm text-gray-500 mt-2">
            Les conditions de marché sont neutres. Conservez vos positions actuelles.
          </p>
        </div>
      )}

      {/* Disclaimer */}
      <div className="bg-amber-50 border-2 border-amber-200 rounded-lg p-4">
        <p className="text-sm text-amber-900">
          <strong>⚠️ Avertissement :</strong> Ces signaux sont basés sur des stratégies validées
          historiquement mais ne garantissent pas les performances futures. Utilisez-les comme
          aide à la décision, pas comme conseil financier absolu. DYOR (Do Your Own Research).
        </p>
      </div>
    </div>
  );
}
