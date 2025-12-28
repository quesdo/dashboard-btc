import { getScoreColorClasses, formatDate } from '../utils/scoring';

/**
 * Reusable Indicator Card Component
 * Displays individual indicator data with score, signal, and metadata
 */
export default function IndicatorCard({
  name,
  weight,
  score,
  value,
  unit = '',
  signal,
  emoji,
  dataDate,
  impactDate,
  source,
  isEstimate = false
}) {
  const colors = getScoreColorClasses(score);

  return (
    <div className={`${colors.bg} border-2 ${colors.border} rounded-lg p-6 shadow-sm`}>
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">{name}</h3>
          <p className="text-sm text-gray-500">Poids: {weight}%</p>
        </div>
        <div className={`${colors.badge} px-3 py-1 rounded-full font-bold text-lg`}>
          {score}/10
        </div>
      </div>

      {/* Value */}
      <div className="mb-4">
        <div className={`text-4xl font-bold ${colors.text} mb-2`}>
          {value}{unit}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-2xl">{emoji}</span>
          <span className={`text-lg font-medium ${colors.text}`}>{signal}</span>
        </div>
      </div>

      {/* Metadata */}
      <div className="space-y-1 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <span>📅</span>
          <span>Données du: {formatDate(dataDate)}</span>
        </div>
        {impactDate && (
          <div className="flex items-center gap-2">
            <span>🎯</span>
            <span>Impact prévu: {formatDate(impactDate)}</span>
          </div>
        )}
        {source && (
          <div className="flex items-center gap-2">
            <span>🔗</span>
            <span>
              {source}
              {isEstimate && <span className="ml-2 text-orange-600 font-medium">(Estimation)</span>}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
