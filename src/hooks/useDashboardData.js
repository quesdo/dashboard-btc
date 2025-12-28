import { useState, useEffect, useCallback, useRef } from 'react';
import { fetchBitcoinPrice } from '../api/coingecko';
import { fetchFearGreedIndex, getFearGreedSignal } from '../api/feargreed';
import { fetchM2Data, getM2Signal } from '../api/fred';
import { getDXYData, getDXYTradingSignal, getSSRData, getSSRSignal, getETFFlowsData, getETFFlowsSignal } from '../api/staticData';
import { getATHDistanceScore, calculateTradingScore, calculateMacroScore } from '../utils/scoring';

/**
 * Custom hook to manage all dashboard data fetching and calculations
 */
export default function useDashboardData() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Refs for intervals
  const btcIntervalRef = useRef(null);
  const fearGreedIntervalRef = useRef(null);
  const m2IntervalRef = useRef(null);

  /**
   * Fetch all data and calculate scores
   */
  const fetchAllData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all data in parallel
      const [btcData, fearGreedData, m2Data] = await Promise.all([
        fetchBitcoinPrice().catch(err => ({ error: err.message })),
        fetchFearGreedIndex().catch(err => ({ error: err.message })),
        fetchM2Data().catch(err => ({ error: err.message }))
      ]);

      // Get static data
      const dxyData = getDXYData();
      const ssrData = getSSRData();
      const etfData = getETFFlowsData();

      // Calculate indicators for Trading Score
      const fearGreedSignal = getFearGreedSignal(fearGreedData.value || 50);
      const athSignal = getATHDistanceScore(btcData.price, btcData.ath);
      const dxyTradingSignal = getDXYTradingSignal(dxyData.trend6m);
      const etfSignal = getETFFlowsSignal(etfData.score);

      // Calculate Trading Score
      const tradingScore = calculateTradingScore({
        fearGreedScore: fearGreedSignal.score,
        athScore: athSignal.score,
        dxyScore: dxyTradingSignal.score,
        etfScore: etfSignal.score
      });

      // Calculate indicators for Macro Score
      const m2Signal = getM2Signal(m2Data.growth);
      const ssrSignal = getSSRSignal(ssrData.value);
      const dxyMacroSignal = getDXYTradingSignal(dxyData.trend6m); // Same signal for macro

      // Calculate Macro Score
      const macroScore = calculateMacroScore({
        m2Score: m2Signal.score,
        ssrScore: ssrSignal.score,
        dxyScore: dxyMacroSignal.score
      });

      // Prepare complete data object
      const completeData = {
        btc: {
          price: btcData.price,
          change24h: btcData.change24h,
          marketCap: btcData.marketCap,
          volume24h: btcData.volume24h,
          ath: btcData.ath,
          timestamp: btcData.timestamp
        },
        trading: {
          score: tradingScore,
          fearGreed: {
            value: fearGreedData.value,
            classification: fearGreedData.classification,
            timestamp: fearGreedData.timestamp,
            score: fearGreedSignal.score,
            signal: fearGreedSignal.signal,
            emoji: fearGreedSignal.emoji
          },
          athDistance: {
            distance: athSignal.distance,
            score: athSignal.score,
            signal: athSignal.signal,
            emoji: athSignal.emoji,
            timestamp: btcData.timestamp
          },
          dxy: {
            value: dxyData.value,
            trend6m: dxyData.trend6m,
            score: dxyTradingSignal.score,
            signal: dxyTradingSignal.signal,
            emoji: dxyTradingSignal.emoji,
            dataDate: dxyData.date,
            source: dxyData.source
          },
          etf: {
            value: etfData.score,
            score: etfSignal.score,
            signal: etfSignal.signal,
            emoji: etfSignal.emoji,
            dataDate: etfData.date,
            source: etfData.source
          }
        },
        macro: {
          score: macroScore,
          m2: {
            growth: m2Data.growth,
            current: m2Data.current,
            yearAgo: m2Data.yearAgo,
            score: m2Signal.score,
            signal: m2Signal.signal,
            emoji: m2Signal.emoji,
            date: m2Data.date,
            impactDate: m2Data.impactDate,
            isEstimate: m2Data.isEstimate
          },
          ssr: {
            value: ssrData.value,
            score: ssrSignal.score,
            signal: ssrSignal.signal,
            emoji: ssrSignal.emoji,
            dataDate: ssrData.date,
            source: ssrData.source
          },
          dxy: {
            value: dxyData.value,
            trend6m: dxyData.trend6m,
            score: dxyMacroSignal.score,
            signal: dxyMacroSignal.signal,
            emoji: dxyMacroSignal.emoji,
            dataDate: dxyData.date,
            source: dxyData.source
          }
        }
      };

      setData(completeData);
      setLastUpdate(new Date().toISOString());
      setLoading(false);

      // Save snapshot to localStorage
      saveSnapshot(completeData);

    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError(err.message);
      setLoading(false);
    }
  }, []);

  /**
   * Save daily snapshot to localStorage
   */
  const saveSnapshot = (data) => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const snapshot = {
        date: today,
        price: data.btc.price,
        fearGreed: data.trading.fearGreed.value,
        m2Growth: data.macro.m2.growth,
        dxy: data.trading.dxy.value,
        ssr: data.macro.ssr.value,
        etf: data.trading.etf.value,
        tradingScore: data.trading.score.score,
        macroScore: data.macro.score.score,
        timestamp: new Date().toISOString()
      };

      localStorage.setItem(`btc_snapshot_${today}`, JSON.stringify(snapshot));
    } catch (err) {
      console.error('Error saving snapshot:', err);
    }
  };

  /**
   * Set up auto-refresh intervals
   */
  useEffect(() => {
    if (autoRefresh) {
      // BTC price: every 60 seconds
      btcIntervalRef.current = setInterval(() => {
        fetchAllData();
      }, 60000);

      // Fear & Greed: every hour (3600000ms)
      fearGreedIntervalRef.current = setInterval(() => {
        fetchAllData();
      }, 3600000);

      // M2: once per day (86400000ms)
      m2IntervalRef.current = setInterval(() => {
        fetchAllData();
      }, 86400000);

      return () => {
        if (btcIntervalRef.current) clearInterval(btcIntervalRef.current);
        if (fearGreedIntervalRef.current) clearInterval(fearGreedIntervalRef.current);
        if (m2IntervalRef.current) clearInterval(m2IntervalRef.current);
      };
    } else {
      // Clear all intervals
      if (btcIntervalRef.current) clearInterval(btcIntervalRef.current);
      if (fearGreedIntervalRef.current) clearInterval(fearGreedIntervalRef.current);
      if (m2IntervalRef.current) clearInterval(m2IntervalRef.current);
    }
  }, [autoRefresh, fetchAllData]);

  /**
   * Initial fetch on mount
   */
  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  return {
    data,
    loading,
    error,
    lastUpdate,
    autoRefresh,
    setAutoRefresh,
    refresh: fetchAllData
  };
}
