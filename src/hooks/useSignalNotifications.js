import { useEffect, useRef } from 'react';
import { getPrimarySignal } from '../utils/tradingStrategies';
import {
  initEmailJS,
  sendSignalEmail,
  shouldSendEmail,
  getLastSentSignal,
  saveLastSentSignal
} from '../services/emailNotifications';
import { saveSignalToHistory } from '../utils/signalHistory';

/**
 * Hook to manage trading signal notifications
 * Sends email alerts when strong signals appear
 */
export default function useSignalNotifications(data) {
  const isInitialized = useRef(false);
  const lastCheckedSignal = useRef(null);

  // Initialize EmailJS on mount
  useEffect(() => {
    if (!isInitialized.current) {
      initEmailJS();
      isInitialized.current = true;
    }
  }, []);

  // Check for new signals and send emails
  useEffect(() => {
    if (!data) return;

    const { trading, macro, btc } = data;
    if (!trading || !macro || !btc) return;

    // Get all active signals
    const activeSignals = [];
    try {
      // Import dynamically to avoid circular deps
      const { getAllTradingSignals } = require('../utils/tradingStrategies');
      const signals = getAllTradingSignals(data);
      activeSignals.push(...signals);
    } catch (error) {
      console.error('Error getting signals:', error);
      return;
    }

    const primarySignal = getPrimarySignal(activeSignals);

    // Only send emails for strong signals (not HOLD or weak signals)
    const isStrongSignal = ['VERY_STRONG', 'STRONG'].includes(primarySignal.strength);
    if (!isStrongSignal) return;

    // Save signal to history
    const lastSent = getLastSentSignal();
    const isNewSignal = shouldSendEmail(primarySignal, lastSent);

    if (isNewSignal) {
      // Save to history
      saveSignalToHistory(primarySignal, btc.price);

      // Send email notification
      sendSignalEmail(primarySignal, btc.price).then((result) => {
        if (result.success || result.reason === 'not_configured') {
          // Save signal to prevent duplicate emails
          saveLastSentSignal(primarySignal);

          if (result.success) {
            console.log('📧 Signal email sent successfully!');
          }
        }
      });
    }

    lastCheckedSignal.current = primarySignal;
  }, [data]);

  return null;
}
