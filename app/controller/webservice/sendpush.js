var express = require('express');
var app = express.Router();
var config = require('../../config/config').config;
var ownStatus = require('../../config/status').consts;
var helper = require('../../CommonHelper');
var ping = require('../../model/ping');
var pingModel = new ping();
var conn = require('../../lib/connection');
var connFCM = new conn();

app.post('/', function (req, res)
{
    helper.printLogConsole(req);
    MessageTypeBody = req.body.message_type;
    var replyJSOn = 
    {
        resp: ownStatus.status_6_general_error
    };
    try 
    {
        var query = 
        {
            pingid: req.body.ping_id
        };
        /* Get Token Destination by Ping ID
        */
        pingModel.find_ping_by_id(query, function(status, jsonData)
        {
            if(!helper.isEmptyObject(jsonData))
            {
                /* Data To send PING is Found
                */
                var detailMsg = req.body.msg;
                if(req.body.msg === "")
                {
                    detailMsg = "You GOT PING from " + req.body.ping_id 
                }
                helper.printLogDebug('will send ping to : ' + jsonData[0].token);
                var dataToSend = 
                {
                    to:jsonData[0].token,
                    title: "PING FIRE",
                    detail: detailMsg
                };
                connFCM.post(dataToSend, function(status, callback)
                {
                    if(status == 0)
                    {
                        /* PING Success deliver to Firebase server
                        */   
                        replyJSOn.resp = ownStatus.status_0_successful;
                        helper.printLogReplyConsole(replyJSOn);
                        res.end(JSON.stringify(replyJSOn));
                    }
                    else
                    {
                        /* PING FAILED deliver to Firebase server
                        */   
                        replyJSOn.resp = ownStatus.status_14_fail_sent_fcm;
                        helper.printLogReplyConsole(replyJSOn);
                        res.end(JSON.stringify(replyJSOn));
                    }
                })

            }
            else
            {
                /* Cannot find Destination Ping ID 
                */   
                replyJSOn.resp = ownStatus.status_11_cannot_find_data;
                helper.printLogReplyConsole(replyJSOn);
                res.end(JSON.stringify(replyJSOn));
            };
        });
    } 
    catch (error) 
    {
        helper.printLogReplyConsole(replyJSOn);
        res.end(JSON.stringify(replyJSOn));
    }
});
module.exports = app;