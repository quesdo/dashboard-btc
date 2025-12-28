/**
 * Alternative.me Fear & Greed Index API
 * Public API, no key required
 * Updates: Daily
 * Used for: Market sentiment (0-100 scale)
 */

const FEAR_GREED_URL = 'https://api.alternative.me/fng/';

/**
 * Fetch Fear & Greed Index
 * @returns {Promise<{value: number, classification: string, timestamp: string}>}
 */
export async function fetchFearGreedIndex() {
  try {
    const response = await fetch(`${FEAR_GREED_URL}?limit=1`);

    if (!response.ok) {
      throw new Error(`Fear & Greed API error: ${response.status}`);
    }

    const data = await response.json();
    const current = data.data[0];

    return {
      value: parseInt(current.value),
      classification: current.value_classification,
      timestamp: new Date(parseInt(current.timestamp) * 1000).toISOString(),
      timestampRaw: current.timestamp
    };
  } catch (error) {
    console.error('Error fetching Fear & Greed Index:', error);
    throw error;
  }
}

/**
 * Get signal based on Fear & Greed value
 * @param {number} value - Fear & Greed value (0-100)
 * @returns {{score: number, signal: string, emoji: string, color: string}}
 */
export function getFearGreedSignal(value) {
  if (value < 20) {
    return { score: 9, signal: 'ACHAT FORT (Peur extrême)', emoji: '🟢', color: 'green' };
  } else if (value >= 20 && value < 30) {
    return { score: 7, signal: 'Achat (Peur)', emoji: '🟢', color: 'green' };
  } else if (value >= 30 && value < 45) {
    return { score: 6, signal: 'Légèrement bullish', emoji: '🟡', color: 'yellow' };
  } else if (value >= 45 && value < 55) {
    return { score: 5, signal: 'Neutre', emoji: '⚪', color: 'gray' };
  } else if (value >= 55 && value < 70) {
    return { score: 4, signal: 'Prudence', emoji: '🟡', color: 'yellow' };
  } else if (value >= 70 && value < 80) {
    return { score: 2, signal: 'Surévalué', emoji: '🔴', color: 'orange' };
  } else {
    return { score: 1, signal: 'VENTE/PRUDENCE (Cupidité)', emoji: '🔴', color: 'red' };
  }
}
