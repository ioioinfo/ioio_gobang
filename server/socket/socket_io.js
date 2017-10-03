/**
 ┌──────────────────────────────────────────────────────────────┐
 │               ___ ___ ___ ___ ___ _  _ ___ ___               │
 │              |_ _/ _ \_ _/ _ \_ _| \| | __/ _ \              │
 │               | | (_) | | (_) | || .` | _| (_) |             │
 │              |___\___/___\___/___|_|\_|_| \___/              │
 │                                                              │
 │                                                              │
 │                       set up in 2015.2                       │
 │                                                              │
 │   committed to the intelligent transformation of the world   │
 │                                                              │
 └──────────────────────────────────────────────────────────────┘
*/

var _ = require('lodash');
var uu_request = require('../utils/uu_request');
var moment = require('moment');
var eventproxy = require('eventproxy');

var moduel_prefix = 'gobang_socket';
var games = ["1"];
var game_map = {};
var socket_map = {};

var host = "http://211.149.248.241:16008/";

exports.register = function(server, options, next) {
    var service_info = "ioio gobang";
    
    //socket
    var io = require('socket.io')(server.listener);

    io.on('connection', function (socket) {
        console.log('New connection!');

        //登录绑定
        socket.on('login', function(msg){
            console.log("user login:" + msg);
            
            var info = JSON.parse(msg);
            
            if (!game_map[info.game_id]) {
                game_map[info.game_id] = [];
            }
            if (!_.includes(game_map,info.game_id)) {
                game_map[info.game_id].push(info.client_id);
            };
            
            socket_map[info.client_id] = socket.id;
            
            var row = {"success":true,"message":"login ok","client_id":info.client_id,"service_info":service_info};
            socket.emit("game",JSON.stringify(row));
        });
        
        socket.on('erupt', function(msg){
            var info = JSON.parse(msg);
            
            //游戏id
            var game_id = info.game_id;
            
            //客户端id
            var client_id = info.client_id;
            
            if (!client_id) {
                var row = {"success":false,"message":"param client_id is null","service_info":service_info};
                socket.emit("game",JSON.stringify(row));
            }
            
            //下子信息
            var str_dot = info.dot;
            
            if (!str_dot) {
                var row = {"success":false,"message":"param dot is null","service_info":service_info};
                socket.emit("game",JSON.stringify(row));
            }
            
            var url = host + "gobang/erupt";
            var data = {"game_id":"1","client_id":client_id,"dot":str_dot}
            
            uu_request.do_post_method(url, data, function(err, info) {
                if (!err) {
                    if (info.success) {
                        //广播消息
                        var client_ids = game_map[game_id];
                        var row = {"success":true,"message":"ok","rows":info.rows,"player":info.player,"service_info":service_info};
                        
                        if (client_ids && client_ids.length > 0) {
                            _.each(client_ids,function(client_id) {
                                var socket_id = socket_map[client_id];
                                if (socket_id) {
                                    io.sockets.connected[socket_id].emit("game",JSON.stringify(row));
                                }
                            });
                        }
                    } else {
                        var row = {"success":false,"message":info.message,"service_info":service_info};
                        socket.emit("game",JSON.stringify(row));
                    }
                } else {
                    var row = {"success":false,"message":"网络错误","service_info":service_info};
                    socket.emit("game",JSON.stringify(row));
                }
            });
        });

        socket.on('disconnect', function(){
            console.log('user disconnected');
        });
    });

    next();
}

exports.register.attributes = {
    name: moduel_prefix
};
