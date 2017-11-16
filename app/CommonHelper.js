var logger = require('./lib/logger');
var crypto = require('crypto');


module.exports = 
{
  printLogError: function(str)
  {
    loggerError = logger.getLoggerError();
    loggerError.info(str);
  },  
  printLogDebug: function(str)
  {
    loggerDebug = logger.getLoggerDebug();
    loggerDebug.info(str);
  },
  printLogConsole: function(req)
  {
    loggerDebug = logger.getLoggerDebug();
    var param = req.body;
    var counter = 1;
    loggerDebug.info(req.protocol + '://' + req.get('host') + req.originalUrl.split('?')[0]);
    for (var key in param) 
    {
      
      if (param.hasOwnProperty(key)) 
      {
        var keyPadded = "Param " + counter + ". "+ key + '                    ';
        keyPadded = keyPadded.substring(0,33);
        loggerDebug.info(keyPadded + " : " + param[key]);
        counter++;
      }
    }
    loggerDebug.info('\n');
  },

  printLogReplyConsole: function(replyJson)
  {
    loggerDebug = logger.getLoggerDebug();
    loggerDebug.info('Reply : \n' + JSON.stringify(replyJson, null, 4));
  },

  randomBase64: function(len)
  {
    return crypto.randomBytes(Math.ceil(len * 3 / 4))
    .toString('base64')   
    .slice(0, len)        
    .replace(/\+/g, '0')  
    .replace(/\//g, '0'); 
  },

  isEmptyObject: function (obj) 
  {
    return !Object.keys(obj).length;
  }
}