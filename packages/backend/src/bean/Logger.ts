import * as winston from "winston";
import { format } from "date-fns";

const LOGFILE_FORMAT = winston.format.printf(
  ({ level, message, timestamp }) => {
    return `${timestamp} ${level}: ${message}`;
  },
);

export let logger: winston.Logger;

const timezoned = (): string => {
  return format(new Date(), "yyyy-MM-dd HH:mm:ss.SSS (z)");
};

export function initLogger(filename: string, level = "info"): void {
  logger = winston.createLogger({
    level,
    transports: [
      new winston.transports.File({
        format: winston.format.combine(
          winston.format.timestamp({ format: timezoned }),
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

export function destroyLogger(): void {
  logger.close();
}
