var express = require('express');
var http = require('http');
var bodyParser = require('body-parser');
var logger = require('./app/lib/loggerconfig');
var log4js = require('log4js');
var config = require('./app/config/config').config;


var app = express();

app.use( bodyParser.json() );       
app.use(bodyParser.urlencoded({     
  extended: true
})); 

app.set('port', config.app_listen);

var server = http.createServer(app);
server.listen(config.app_listen);

/*
  Routing for all Available service
*/
app.use('/ws/regtoken', require('./app/controller/webservice/regtoken'));
app.use('/ws/sendpush', require('./app/controller/webservice/sendpush'));


app.use('*',function(req,res){
   res.send('404');
});

module.exports = app;