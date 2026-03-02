import * as Sentry from "@sentry/react";
import logger from "./logger";

export const initSentry = () => {
  const dsn = import.meta.env.VITE_SENTRY_DSN;

  // Skip Sentry initialization in development to avoid CORS issues
  if (!dsn || import.meta.env.DEV) {
    logger.debug("Sentry DSN not configured or dev mode - error tracking disabled");
    return;
  }

  try {
    Sentry.init({
      dsn,
      environment: import.meta.env.MODE,
      integrations: [
        Sentry.browserTracingIntegration(),
        Sentry.replayIntegration({
          maskAllText: true,
          blockAllMedia: true,
        }),
      ],
      tracesSampleRate: 0.2,
      replaysSessionSampleRate: 0.1,
      replaysOnErrorSampleRate: 1.0,
      maxBreadcrumbs: 50,
      attachStacktrace: true,
      // Only send in production
      beforeSend(event) {
        if (!import.meta.env.PROD) {
          return null;
        }
        return event;
      },
    });

    logger.info("Sentry initialized for production error tracking");
  } catch (error) {
    logger.error("Failed to initialize Sentry", error);
  }
};

export const captureException = (error, context = {}) => {
  logger.error("Exception captured", error, context);
  
  if (import.meta.env.PROD) {
    Sentry.captureException(error, { 
      contexts: { custom: context } 
    });
  }
};

export const captureMessage = (message, level = "info") => {
  logger.info(`Sentry message: ${message}`);
  
  if (import.meta.env.PROD) {
    Sentry.captureMessage(message, level);
  }
};

export const setUser = (user) => {
  if (user) {
    Sentry.setUser({
      id: user.id,
      email: user.email,
    });
  } else {
    Sentry.setUser(null);
  }
};

export default Sentry;