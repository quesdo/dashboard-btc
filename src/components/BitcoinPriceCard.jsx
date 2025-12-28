import { formatLargeNumber, formatNumber } from '../utils/scoring';

/**
 * Bitcoin Price Card Component
 * Displays real-time BTC price with 24h stats
 */
export default function BitcoinPriceCard({ price, change24h, marketCap, volume24h }) {
  const isPositive = change24h >= 0;

  return (
    <div className="bg-gradient-to-br from-orange-50 to-yellow-50 border-2 border-orange-200 rounded-xl p-8 shadow-lg">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        {/* Left - Price */}
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-gray-700 mb-2">Bitcoin (BTC)</h2>
          <div className="text-6xl font-black text-orange-600 mb-4">
            ${formatNumber(price, 0)}
          </div>

          {/* 24h change */}
          <div className="flex items-center gap-2">
            <span className="text-3xl">{isPositive ? '📈' : '📉'}</span>
            <span
              className={`text-2xl font-bold ${
                isPositive ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {isPositive ? '+' : ''}
              {formatNumber(change24h, 2)}%
            </span>
            <span className="text-gray-500 text-sm">24h</span>
          </div>
        </div>

        {/* Right - Stats */}
        <div className="grid grid-cols-2 gap-6">
          {/* Market Cap */}
          <div className="bg-white/70 rounded-lg p-4 text-center">
            <p className="text-sm text-gray-600 mb-1">Market Cap</p>
            <p className="text-xl font-bold text-gray-800">
              {formatLargeNumber(marketCap)}
            </p>
          </div>

          {/* Volume */}
          <div className="bg-white/70 rounded-lg p-4 text-center">
            <p className="text-sm text-gray-600 mb-1">Volume 24h</p>
            <p className="text-xl font-bold text-gray-800">
              {formatLargeNumber(volume24h)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
