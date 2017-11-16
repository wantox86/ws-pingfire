var mysql      = require('mysql'),
config = require('../../config/dbconfig').config;

function db(){
var self = this;
var pool  = mysql.createPool({
    host     : config.mysql_host,
    user     : config.mysql_user,
    password : config.mysql_password,
    database : config.mysql_db,
    dateStrings:true,
});
this.getQueryFromStruct =  function( jsonStruct, tablename, str_search, str_order, str_limits ){
    var fieldname = '';
    var arrfield = [];
    for(var Keys in jsonStruct) {
        fieldname += ', ' + Keys;
        arrfield.push(Keys);
    }
    fieldname = fieldname.replace(',','').replace(/  /g,'');
    var strQuery ='select '+fieldname+' from '+tablename+' ';
    if (str_search)
        strQuery += str_search;
    if (str_order)
        strQuery += str_order;
    if (str_limits)
        strQuery += str_limits;
    return strQuery;
}
this.setDatatoArray = function( resultRows ){
    var arraysData = [];
    for (i=0; i < resultRows.length; i++){
        json = resultRows[i];
        var arraysub = [];
        for(var Keys in json) {
            arraysub.push(json[Keys]);
        }
        arraysData.push(arraysub);
    }
    return arraysData;
}

this.getInsertQueryFormat = function( jsonData, tableName ){
    var insertQuery ='insert into '+tableName+ '() values ()';
    //for(var names in jsonData){
    //    console.log(names+"|"+jsonData[names]);
    //}
}

this.removeEmptyElementJSON = function (jsonData){
    var jsondat = jsonData;
    for(var names in jsonData){
        if (jsonData[names]=='' || jsonData[names] == null)
        //console.log(names+"|"+jsonData[names]);
            delete jsonData[names];
    }
    return jsondat;
}

this.removeFromJSON = function( jsonData, arrayName ){
    var jsondat = jsonData;
    for(i=0; i < arrayName.length; i++){
        delete jsondat[arrayName[i]];
    }
    return jsondat;
}
this.nulltoJsonValue = function( jsonstruct ){
    var jstruct = jsonstruct;
    for (var names in jsonstruct){
        jstruct.names = null;
    }
    return jstruct;
}
this.getDeleteCondition =  function (jsonData){
    var i = 0;
    var wherecondition = '';
    for(var names in jsonData){
        if (i==0)
            wherecondition += ' '+names+' = '+ jsonData[names];
        else
            wherecondition += ' or '+names+' = '+ jsonData[names];
    }
    return wherecondition;
}
this.DBquery = function( strQuery, cb ){
    pool.getConnection(function(err, connection) {
        if (!err){
            connection.query( strQuery, function(err, rows) {
                console.log(strQuery);
                if (!err) {
                    cb(0,rows);
                    connection.release();
                }else{
                    cb(-1, 'ERROR:'+err);
                    connection.release();
                }
            })
        }else{
            connection.release();
            //throw err;
            console.log("getConnection error: "+err)
        }
    });
}

this.DBinsert = function ( tablename, jsonData, cb ){
    pool.getConnection(function(err, connection) {
        if (!err){
            var query = connection.query('INSERT INTO '+tablename+' SET ?', jsonData, function(err, result) {
                console.log('INSERT INTO '+tablename+' SET ?', jsonData);
                if(!err){
                    connection.release();
                    cb(0,result);
                }else{
                    connection.release();
                    cb(-1, 'ERROR:'+err);
                }
            });
        }else{
            connection.release();
            //throw err;
            cb(-1,'ERROR:'+err);
            console.log("getConnection error: "+err);
        }
    });
}

this.DBinsertbulk = function ( tablename, fields, jsonData, cb ){
    pool.getConnection(function(err, connection) {
        if (!err){
            var query = connection.query('INSERT INTO '+ tablename + ' ' + fields + ' VALUES ?', [jsonData], function(err, result) {
                console.log('INSERT INTO '+ tablename + ' ' + fields + ' VALUES ?', [jsonData]);
                if(!err){
                    connection.release();
                    cb(0,result);
                }else{
                    connection.release();
                    cb(-1, 'ERROR:'+err);
                }
            });
        }else{
            connection.release();
            //throw err;
            cb(-1,'ERROR:'+err);
            console.log("getConnection error: "+err);
        }
    });
}

this.DBupdate = function ( tablename, jsonData, where, cb ){
    pool.getConnection(function(err, connection) {
        if (!err){
            var query = connection.query('UPDATE '+tablename+' SET ?  where '+ where,jsonData , function(err, result) {
                console.log('UPDATE '+tablename+' SET ' + jsonData +' where '+ where);
                if(!err){
                    connection.release();
                    cb(0, result);
                }else{
                    console.log("getConnection error: "+err);
                    connection.release();
                    cb(-1, 'ERROR:'+err);
                }
            });
        }else{
            connection.release();
            //throw err;
            cb(-1, 'ERROR:'+err);
            console.log("getConnection error: "+err);
        }
    });
}

this.DBdelete = function ( tablename, jsonData, cb){
    pool.getConnection(function(err, connection) {
        if (!err){
            var where  = self.getDeleteCondition(jsonData);
            var query = connection.query('DELETE FROM '+tablename+' where '+ where , function(err, result) {
                console.log('DELETE FROM '+tablename+' where ? '+ where);
                if(!err){
                    connection.release();
                    cb(0, result);
                }else{
                    console.log("getConnection error: "+err);
                    connection.release();
                    cb(-1, 'ERROR:'+err);
                }
            });
        }else{
            connection.release();
            //throw err;
            cb(-1, 'ERROR:'+err);
            console.log("getConnection error: "+err);
        }
    });
}

}
module.exports=db;