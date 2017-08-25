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
var r = require('request');
var moment = require('moment');
var eventproxy = require('eventproxy');

var moduel_prefix = 'gobang_main';

exports.register = function(server, options, next) {
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

    ]);

    next();
}

exports.register.attributes = {
    name: moduel_prefix
};
