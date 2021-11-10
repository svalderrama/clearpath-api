import winston from "winston";

/** Winston logger methods
 *   doc references
 *
 *   format: https://github.com/winstonjs/logform#cli
 *   transports : https://github.com/winstonjs/winston/blob/master/docs/transports.md#winston-core
 */
const { format, createLogger, transports } = winston;
const { combine, timestamp, printf, colorize } = format;

import { LOGGER_CONFIG } from "../config";

/** Storage devices */
const TRANSPORTS = [];

if (process.env.NODE_ENV !== "development") {
  TRANSPORTS.push(
    new transports.Console({
      format: format.combine(format.cli(), format.splat()),
    }),
  );
} else {
  TRANSPORTS.push(new transports.Console());
}

const LoggerInstance = createLogger({
  level: LOGGER_CONFIG.level,
  levels: winston.config.npm.levels,
  defaultMeta: {
    service: "clearpath",
    env: process.env.NODE_ENV || "development",
  },
  format: combine(
    colorize(),
    timestamp(),
    printf((info) => {
      return `${info.timestamp} [${info.level}] : ${JSON.stringify(info.message)}`;
    }),
  ),
  transports: [
    //Consider writing logs to file
    // - Write to all logs with level `info` and below to `quick-start-combined.log`.
    // - Write all logs error (and below) to `quick-start-error.log`.
    //
    // new transports.File({ filename: 'quick-start-error.log', level: 'error' }),
    // new transports.File({ filename: 'quick-start-combined.log' })
    ...TRANSPORTS,
  ],
});

export default LoggerInstance;
