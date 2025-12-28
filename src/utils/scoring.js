/**
 * Scoring Logic for Bitcoin Dashboard
 * Based on validated correlations from 2023-2025 data
 */

/**
 * Calculate ATH Distance score
 * @param {number} currentPrice
 * @param {number} ath
 * @returns {{score: number, signal: string, emoji: string, color: string, distance: number}}
 */
export function getATHDistanceScore(currentPrice, ath) {
  const distance = ((ath - currentPrice) / ath) * 100;

  if (distance > 30) {
    return { score: 8, signal: 'Zone accumulation forte', emoji: '🟢', color: 'green', distance };
  } else if (distance >= 20 && distance <= 30) {
    return { score: 7, signal: 'Zone accumulation', emoji: '🟢', color: 'green', distance };
  } else if (distance >= 10 && distance < 20) {
    return { score: 5, signal: 'Modérément sous-évalué', emoji: '🟡', color: 'yellow', distance };
  } else if (distance >= 0 && distance < 10) {
    return { score: 4, signal: 'Proche ATH', emoji: '⚪', color: 'gray', distance };
  } else {
    return { score: 2, signal: 'Nouveau ATH - Prudence', emoji: '🔴', color: 'red', distance };
  }
}

/**
 * Calculate Trading Score (Short-term)
 * Weighted composite of 4 indicators
 * @param {Object} indicators
 * @param {number} indicators.fearGreedScore
 * @param {number} indicators.athScore
 * @param {number} indicators.dxyScore
 * @param {number} indicators.etfScore
 * @returns {{score: number, signal: string, action: string, probability: string, color: string}}
 */
export function calculateTradingScore({ fearGreedScore, athScore, dxyScore, etfScore }) {
  // Weights: Fear&Greed 30%, ATH 20%, DXY 25%, ETF 25%
  const score = (
    fearGreedScore * 0.30 +
    athScore * 0.20 +
    dxyScore * 0.25 +
    etfScore * 0.25
  );

  const roundedScore = parseFloat(score.toFixed(1));

  if (roundedScore >= 7.5) {
    return {
      score: roundedScore,
      signal: 'ACHAT FORT',
      action: "Zone d'achat idéale - Configuration très favorable",
      probability: '75-80%',
      emoji: '🟢',
      color: 'green'
    };
  } else if (roundedScore >= 6.0 && roundedScore < 7.5) {
    return {
      score: roundedScore,
      signal: 'Achat',
      action: 'Configuration favorable - Entrée progressive recommandée',
      probability: '60-70%',
      emoji: '🟢',
      color: 'green'
    };
  } else if (roundedScore >= 5.0 && roundedScore < 6.0) {
    return {
      score: roundedScore,
      signal: 'Neutre-Bullish',
      action: 'Attendre confirmation - Signal mixte',
      probability: '50-55%',
      emoji: '🟡',
      color: 'yellow'
    };
  } else if (roundedScore >= 4.0 && roundedScore < 5.0) {
    return {
      score: roundedScore,
      signal: 'Neutre',
      action: 'Pas de signal clair - Rester en observation',
      probability: '45-50%',
      emoji: '⚪',
      color: 'gray'
    };
  } else {
    return {
      score: roundedScore,
      signal: 'Prudence',
      action: 'Risque de correction - Éviter nouvelles entrées',
      probability: '< 40%',
      emoji: '🔴',
      color: 'red'
    };
  }
}

/**
 * Calculate Macro Score (Medium-term)
 * Weighted composite of 3 indicators
 * @param {Object} indicators
 * @param {number} indicators.m2Score
 * @param {number} indicators.ssrScore
 * @param {number} indicators.dxyScore
 * @returns {{score: number, signal: string, action: string, probability: string, color: string}}
 */
export function calculateMacroScore({ m2Score, ssrScore, dxyScore }) {
  // Weights: M2 40%, SSR 35%, DXY 25%
  const score = (
    m2Score * 0.40 +
    ssrScore * 0.35 +
    dxyScore * 0.25
  );

  const roundedScore = parseFloat(score.toFixed(1));

  if (roundedScore >= 7.5) {
    return {
      score: roundedScore,
      signal: 'EXPANSION FORTE',
      action: 'Accumulation agressive - Conditions macro optimales',
      probability: '78-83%',
      emoji: '🟢',
      color: 'green'
    };
  } else if (roundedScore >= 6.0 && roundedScore < 7.5) {
    return {
      score: roundedScore,
      signal: 'Expansion modérée',
      action: 'Accumulation progressive - Fondamentaux favorables',
      probability: '65-75%',
      emoji: '🟢',
      color: 'green'
    };
  } else if (roundedScore >= 5.0 && roundedScore < 6.0) {
    return {
      score: roundedScore,
      signal: 'Expansion faible',
      action: 'Prudence - Fondamentaux macro mixtes',
      probability: '50-60%',
      emoji: '🟡',
      color: 'yellow'
    };
  } else if (roundedScore >= 4.0 && roundedScore < 5.0) {
    return {
      score: roundedScore,
      signal: 'Stagnation',
      action: 'Pas de catalyseur macro - Attendre amélioration',
      probability: '40-50%',
      emoji: '⚪',
      color: 'gray'
    };
  } else {
    return {
      score: roundedScore,
      signal: 'Contraction',
      action: 'Environnement défavorable - Réduire exposition',
      probability: '< 35%',
      emoji: '🔴',
      color: 'red'
    };
  }
}

/**
 * Get color class based on score
 * @param {number} score
 * @returns {string} Tailwind color classes
 */
export function getScoreColorClasses(score) {
  if (score >= 7) {
    return {
      bg: 'bg-green-50',
      text: 'text-green-800',
      border: 'border-green-300',
      badge: 'bg-green-100 text-green-800'
    };
  } else if (score >= 5 && score < 7) {
    return {
      bg: 'bg-yellow-50',
      text: 'text-yellow-800',
      border: 'border-yellow-300',
      badge: 'bg-yellow-100 text-yellow-800'
    };
  } else {
    return {
      bg: 'bg-red-50',
      text: 'text-red-800',
      border: 'border-red-300',
      badge: 'bg-red-100 text-red-800'
    };
  }
}

/**
 * Format number with appropriate decimals and separators
 * @param {number} num
 * @param {number} decimals
 * @returns {string}
 */
export function formatNumber(num, decimals = 2) {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(num);
}

/**
 * Format large numbers (billions, millions)
 * @param {number} num
 * @returns {string}
 */
export function formatLargeNumber(num) {
  if (num >= 1e9) {
    return `$${(num / 1e9).toFixed(2)}B`;
  } else if (num >= 1e6) {
    return `$${(num / 1e6).toFixed(2)}M`;
  } else {
    return `$${num.toLocaleString()}`;
  }
}

/**
 * Format date for display
 * @param {string} isoDate
 * @returns {string}
 */
export function formatDate(isoDate) {
  const date = new Date(isoDate);
  return date.toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}
