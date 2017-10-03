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

var moduel_prefix = 'gobang_main';

var host = "http://211.149.248.241:16008/";

exports.register = function(server, options, next) {
    var service_info = "ioio gobang";
    
    var cookie_options = {ttl:10*365*24*60*60*1000};
    var cookie_key = "gobang_cookie";

    //获取玩家编号
    var cookie_get_player = function(request,cb) {
        var state;
        var player = "";

        if (request.state && request.state.cookie) {
            state = request.state.cookie;
            if (state[cookie_key]) {
                player = state[cookie_key];
            }
        }
        
        cb(player);
    };

    server.route([
        //首页
        {
            method: 'GET',
            path: '/index',
            handler: function(request, reply) {
                var cookie = request.state.cookie;
                if (!cookie) {
                    cookie = {};
                }
                cookie[cookie_key] = "1";
                return reply.view("index").state('cookie', cookie, cookie_options);
            },
        },
        
        //首页
        {
            method: 'GET',
            path: '/socket_index',
            handler: function(request, reply) {
                var cookie = request.state.cookie;
                if (!cookie) {
                    cookie = {};
                }
                cookie[cookie_key] = "1";
                return reply.view("socket_index").state('cookie', cookie, cookie_options);
            },
        },
        
        //初始化棋盘
        {
            method: 'POST',
            path: '/init_game',
            handler: function(request,reply) {
                var url = host + "gobang/init_game";
                var data = {"game_id":"1"}
                
                uu_request.do_post_method(url, data, function(err, info) {
                    if (!err) {
                        if (info.success) {
                            return reply({"success":true,"message":"ok","service_info":service_info});
                        } else {
                            return reply({"success":false,"message":info.message,"service_info":service_info});
                        }
                    } else {
                        return reply({"success":false,"message":"网络错误","service_info":service_info});
                    }
                });
            }
        },
        
        //五子棋状态更新
        {
            method: 'GET',
            path: '/status',
            handler: function(request,reply) {
                //客户端id
                var client_id = request.query.client_id;
                
                if (!client_id) {
                    return reply({"success":false,"message":"param client_id is null","service_info":service_info});
                }
                
                var url = host + "gobang/status?game_id=1&client_id=" + client_id;
                uu_request.do_get_method(url, function(err, info) {
                    if (!err) {
                        return reply({"success":true,"message":"ok","rows":info.rows,"player":info.player,"service_info":service_info});
                    } else {
                        return reply({"success":false,"message":"网络错误","service_info":service_info});
                    }
                });
            }
        },
        
        //五子棋下子
        {
            method: 'POST',
            path: '/erupt',
            handler: function(request,reply) {
                //客户端id
                var client_id = request.payload.client_id;
                
                if (!client_id) {
                    return reply({"success":false,"message":"param client_id is null","service_info":service_info});
                }
                
                //下子信息
                var str_dot = request.payload.dot;
                
                if (!str_dot) {
                    return reply({"success":false,"message":"param dot is null","service_info":service_info});
                }
                
                var url = host + "gobang/erupt";
                var data = {"game_id":"1","client_id":client_id,"dot":str_dot}
                
                uu_request.do_post_method(url, data, function(err, info) {
                    if (!err) {
                        if (info.success) {
                            //广播消息
                            
                            return reply({"success":true,"message":"ok","rows":info.rows,"player":info.player,"service_info":service_info});
                        } else {
                            return reply({"success":false,"message":info.message,"service_info":service_info});
                        }
                    } else {
                        return reply({"success":false,"message":"网络错误","service_info":service_info});
                    }
                });
            }
        },

    ]);

    next();
}

exports.register.attributes = {
    name: moduel_prefix
};
