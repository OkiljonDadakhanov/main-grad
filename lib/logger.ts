/**
 * Logger utility for consistent logging across the application.
 * Logs are suppressed in production unless explicitly enabled.
 */

const isDevelopment = process.env.NODE_ENV === "development";
const isLoggingEnabled = process.env.NEXT_PUBLIC_ENABLE_LOGGING === "true";

const shouldLog = isDevelopment || isLoggingEnabled;

export const logger = {
  log: (...args: unknown[]) => {
    if (shouldLog) {
      console.log("[App]", ...args);
    }
  },

  info: (...args: unknown[]) => {
    if (shouldLog) {
      console.info("[Info]", ...args);
    }
  },

  warn: (...args: unknown[]) => {
    if (shouldLog) {
      console.warn("[Warning]", ...args);
    }
  },

  error: (...args: unknown[]) => {
    // Always log errors, but in production could be sent to error tracking service
    console.error("[Error]", ...args);
  },

  debug: (...args: unknown[]) => {
    if (shouldLog) {
      console.debug("[Debug]", ...args);
    }
  },
};

export default logger;
