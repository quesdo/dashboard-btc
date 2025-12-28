/**
 * Footer Component
 * Displays methodology, sources, disclaimers, and useful links
 */
export default function Footer() {
  return (
    <footer className="bg-gray-800 text-gray-300 py-8 px-8 mt-12">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
          {/* Sources */}
          <div>
            <h3 className="text-white font-bold mb-3">📊 Sources des Données</h3>
            <ul className="space-y-2 text-sm">
              <li><strong>CoinGecko:</strong> Prix BTC, Market Cap, Volume (60s)</li>
              <li><strong>Alternative.me:</strong> Fear & Greed Index (1h)</li>
              <li><strong>FRED:</strong> M2 Money Supply (1x/jour)</li>
              <li><strong>Estimations manuelles:</strong> DXY, SSR, ETF Flows</li>
            </ul>
          </div>

          {/* Methodology */}
          <div>
            <h3 className="text-white font-bold mb-3">🔬 Méthodologie</h3>
            <ul className="space-y-2 text-sm">
              <li><strong>Score Trading:</strong> 4 indicateurs, horizon 1-7j</li>
              <li><strong>Score Macro:</strong> 3 indicateurs, horizon 1-3 mois</li>
              <li><strong>Précision validée:</strong> Backtests 2023-2025</li>
              <li><strong>Lag M2:</strong> 70-107 jours (moyenne 84j)</li>
            </ul>
          </div>

          {/* Useful Links */}
          <div>
            <h3 className="text-white font-bold mb-3">🔗 Liens Utiles</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="https://www.coingecko.com" target="_blank" rel="noopener noreferrer" className="hover:text-white">CoinGecko</a></li>
              <li><a href="https://alternative.me/crypto/fear-and-greed-index/" target="_blank" rel="noopener noreferrer" className="hover:text-white">Fear & Greed Index</a></li>
              <li><a href="https://fred.stlouisfed.org/" target="_blank" rel="noopener noreferrer" className="hover:text-white">FRED (Federal Reserve)</a></li>
              <li><a href="https://farside.co.uk/btc/" target="_blank" rel="noopener noreferrer" className="hover:text-white">Farside ETF Flows</a></li>
              <li><a href="https://cryptoquant.com/" target="_blank" rel="noopener noreferrer" className="hover:text-white">CryptoQuant</a></li>
            </ul>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="border-t border-gray-700 pt-6">
          <p className="text-sm text-gray-400 mb-2">
            <strong>⚠️ Avertissement :</strong> Ce dashboard est fourni à titre éducatif uniquement.
            Les scores et probabilités sont basés sur des corrélations historiques qui peuvent ne pas
            se répéter. Ne constitue pas un conseil en investissement. Faites toujours vos propres recherches (DYOR).
          </p>
          <p className="text-xs text-gray-500 text-center mt-4">
            Bitcoin Dashboard © 2025 - Open Source - Données en temps réel
          </p>
        </div>
      </div>
    </footer>
  );
}
