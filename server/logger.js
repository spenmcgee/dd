var winston = require('winston');
var colorize = winston.format.colorize;
var combine = winston.format.combine;
var label = winston.format.label;
var printf = winston.format.printf;
var json = winston.format.json;

var logger = winston.createLogger({
  exitOnError: false,
  levels: (winston.config.syslog.levels),
  transports: [new winston.transports.Console()],
//  format: isProduction ? prodFormat() : devFormat()
});

module.exports = logger;
