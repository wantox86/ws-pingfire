var log4js = require('log4js'); // include log4js
var logger = require('../lib/logger');

// CONFIG CHANGE ON log4js v 2
log4js.configure({ 
  appenders: {
    out: { type: 'console' }, 
    default: { type: 'dateFile', filename: 'logs/default', "pattern":"-dd-MM-yyyy.log",alwaysIncludePattern:true}, 
    error: { type: 'dateFile', filename: 'logs/error', "pattern":"-dd-MM-yyyy.log",alwaysIncludePattern:true}, 
    info: { type: 'dateFile', filename: 'logs/info', "pattern":"-dd-MM-yyyy.log",alwaysIncludePattern:true},
    debug: { type: 'dateFile', filename: 'logs/debug', "pattern":"-dd-MM-yyyy.log",alwaysIncludePattern:true} 
  },
  categories: {
    default: { appenders: ['out','default'], level: 'info' },
    info: { appenders: ['info','out'], level: 'info' },
    error: { appenders: ['debug','error','out'], level: 'error' },
    debug: { appenders: ['debug','out'], level: 'info' }
  }
});
logger.setLoggerDebug(log4js.getLogger('debug'));
logger.setLoggerError(log4js.getLogger('error'));
logger.setLoggerInfo(log4js.getLogger('info'));
