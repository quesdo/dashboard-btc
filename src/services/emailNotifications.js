import emailjs from '@emailjs/browser';

/**
 * EmailJS Configuration
 * Service: Gmail
 * Template: Trading Signal Alert
 */
const EMAILJS_CONFIG = {
  serviceId: 'service_bitcoin_signals',
  templateId: 'template_signal_alert',
  publicKey: 'YOUR_EMAILJS_PUBLIC_KEY', // To be configured
  toEmail: 'paulweydert@hotmail.fr'
};

/**
 * Initialize EmailJS
 */
export function initEmailJS() {
  if (EMAILJS_CONFIG.publicKey === 'YOUR_EMAILJS_PUBLIC_KEY') {
    console.warn('⚠️ EmailJS not configured. Email notifications disabled.');
    return false;
  }

  emailjs.init(EMAILJS_CONFIG.publicKey);
  return true;
}

/**
 * Send trading signal email notification
 */
export async function sendSignalEmail(signal, btcPrice) {
  // Skip if not configured
  if (EMAILJS_CONFIG.publicKey === 'YOUR_EMAILJS_PUBLIC_KEY') {
    console.log('📧 Email would be sent (not configured):', signal.signal);
    return { success: false, reason: 'not_configured' };
  }

  try {
    const templateParams = {
      to_email: EMAILJS_CONFIG.toEmail,
      signal_type: signal.signal,
      signal_strength: signal.strength,
      signal_action: signal.action,
      signal_reason: signal.reason,
      signal_precision: signal.precision,
      entry_level: signal.entryLevel || 'N/A',
      btc_price: `$${btcPrice.toLocaleString()}`,
      timestamp: new Date().toLocaleString('fr-FR'),
      details: signal.details || ''
    };

    const response = await emailjs.send(
      EMAILJS_CONFIG.serviceId,
      EMAILJS_CONFIG.templateId,
      templateParams
    );

    console.log('✅ Email sent successfully:', response);
    return { success: true, response };
  } catch (error) {
    console.error('❌ Email sending failed:', error);
    return { success: false, error };
  }
}

/**
 * Check if signal is new and should trigger email
 */
export function shouldSendEmail(currentSignal, lastSentSignal) {
  if (!lastSentSignal) return true;

  // Send if signal type changed
  if (currentSignal.signal !== lastSentSignal.signal) return true;

  // Send if strength increased
  const strengthOrder = { 'VERY_STRONG': 4, 'STRONG': 3, 'MEDIUM': 2, 'NEUTRAL': 1 };
  if (strengthOrder[currentSignal.strength] > strengthOrder[lastSentSignal.strength]) {
    return true;
  }

  // Don't send if same signal within last 4 hours
  const fourHoursAgo = Date.now() - (4 * 60 * 60 * 1000);
  if (lastSentSignal.timestamp > fourHoursAgo) return false;

  return false;
}

/**
 * Get last sent signal from localStorage
 */
export function getLastSentSignal() {
  try {
    const stored = localStorage.getItem('lastEmailSignal');
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error('Error reading last signal:', error);
    return null;
  }
}

/**
 * Save signal to localStorage after sending email
 */
export function saveLastSentSignal(signal) {
  try {
    const signalWithTimestamp = {
      ...signal,
      timestamp: Date.now()
    };
    localStorage.setItem('lastEmailSignal', JSON.stringify(signalWithTimestamp));
  } catch (error) {
    console.error('Error saving signal:', error);
  }
}
