/**
 * FRED (Federal Reserve Economic Data) API
 * Requires free API key: https://fred.stlouisfed.org/docs/api/api_key.html
 * Rate limit: 120 calls/minute (very generous)
 * Used for: M2 Money Supply data
 */

const FRED_BASE_URL = 'https://api.stlouisfed.org/fred';
const M2_SERIES_ID = 'M2SL'; // M2 Money Stock (seasonally adjusted)

/**
 * Fetch M2 Money Supply data
 * @returns {Promise<{current: number, yearAgo: number, growth: number, date: string, impactDate: string}>}
 */
export async function fetchM2Data() {
  const apiKey = import.meta.env.VITE_FRED_API_KEY;

  if (!apiKey) {
    console.warn('FRED API key not found. Using fallback estimation.');
    // Return fallback data
    return {
      current: 21000, // Estimation in billions
      yearAgo: 20100,
      growth: 4.3, // Estimated YoY growth
      date: new Date().toISOString(),
      impactDate: calculateImpactDate(new Date(), 84),
      isEstimate: true
    };
  }

  try {
    // Get most recent observation
    const response = await fetch(
      `${FRED_BASE_URL}/series/observations?series_id=${M2_SERIES_ID}&api_key=${apiKey}&file_type=json&sort_order=desc&limit=13`
    );

    if (!response.ok) {
      throw new Error(`FRED API error: ${response.status}`);
    }

    const data = await response.json();
    const observations = data.observations;

    // Most recent value
    const current = parseFloat(observations[0].value);
    const currentDate = observations[0].date;

    // Value from ~12 months ago (13th observation to account for monthly data)
    const yearAgo = parseFloat(observations[12].value);

    // Calculate YoY growth percentage
    const growth = ((current - yearAgo) / yearAgo) * 100;

    return {
      current,
      yearAgo,
      growth: parseFloat(growth.toFixed(2)),
      date: currentDate,
      impactDate: calculateImpactDate(new Date(currentDate), 84),
      isEstimate: false
    };
  } catch (error) {
    console.error('Error fetching M2 data:', error);
    // Return fallback on error
    return {
      current: 21000,
      yearAgo: 20100,
      growth: 4.3,
      date: new Date().toISOString(),
      impactDate: calculateImpactDate(new Date(), 84),
      isEstimate: true,
      error: error.message
    };
  }
}

/**
 * Calculate impact date (current date + lag days)
 * @param {Date} date
 * @param {number} lagDays - Default 84 (average of 70-107 range)
 * @returns {string} ISO date string
 */
function calculateImpactDate(date, lagDays = 84) {
  const impactDate = new Date(date);
  impactDate.setDate(impactDate.getDate() + lagDays);
  return impactDate.toISOString();
}

/**
 * Get M2 growth signal
 * @param {number} growth - YoY growth percentage
 * @returns {{score: number, signal: string, emoji: string, color: string}}
 */
export function getM2Signal(growth) {
  if (growth > 8) {
    return { score: 9, signal: 'Expansion forte', emoji: '🟢', color: 'green' };
  } else if (growth >= 5 && growth <= 8) {
    return { score: 7, signal: 'Expansion modérée', emoji: '🟢', color: 'green' };
  } else if (growth >= 3 && growth < 5) {
    return { score: 5, signal: 'Expansion faible', emoji: '🟡', color: 'yellow' };
  } else if (growth >= 0 && growth < 3) {
    return { score: 3, signal: 'Croissance minimale', emoji: '🔴', color: 'orange' };
  } else {
    return { score: 1, signal: 'Contraction', emoji: '🔴', color: 'red' };
  }
}
