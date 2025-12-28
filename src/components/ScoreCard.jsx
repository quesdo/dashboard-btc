import { getScoreColorClasses } from '../utils/scoring';

/**
 * Main Score Card Component
 * Displays the composite score (Trading or Macro)
 */
export default function ScoreCard({
  title,
  score,
  signal,
  emoji,
  action,
  probability,
  horizon,
  precision,
  type // 'trading' or 'macro'
}) {
  const colors = getScoreColorClasses(score);

  return (
    <div className={`${colors.bg} border-4 ${colors.border} rounded-xl p-8 shadow-lg`}>
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left side - Main score */}
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            {title}
          </h2>

          {/* Giant score */}
          <div className={`text-7xl font-black ${colors.text} mb-4`}>
            {score}<span className="text-4xl">/10</span>
          </div>

          {/* Signal */}
          <div className="flex items-center gap-3 mb-4">
            <span className="text-4xl">{emoji}</span>
            <span className={`text-3xl font-bold ${colors.text}`}>
              {signal}
            </span>
          </div>

          {/* Action */}
          <p className="text-lg text-gray-700 mb-4">
            {action}
          </p>

          {/* Horizon */}
          <div className="inline-block bg-white/50 px-4 py-2 rounded-lg">
            <p className="text-sm font-medium text-gray-600">
              ⏱️ {horizon}
            </p>
          </div>
        </div>

        {/* Right side - Probabilities */}
        <div className="lg:w-64 bg-white/50 rounded-lg p-6 space-y-4">
          <div>
            <p className="text-sm text-gray-600 mb-1">Probabilité de rallye {type === 'trading' ? '7j' : '90j'}</p>
            <p className={`text-3xl font-bold ${colors.text}`}>
              {probability}
            </p>
          </div>

          <div className="border-t border-gray-300 pt-4">
            <p className="text-sm text-gray-600 mb-1">Précision historique</p>
            <p className="text-2xl font-bold text-gray-700">
              {precision}
            </p>
          </div>

          <div className="text-xs text-gray-500 mt-4">
            Basé sur corrélations validées 2023-2025
          </div>
        </div>
      </div>
    </div>
  );
}
