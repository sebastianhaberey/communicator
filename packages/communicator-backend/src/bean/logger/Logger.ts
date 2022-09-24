import * as winston from "winston";

const LOGFILE_FORMAT = winston.format.printf(
  ({ level, message, timestamp }) => {
    return `${timestamp} ${level}: ${message}`;
  },
);

export let logger: winston.Logger;

export function initLogger(filename: string, level = "info"): void {
  logger = winston.createLogger({
    level,
    transports: [
      new winston.transports.File({
        format: winston.format.combine(
          winston.format.timestamp(),
          winston.format.splat(),
          LOGFILE_FORMAT,
        ),
        filename: `${process.cwd()}/logs/${filename}.log`,
      }),
    ],
  });

  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize({
          level: true,
          colors: {
            info: "green",
            debug: "cyan",
            warning: "yellow",
            error: "red",
          },
        }),
        winston.format.splat(),
        winston.format.simple(),
      ),
    }),
  );
}

export function initLoggerForTest(): void {
  logger = winston.createLogger({
    level: "debug",
    transports: [
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.splat(),
          winston.format.simple(),
        ),
      }),
    ],
  });
}

export function destroyLogger(): void {
  logger.close();
}