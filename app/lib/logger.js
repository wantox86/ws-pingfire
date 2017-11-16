var log4js = require('log4js'); // include log4js
var loggerDebug;
var loggerError;
var loggerInfo;

module.exports = 
{
	setLoggerDebug: function(logger) 
	{
		loggerDebug = logger;
	},
	setLoggerError: function(logger) 
	{
		loggerError = logger;
	},
	setLoggerInfo: function(logger) 
	{
		loggerInfo = logger;
	},
	getLoggerDebug: function()
	{
		return loggerDebug;
	},
	getLoggerError: function()
	{
		return loggerError;
	},
	getLoggerInfo: function()
	{
		return loggerInfo;
	}
}