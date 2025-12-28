import ScoreCard from './ScoreCard';
import IndicatorCard from './IndicatorCard';

/**
 * Trading Score Section
 * Displays short-term (1-7 days) analysis with 4 indicators
 */
export default function TradingSection({ tradingData }) {
  if (!tradingData) return null;

  const { score, fearGreed, athDistance, dxy, etf } = tradingData;

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
        <span>📊</span>
        Analyse Trading (Court Terme)
      </h2>

      {/* Main Trading Score */}
      <ScoreCard
        title="Score Trading"
        score={score.score}
        signal={score.signal}
        emoji={score.emoji}
        action={score.action}
        probability={score.probability}
        horizon="Valable aujourd'hui - cette semaine"
        precision="70-75%"
        type="trading"
      />

      {/* 4 Indicators Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Fear & Greed Index */}
        <IndicatorCard
          name="Fear & Greed Index"
          weight={30}
          score={fearGreed.score}
          value={fearGreed.value}
          signal={fearGreed.signal}
          emoji={fearGreed.emoji}
          dataDate={fearGreed.timestamp}
          source="Alternative.me"
        />

        {/* Distance from ATH */}
        <IndicatorCard
          name="Distance ATH"
          weight={20}
          score={athDistance.score}
          value={athDistance.distance.toFixed(1)}
          unit="%"
          signal={athDistance.signal}
          emoji={athDistance.emoji}
          dataDate={athDistance.timestamp}
          source="CoinGecko (ATH: $108,353)"
        />

        {/* DXY Dollar Index */}
        <IndicatorCard
          name="DXY Dollar Index"
          weight={25}
          score={dxy.score}
          value={dxy.value}
          signal={dxy.signal}
          emoji={dxy.emoji}
          dataDate={dxy.dataDate}
          source={dxy.source}
          isEstimate={true}
        />

        {/* ETF Flows */}
        <IndicatorCard
          name="ETF Flows"
          weight={25}
          score={etf.score}
          value={etf.value > 0 ? `+${etf.value}` : etf.value}
          unit="/5"
          signal={etf.signal}
          emoji={etf.emoji}
          dataDate={etf.dataDate}
          source={etf.source}
          isEstimate={true}
        />
      </div>
    </div>
  );
}
