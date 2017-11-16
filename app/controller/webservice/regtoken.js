var express = require('express');
var app = express.Router();
var config = require('../../config/config').config;
var ownStatus = require('../../config/status').consts;
var helper = require('../../CommonHelper');
var ping = require('../../model/ping');
var pingModel = new ping();

app.post('/', function (req, res)
{
    helper.printLogConsole(req);
    var replyJSOn = 
    {
        resp: ownStatus.status_6_general_error
    };
    try 
    {
        var query = 
        {
            token: req.body.token
        };
        /*
        Checking if token already on Database will return existing Ping ID for this token.
        if token not found in database will create new one Ping ID and deliver to user.
        */
        pingModel.find_ping_by_token(query, function(status, jsonData)
        {
            if(!helper.isEmptyObject(jsonData))
            {
                /*
                This token is already on database, 
                so return existing Ping ID from database for this token
                */
                var valueData = 
                {
                    ping_id : jsonData[0].ping_id
                }
                replyJSOn.data = valueData;
                replyJSOn.resp = ownStatus.status_0_successful;
                helper.printLogReplyConsole(replyJSOn);
                res.end(JSON.stringify(replyJSOn));
            }
            else
            {
                /*
                This token not found on database, 
                so generate new one Ping ID for this token
                */
                var random_id = helper.randomBase64(6);
                var valueToInsert = 
                {
                    ping_id: random_id,
                    token: req.body.token
                };
                pingModel.insert_ping_user(valueToInsert, function(status, jsonData)
                {
                    if(status == 0)
                    {
                        /*
                        Save to database success, return new ping id to user
                        */
                        var valueData = 
                        {
                            ping_id : random_id
                        }
                        replyJSOn.data = valueData;
                        replyJSOn.resp = ownStatus.status_0_successful;
                        helper.printLogReplyConsole(replyJSOn);
                        res.end(JSON.stringify(replyJSOn));
                    }
                    else
                    {
                        /*
                        ops..Something happen when save to database
                        */
                        replyJSOn.resp = ownStatus.status_6_general_error;
                        helper.printLogReplyConsole(replyJSOn);
                        res.end(JSON.stringify(replyJSOn));
                    }
                });
            };
        });
    } 
    catch (error) 
    {
        helper.printLogDebug(error);
        replyJSOn.resp = ownStatus.status_6_general_error;
        helper.printLogReplyConsole(replyJSOn);
        res.end(JSON.stringify(replyJSOn));
    }
});
module.exports = app;