var db = require('../lib/db/mysql');
var config = require('../config/config').config;


function ping()
{
    this.currentdb = new db();
    var self = this;
    this.find_ping_by_id =  function(jsondata,callback){
        var query = "select * from ping_user where ping_id = '" + jsondata.pingid + "'";
        self.currentdb.DBquery(query,function(status, result){
            callback(status, result);
        });
    },
    this.find_ping_by_token =  function(jsondata,callback){
        var query = "select * from ping_user where token = '" + jsondata.token + "'";
        self.currentdb.DBquery(query,function(status, result){
            callback(status, result);
        });
    },
    this.insert_ping_user = function(param, callback)
    {
        self.currentdb.DBinsert("ping_user",param,function(status, result){
            callback(status, result);
        });
    };
}
module.exports = ping;