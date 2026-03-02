const isDev = import.meta.env.DEV;
const isTest = import.meta.env.MODE === 'test';

const LOG_LEVELS = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3,
  NONE: 4,
};

const currentLogLevel = isDev ? LOG_LEVELS.DEBUG : LOG_LEVELS.WARN;

const formatMessage = (level, message, data) => {
  const timestamp = new Date().toISOString();
  return {
    timestamp,
    level,
    message,
    data,
    url: typeof window !== 'undefined' ? window.location.href : '',
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
  };
};

const sendToServer = async (logData) => {
  if (isDev || isTest) return;
  
  try {
    const endpoint = import.meta.env.VITE_LOG_ENDPOINT;
    if (!endpoint) return;
    
    await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(logData),
      keepalive: true,
    });
  } catch (e) {
  }
};

const logger = {
  debug: (message, data = null) => {
    if (currentLogLevel <= LOG_LEVELS.DEBUG && isDev) {
      console.debug(`[DEBUG] ${message}`, data || '');
    }
  },

  info: (message, data = null) => {
    if (currentLogLevel <= LOG_LEVELS.INFO && isDev) {
      console.info(`[INFO] ${message}`, data || '');
    }
  },

  warn: (message, data = null) => {
    if (currentLogLevel <= LOG_LEVELS.WARN) {
      if (isDev) {
        console.warn(`[WARN] ${message}`, data || '');
      }
      sendToServer(formatMessage('WARN', message, data));
    }
  },

  error: (message, error = null, additionalData = null) => {
    if (currentLogLevel <= LOG_LEVELS.ERROR) {
      const errorData = {
        message: error?.message || message,
        stack: error?.stack,
        ...additionalData,
      };
      
      if (isDev) {
        console.error(`[ERROR] ${message}`, errorData);
      }
      
      sendToServer(formatMessage('ERROR', message, errorData));
    }
  },

  track: (eventName, properties = {}) => {
    if (isDev) {
      console.log(`[TRACK] ${eventName}`, properties);
    }
  },

  performance: (metric, value, unit = 'ms') => {
    if (isDev) {
      console.log(`[PERF] ${metric}: ${value}${unit}`);
    }
  },
};

export default logger;

export const captureException = (error, context = {}) => {
  logger.error('Captured Exception', error, context);
};

export const captureMessage = (message, level = 'info', context = {}) => {
  logger[level]?.(message, context);
};
