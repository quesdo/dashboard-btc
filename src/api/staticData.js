/**
 * Static/Manual Data Estimations
 * These values should be updated manually on a weekly/monthly basis
 * Update sources:
 * - DXY: https://www.tradingview.com/symbols/TVC-DXY/
 * - SSR: https://cryptoquant.com/
 * - ETF Flows: https://farside.co.uk/btc/
 */

/**
 * Get current DXY (Dollar Index) data
 * UPDATE WEEKLY: Check TradingView for current DXY value and 6-month trend
 * @returns {{value: number, trend6m: number, date: string}}
 */
export function getDXYData() {
  return {
    value: 108.5, // Current DXY value (UPDATE THIS)
    trend6m: -2.1, // 6-month percentage change (UPDATE THIS)
    date: '2025-12-28', // Last update date (UPDATE THIS)
    source: 'TradingView',
    updateFrequency: 'Weekly'
  };
}

/**
 * Get DXY signal for short-term trading
 * @param {number} trend - 6-month percentage change
 * @returns {{score: number, signal: string, emoji: string, color: string}}
 */
export function getDXYTradingSignal(trend) {
  if (trend < -8) {
    return { score: 9, signal: 'Dollar faible (très bullish BTC)', emoji: '🟢', color: 'green' };
  } else if (trend >= -8 && trend < -4) {
    return { score: 7, signal: 'Dollar en baisse', emoji: '🟢', color: 'green' };
  } else if (trend >= -4 && trend < -1) {
    return { score: 6, signal: 'Dollar légèrement faible', emoji: '🟡', color: 'yellow' };
  } else if (trend >= -1 && trend <= 2) {
    return { score: 5, signal: 'Dollar stable', emoji: '⚪', color: 'gray' };
  } else if (trend > 2 && trend <= 5) {
    return { score: 3, signal: 'Dollar en hausse', emoji: '🔴', color: 'orange' };
  } else {
    return { score: 1, signal: 'Dollar fort (bearish BTC)', emoji: '🔴', color: 'red' };
  }
}

/**
 * Get Stablecoin Supply Ratio
 * UPDATE MONTHLY: Check CryptoQuant for current SSR
 * SSR = (Stablecoin Market Cap) / (Bitcoin Market Cap) × 100
 * @returns {{value: number, date: string}}
 */
export function getSSRData() {
  return {
    value: 18.2, // Current SSR value (UPDATE THIS)
    date: '2025-11-30', // Last update date (UPDATE THIS)
    source: 'CryptoQuant',
    updateFrequency: 'Monthly'
  };
}

/**
 * Get SSR signal
 * @param {number} ssr - Stablecoin Supply Ratio
 * @returns {{score: number, signal: string, emoji: string, color: string}}
 */
export function getSSRSignal(ssr) {
  if (ssr < 15) {
    return { score: 9, signal: 'SIGNAL BOTTOM historique', emoji: '🟢', color: 'green' };
  } else if (ssr >= 15 && ssr < 20) {
    return { score: 7, signal: 'Forte liquidité stablecoin', emoji: '🟢', color: 'green' };
  } else if (ssr >= 20 && ssr < 25) {
    return { score: 5, signal: 'Liquidité modérée', emoji: '🟡', color: 'yellow' };
  } else {
    return { score: 3, signal: 'Faible liquidité', emoji: '🔴', color: 'orange' };
  }
}

/**
 * Get ETF Flows trend score
 * UPDATE WEEKLY: Check Farside Investors for cumulative weekly flows
 * Score range: -5 (massive outflows) to +5 (massive inflows)
 * @returns {{score: number, date: string}}
 */
export function getETFFlowsData() {
  return {
    score: 3, // -5 to +5 scale (UPDATE THIS)
    date: '2025-12-28', // Last update date (UPDATE THIS)
    source: 'Farside Investors',
    updateFrequency: 'Weekly'
  };
}

/**
 * Get ETF Flows signal
 * @param {number} flowScore - ETF flows score (-5 to +5)
 * @returns {{score: number, signal: string, emoji: string, color: string}}
 */
export function getETFFlowsSignal(flowScore) {
  if (flowScore > 5) {
    return { score: 9, signal: 'Entrées massives', emoji: '🟢', color: 'green' };
  } else if (flowScore >= 2 && flowScore <= 5) {
    return { score: 7, signal: 'Entrées positives', emoji: '🟢', color: 'green' };
  } else if (flowScore >= -1 && flowScore < 2) {
    return { score: 5, signal: 'Flux neutres', emoji: '⚪', color: 'gray' };
  } else if (flowScore >= -5 && flowScore < -1) {
    return { score: 3, signal: 'Sorties modérées', emoji: '🔴', color: 'orange' };
  } else {
    return { score: 2, signal: 'Sorties importantes', emoji: '🔴', color: 'red' };
  }
}
