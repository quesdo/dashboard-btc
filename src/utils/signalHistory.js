/**
 * Signal History Tracking
 * Stores and manages trading signal history in localStorage
 */

const STORAGE_KEY = 'btc_signal_history';
const MAX_HISTORY_DAYS = 90; // Keep 90 days of history

/**
 * Save a new signal to history
 */
export function saveSignalToHistory(signal, btcPrice) {
  try {
    const history = getSignalHistory();

    const newEntry = {
      timestamp: Date.now(),
      date: new Date().toISOString(),
      signal: signal.signal,
      strength: signal.strength,
      action: signal.action,
      reason: signal.reason,
      precision: signal.precision,
      entryLevel: signal.entryLevel,
      btcPrice: btcPrice,
      details: signal.details || null
    };

    // Add to beginning of array
    history.unshift(newEntry);

    // Clean up old entries (older than MAX_HISTORY_DAYS)
    const cutoffDate = Date.now() - (MAX_HISTORY_DAYS * 24 * 60 * 60 * 1000);
    const filteredHistory = history.filter(entry => entry.timestamp > cutoffDate);

    // Save back to localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredHistory));

    console.log('📊 Signal saved to history:', newEntry.signal);
    return true;
  } catch (error) {
    console.error('Error saving signal to history:', error);
    return false;
  }
}

/**
 * Get all signal history
 */
export function getSignalHistory() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error reading signal history:', error);
    return [];
  }
}

/**
 * Get signals from last N days
 */
export function getRecentSignals(days = 30) {
  const history = getSignalHistory();
  const cutoffDate = Date.now() - (days * 24 * 60 * 60 * 1000);
  return history.filter(entry => entry.timestamp > cutoffDate);
}

/**
 * Get signal statistics
 */
export function getSignalStats(days = 30) {
  const recentSignals = getRecentSignals(days);

  if (recentSignals.length === 0) {
    return {
      total: 0,
      byType: {},
      byStrength: {},
      averagePrecision: 0
    };
  }

  const byType = {};
  const byStrength = {};
  let precisionSum = 0;
  let precisionCount = 0;

  recentSignals.forEach(signal => {
    // Count by type
    byType[signal.signal] = (byType[signal.signal] || 0) + 1;

    // Count by strength
    byStrength[signal.strength] = (byStrength[signal.strength] || 0) + 1;

    // Calculate average precision
    if (signal.precision) {
      const precisionValue = parseInt(signal.precision.replace('%', ''));
      if (!isNaN(precisionValue)) {
        precisionSum += precisionValue;
        precisionCount++;
      }
    }
  });

  return {
    total: recentSignals.length,
    byType,
    byStrength,
    averagePrecision: precisionCount > 0 ? Math.round(precisionSum / precisionCount) : 0
  };
}

/**
 * Clear all signal history
 */
export function clearSignalHistory() {
  try {
    localStorage.removeItem(STORAGE_KEY);
    console.log('🗑️ Signal history cleared');
    return true;
  } catch (error) {
    console.error('Error clearing signal history:', error);
    return false;
  }
}

/**
 * Export signal history as JSON
 */
export function exportSignalHistory() {
  const history = getSignalHistory();
  const dataStr = JSON.stringify(history, null, 2);
  const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

  const exportFileDefaultName = `btc-signals-${new Date().toISOString().split('T')[0]}.json`;

  const linkElement = document.createElement('a');
  linkElement.setAttribute('href', dataUri);
  linkElement.setAttribute('download', exportFileDefaultName);
  linkElement.click();
}
