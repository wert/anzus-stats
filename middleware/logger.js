'use strict';

const { createLogger, format, transports } = require('winston');
require('winston-daily-rotate-file');
const fs = require('fs');
const path = require('path');


const env = process.env.NODE_ENV || 'development';
const logDir = 'log';

var dailyrotate = new transports.DailyRotateFile({
  filename: `${logDir}/%DATE%.log`,
  datePattern: 'DD-MM-YYYY',
  zippedArchive: true,
  maxSize: '20m',
  level: env === 'production' ? 'info' : 'debug',
  format: format.combine(
    format.colorize(),
    format.printf(info =>`${info.timestamp} ${info.level} [${info.label}]: ${info.message}`)
  )
});
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

var logger = createLogger({
  level: env === 'production' ? 'info' : 'debug',
  format: format.combine(
    format.label({ label: path.basename(process.mainModule.filename) }),
    format.timestamp({ format: 'DD-MM-YYYY HH:mm:ss' })
  ),
  transports: [
    new transports.Console({
      format: format.combine(
        format.colorize(),
        format.printf(info =>`${info.timestamp} ${info.level} [${info.label}]: ${info.message}`)
      )
    }),
    dailyrotate,
  ],
});
logger.stream = {
  write: function(message, encoding) {
    logger.info(message.substring(0,message.lastIndexOf('\n')));
  },
};

module.exports = logger;