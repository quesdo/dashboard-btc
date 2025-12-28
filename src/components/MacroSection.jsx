import ScoreCard from './ScoreCard';
import IndicatorCard from './IndicatorCard';

/**
 * Macro Score Section
 * Displays medium-term (1-3 months) analysis with 3 indicators
 */
export default function MacroSection({ macroData }) {
  if (!macroData) return null;

  const { score, m2, ssr, dxy } = macroData;

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
        <span>🔮</span>
        Analyse Macro (Moyen Terme)
      </h2>

      {/* Important Alert about M2 Lag */}
      <div className="bg-amber-50 border-2 border-amber-300 rounded-lg p-6">
        <div className="flex items-start gap-4">
          <span className="text-4xl">⚠️</span>
          <div>
            <h3 className="text-xl font-bold text-amber-800 mb-2">
              Important : Lag M2 Money Supply
            </h3>
            <p className="text-amber-900 leading-relaxed">
              Les données M2 actuelles (novembre 2025) <strong>impactent Bitcoin dans 70-107 jours</strong> selon
              la corrélation validée 2023-2025. Ce score prédit la tendance pour <strong>février-mars 2026</strong>,
              pas aujourd'hui. Utilisez ce score pour l'allocation stratégique, pas pour le trading court terme.
            </p>
          </div>
        </div>
      </div>

      {/* Main Macro Score */}
      <ScoreCard
        title="Score Macro"
        score={score.score}
        signal={score.signal}
        emoji={score.emoji}
        action={score.action}
        probability={score.probability}
        horizon="Valable Q1-Q2 2026"
        precision="76-83%"
        type="macro"
      />

      {/* 3 Indicators Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* M2 Growth */}
        <IndicatorCard
          name="M2 Growth (YoY)"
          weight={40}
          score={m2.score}
          value={m2.growth > 0 ? `+${m2.growth}` : m2.growth}
          unit="%"
          signal={m2.signal}
          emoji={m2.emoji}
          dataDate={m2.date}
          impactDate={m2.impactDate}
          source="FRED"
          isEstimate={m2.isEstimate}
        />

        {/* Stablecoin Supply Ratio */}
        <IndicatorCard
          name="Stablecoin Supply Ratio"
          weight={35}
          score={ssr.score}
          value={ssr.value}
          unit="%"
          signal={ssr.signal}
          emoji={ssr.emoji}
          dataDate={ssr.dataDate}
          source={ssr.source}
          isEstimate={true}
        />

        {/* DXY Trend 6m */}
        <IndicatorCard
          name="DXY Tendance 6 mois"
          weight={25}
          score={dxy.score}
          value={dxy.trend6m > 0 ? `+${dxy.trend6m}` : dxy.trend6m}
          unit="%"
          signal={dxy.signal}
          emoji={dxy.emoji}
          dataDate={dxy.dataDate}
          source={dxy.source}
          isEstimate={true}
        />
      </div>
    </div>
  );
}
