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

  // Données de fallback actualisées (Décembre 2024)
  const fallbackData = {
    current: 21080, // M2 estimé en milliards USD (Déc 2024)
    yearAgo: 20280,
    growth: 3.9, // Croissance YoY estimée
    date: '2024-11-01', // Dernière date estimée
    impactDate: calculateImpactDate(new Date('2024-11-01'), 84),
    isEstimate: true
  };

  if (!apiKey) {
    console.warn('⚠️ FRED API key not configured. Using fallback M2 data.');
    return fallbackData;
  }

  try {
    // Get most recent observation avec timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5s timeout

    const response = await fetch(
      `${FRED_BASE_URL}/series/observations?series_id=${M2_SERIES_ID}&api_key=${apiKey}&file_type=json&sort_order=desc&limit=13`,
      {
        signal: controller.signal,
        mode: 'cors',
        headers: {
          'Accept': 'application/json'
        }
      }
    );

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`FRED API error: ${response.status}`);
    }

    const data = await response.json();
    const observations = data.observations;

    if (!observations || observations.length < 13) {
      throw new Error('Insufficient M2 data from FRED');
    }

    // Most recent value
    const current = parseFloat(observations[0].value);
    const currentDate = observations[0].date;

    // Value from ~12 months ago (13th observation to account for monthly data)
    const yearAgo = parseFloat(observations[12].value);

    // Calculate YoY growth percentage
    const growth = ((current - yearAgo) / yearAgo) * 100;

    console.log('✅ M2 data fetched successfully from FRED');

    return {
      current,
      yearAgo,
      growth: parseFloat(growth.toFixed(2)),
      date: currentDate,
      impactDate: calculateImpactDate(new Date(currentDate), 84),
      isEstimate: false
    };
  } catch (error) {
    if (error.name === 'AbortError') {
      console.warn('⏱️ FRED API timeout. Using fallback M2 data.');
    } else if (error.message.includes('CORS')) {
      console.warn('🚫 CORS error with FRED API. Using fallback M2 data.');
    } else {
      console.warn('⚠️ FRED API error:', error.message, '. Using fallback M2 data.');
    }

    return fallbackData;
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
