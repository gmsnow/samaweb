type LogLevel = "debug" | "info" | "warn" | "error";

const LEVELS: Record<LogLevel, number> = {
  debug: 10,
  info: 20,
  warn: 30,
  error: 40,
};

const isServer = typeof window === "undefined";
const isProd = process.env.NODE_ENV === "production";

const LEVEL_ORDER: LogLevel[] = ["debug", "info", "warn", "error"];

function serialize(args: unknown[]): string {
  return args
    .map((arg) => {
      if (arg instanceof Error) return arg.stack ?? arg.message;
      if (typeof arg === "object")
        try {
          return JSON.stringify(arg);
        } catch {
          return String(arg);
        }
      return String(arg);
    })
    .join(" ");
}

function write(level: LogLevel, context: string, args: unknown[]) {
  const ts = new Date().toISOString();
  const line = `[${ts}] [${level.toUpperCase()}] [${context}] ${serialize(args)}`;
  if (isServer) {
    if (isProd && (level === "error" || level === "warn")) {
      console[level === "error" ? "error" : "warn"](line);
    } else if (!isProd) {
      console[level === "debug" ? "log" : level](line);
    }
  } else if (isProd) {
    if (level === "error") console.error(line);
  }
}

export interface Logger {
  debug(context: string, ...args: unknown[]): void;
  info(context: string, ...args: unknown[]): void;
  warn(context: string, ...args: unknown[]): void;
  error(context: string, ...args: unknown[]): void;
}

const enabledLevels: Set<LogLevel> = new Set(
  LEVEL_ORDER.filter((lvl) => LEVELS[lvl] >= LEVELS["info"])
);

export const logger: Logger = {
  debug: (context, ...args) => {
    if (enabledLevels.has("debug")) write("debug", context, args);
  },
  info: (context, ...args) => {
    if (enabledLevels.has("info")) write("info", context, args);
  },
  warn: (context, ...args) => {
    if (enabledLevels.has("warn")) write("warn", context, args);
  },
  error: (context, ...args) => {
    if (enabledLevels.has("error")) write("error", context, args);
  },
};
