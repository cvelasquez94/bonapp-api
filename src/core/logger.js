const fetch = require('node-fetch');

const LOGGLY_TOKEN = process.env.LOGGLY_TOKEN;
const ENVIRONMENT = process.env.ENVIRONMENT

async function sendLogToLoggly(level, message, meta = {}) {
  if (ENVIRONMENT !== 'DEV' && ENVIRONMENT !== 'PROD') return;
  const logMessage = {
    environment: ENVIRONMENT,
    level: level,
    message: message,
    meta: meta,
    timestamp: new Date().toISOString()
  };
  const logglyUrl = `https://logs-01.loggly.com/inputs/${LOGGLY_TOKEN}/tag/bonapp-api/`;

  try {
    const response = await fetch(logglyUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(logMessage)
    });

    if (!response.ok) {
      console.error('Failed to send log to Loggly:', response.statusText);
    }
  } catch (error) {
    console.error('Error sending log to Loggly:', error);
  }
}

module.exports = { sendLogToLoggly };