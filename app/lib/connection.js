var http = require('request');
var config = require('../config/config').config;

function connection(){
    // Set the headers
    var headers = {
        'Content-Type': 'application/json',
        'Authorization': 'key=AAAAC3mKPDo:APA91bEvJIYU9djJFkiqiA-MScBMQrCD5PK_WUJwkVp_DTYzradCnyjSAoH6ju52s2ZhGpbjj8zOq40MiX0fzJ86ulh-90k4Nb20-_2fiUm-wXvC2QUhXeKfzfMs5vhHmLtby91rCIIL'
    };

    this.post =  function(data, callback){
        console.log("to : " + data.to);
        console.log("title : " + data.title);
        console.log("body : " + data.detail);
        var body = {
            "to" : data.to,
            "notification" : 
            {
                "title" : data.title,
                "body" : data.detail,
                "sound" : "default"
            },
            "data" :
            {
                "title" : data.title,
                "body" : data.detail
            }
        };

        var options = {
            url: config.host_fcm,
            method: 'POST',
            headers: headers,
            body: JSON.stringify(body)
        };

        http(options, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                callback(0, 'success');
            }
        })
    }
}

module.exports = connection;