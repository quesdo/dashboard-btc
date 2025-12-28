/**
 * Global Synthesis Component
 * Displayed only in "both" mode - synthesizes Trading + Macro analysis
 */
export default function GlobalSynthesis({ tradingScore, macroScore }) {
  if (!tradingScore || !macroScore) return null;

  // Calculate overall risk profile
  const avgScore = (tradingScore.score + macroScore.score) / 2;
  let riskProfile = '';
  let riskColor = '';
  let riskEmoji = '';

  if (avgScore >= 7) {
    riskProfile = 'Favorable - Configuration optimale court & moyen terme';
    riskColor = 'text-green-700';
    riskEmoji = '🟢';
  } else if (avgScore >= 5.5) {
    riskProfile = 'Modéré - Opportunités sélectives';
    riskColor = 'text-yellow-700';
    riskEmoji = '🟡';
  } else if (avgScore >= 4) {
    riskProfile = 'Mitigé - Prudence recommandée';
    riskColor = 'text-orange-700';
    riskEmoji = '🟠';
  } else {
    riskProfile = 'Défavorable - Conditions difficiles';
    riskColor = 'text-red-700';
    riskEmoji = '🔴';
  }

  // Overall probability (weighted average, favor macro for strategic decisions)
  const overallProb = Math.round((
    parseFloat(tradingScore.probability.split('-')[0]) * 0.4 +
    parseFloat(macroScore.probability.split('-')[0]) * 0.6
  ));

  return (
    <div className="bg-gradient-to-br from-purple-50 to-blue-50 border-2 border-purple-200 rounded-xl p-8 shadow-lg">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-3">
        <span>⚖️</span>
        Synthèse Globale
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left column - Summaries */}
        <div className="space-y-4">
          {/* Short term */}
          <div className="bg-white rounded-lg p-4 border-l-4 border-blue-500">
            <h3 className="font-bold text-gray-700 mb-2">📊 Court Terme (1-7j)</h3>
            <p className="text-sm text-gray-600">
              Score {tradingScore.score}/10 - {tradingScore.signal}
            </p>
            <p className="text-sm text-gray-700 mt-1">
              {tradingScore.action}
            </p>
          </div>

          {/* Medium term */}
          <div className="bg-white rounded-lg p-4 border-l-4 border-purple-500">
            <h3 className="font-bold text-gray-700 mb-2">🔮 Moyen Terme (1-3 mois)</h3>
            <p className="text-sm text-gray-600">
              Score {macroScore.score}/10 - {macroScore.signal}
            </p>
            <p className="text-sm text-gray-700 mt-1">
              {macroScore.action}
            </p>
          </div>

          {/* Long term context */}
          <div className="bg-white rounded-lg p-4 border-l-4 border-indigo-500">
            <h3 className="font-bold text-gray-700 mb-2">🎯 Contexte Long Terme</h3>
            <p className="text-sm text-gray-700">
              Bitcoin reste dans un cycle haussier structurel post-halving 2024.
              Les fondamentaux macro (M2, adoption institutionnelle) supportent
              une appréciation continue sur 12-18 mois.
            </p>
          </div>
        </div>

        {/* Right column - Risk & Probability */}
        <div className="space-y-6">
          {/* Risk Profile */}
          <div className="bg-white rounded-lg p-6">
            <h3 className="text-sm font-medium text-gray-600 mb-3">Profil de Risque Actuel</h3>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-4xl">{riskEmoji}</span>
              <p className={`text-xl font-bold ${riskColor}`}>
                {riskProfile}
              </p>
            </div>
            <div className="text-sm text-gray-500 mt-4">
              Score moyen: {avgScore.toFixed(1)}/10
            </div>
          </div>

          {/* Overall Probability */}
          <div className="bg-white rounded-lg p-6">
            <h3 className="text-sm font-medium text-gray-600 mb-3">Probabilité Globale</h3>
            <div className="text-5xl font-black text-purple-600 mb-2">
              ~{overallProb}%
            </div>
            <p className="text-sm text-gray-700">
              Probabilité d'appréciation sur les 90 prochains jours
              (pondération 40% court terme, 60% macro)
            </p>
          </div>

          {/* Recommendation */}
          <div className="bg-gradient-to-r from-purple-100 to-blue-100 rounded-lg p-4">
            <p className="text-sm font-medium text-purple-900">
              💡 <strong>Recommandation :</strong> Combinez les deux analyses pour
              des décisions nuancées. Utilisez le score Trading pour le timing d'entrée,
              et le score Macro pour dimensionner vos positions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
