const os = require('os')

const winston = require('winston')
const { WinstonGelfTransporter } = require('winston-gelf-transporter')

const { inProduction } = require('@root/util/common')

/**
 * Levels from Winston's documentation
 * https://github.com/winstonjs/winston
 */
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  verbose: 4,
  debug: 5,
  silly: 6,
}

/**
 * Production logger.
 */
const myFormat = winston.format.printf(({ message, level }) => {
  const temp = {
    level: levels[level], // Send integer value. Graylog does not accept strings i.e. "info"
    message,
  }

  return JSON.stringify(temp)
})

const transports = [new winston.transports.Console()]

transports.push(
  new WinstonGelfTransporter({
    handleExceptions: true,
    host: 'svm-116.cs.helsinki.fi',
    port: 9503,
    protocol: 'udp',
    hostName: os.hostname(),
    additional: {
      app: 'fuksilaite',
      environment: 'production',
    },
  }),
)

const productionLogger = winston.createLogger({
  format: myFormat,
  transports,
})

const developmentLogger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), winston.format.json()),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`),
      ),
    }),
  ],
})

const getLogger = () => (inProduction ? productionLogger : developmentLogger)

module.exports = getLogger()
