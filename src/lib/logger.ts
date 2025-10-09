import 'server-only';

import { env } from './env';

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

type LogMethod = (...args: unknown[]) => void;

type Logger = Record<LogLevel, LogMethod> & {
  child(context: Record<string, unknown>): Logger;
};

const levelWeight: Record<LogLevel, number> = {
  debug: 10,
  info: 20,
  warn: 30,
  error: 40,
};

const baseContext: Record<string, unknown> = {
  service: 'backend',
};

function createLogger(context: Record<string, unknown> = baseContext, level: LogLevel = env.LOG_LEVEL): Logger {
  const currentLevelWeight = levelWeight[level];

  const log = (entryLevel: LogLevel, ...args: unknown[]) => {
    if (levelWeight[entryLevel] < currentLevelWeight) return;

    const payload = {
      timestamp: new Date().toISOString(),
      level: entryLevel,
      ...context,
    };

    const formatted = [`[${payload.level.toUpperCase()}]`, payload.timestamp, JSON.stringify(context)];

    switch (entryLevel) {
      case 'debug':
        console.debug(...formatted, ...args);
        break;
      case 'info':
        console.info(...formatted, ...args);
        break;
      case 'warn':
        console.warn(...formatted, ...args);
        break;
      case 'error':
        console.error(...formatted, ...args);
        break;
    }
  };

  const child: Logger = {
    debug: (...args) => log('debug', ...args),
    info: (...args) => log('info', ...args),
    warn: (...args) => log('warn', ...args),
    error: (...args) => log('error', ...args),
    child: (childContext) => createLogger({ ...context, ...childContext }, level),
  };

  return child;
}

export const logger = createLogger();
export type { LogLevel };
