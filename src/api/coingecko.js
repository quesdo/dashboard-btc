/**
 * CoinGecko API Integration
 * Free tier: 30 calls/minute, 10,000 calls/month
 * Used for: Real-time BTC price, market cap, volume, 24h change
 */

const COINGECKO_BASE_URL = 'https://api.coingecko.com/api/v3';

/**
 * Fetch current Bitcoin data
 * @returns {Promise<{price: number, change24h: number, marketCap: number, volume24h: number, ath: number}>}
 */
export async function fetchBitcoinPrice() {
  try {
    const response = await fetch(
      `${COINGECKO_BASE_URL}/simple/price?ids=bitcoin&vs_currencies=usd&include_market_cap=true&include_24hr_vol=true&include_24hr_change=true`
    );

    if (!response.ok) {
      throw new Error(`CoinGecko API error: ${response.status}`);
    }

    const data = await response.json();
    const btc = data.bitcoin;

    // Get ATH separately
    const coinResponse = await fetch(`${COINGECKO_BASE_URL}/coins/bitcoin?localization=false&tickers=false&community_data=false&developer_data=false`);
    const coinData = await coinResponse.json();

    return {
      price: btc.usd,
      change24h: btc.usd_24h_change,
      marketCap: btc.usd_market_cap,
      volume24h: btc.usd_24h_vol,
      ath: coinData.market_data.ath.usd,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error fetching Bitcoin price:', error);
    throw error;
  }
}

/**
 * Calculate distance from ATH
 * @param {number} currentPrice
 * @param {number} ath
 * @returns {number} Percentage distance (positive = below ATH)
 */
export function calculateATHDistance(currentPrice, ath) {
  return ((ath - currentPrice) / ath) * 100;
}
