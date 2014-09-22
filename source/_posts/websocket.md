layout: art
title: 搭建HTML5简易聊天室
subtitle: 使用WebSocket+NodeJs搭建聊天室
tags: 
- WebSocket
- NodeJs
- xmpp
- WebIM
categories: 
- 网站建设
date: 2013/12/8
---

###前面的话###
***
之前曾经写过一个符合xmpp协议的Web IM，但使用的是JSJaC，后台用的也是与之配套的jabber client，发现nodejs的事件模式更适合作为Web IM的客户端。

而传统的ajax轮询机制也早晚被全双工websocket所取代，所以就打算在我的毕业设计的Web IM平台中使用websocket。

在这里调研一下并作出了一个简单的版聊demo，这里讲一下这个简单demo的实现方式

<!-- more -->

###WebSocket###
***
什么是WebSocket？

[WebSocket的协议](http://datatracker.ietf.org/doc/rfc6455/?include_text=1) 目前还没有仔细去研读，有时间研读一下

根据[WebSocket.org](http://www.websocket.org/)上的定义：

> The WebSocket specification—developed as part of the HTML5 initiative—      introduced the WebSocket JavaScript interface, which defines a full-duplex single socket connection over which messages can be sent between client and server. The WebSocket standard simplifies much of the complexity around bi-directional web communication and connection management.

如上所述websocket定义了一个浏览器和服务器之间的全双工的单一的socket连接。

WebSocket的API？

[W3C的WS的API](http://dev.w3.org/html5/websockets/) ，定义了具体的WS的接口，而一般只要注意怎么使用就行了，可以清楚地看到WS客户端的几个事件：

1. onopen  在WS客户端和WS服务器建立连接成功后调用
2. onmessage 在WS服务器给WS客户端发送数据时调用
3. onerror 如果连接失败，发送、接收数据失败或者处理数据出现错误，则会被调用
4. onclose 在WS客户端接收到WS服务器关闭时进行调用

###WebSocket服务器实现###
***
nodejs有很多websocket的三方库，都很实用，在stackoverflow上有人问过具体应该使用哪个库，而回答者给与了[较为全面的解答](http://stackoverflow.com/questions/16392260/which-websocket-library-to-use-with-node-js)

这里面对各个websocket库进行了一个对比，可以根据自己的需要选择。

其中可以注意一下[socket.io](http://socket.io/#home)，它对不同的浏览器有比较好的支持，在不支持websocket的时候可以转变成ajax的轮询等其他的替换，浏览器的支持也相当不错。同时还能和目前比较流行的node的web框架express相结合，其文档的例子写的很好。

由于我只是想搭建一个简单快捷的WS服务器，所以选用了号称probably the fastest WebSocket library for node.js的[ws](https://github.com/einaros/ws) 

在项目中使用npm安装：

     npm install ws

如果需要使用命令行的简易WS客户端，可以：

    npm install ws -g

创建一个WS服务器：

    var WebSocketServer = require('ws').Server,
        wss = new WebSocketServer({
        port: process.env.WSPORT || 3001
    });
这样wss就成为了一个监听3001端口的WS服务器，我们需要为WS服务器创建WS客户端连接时候的事件：

    wss.on('connection', function(ws) {});

这样，在有WS客户端连接我们的WS服务器时就会触发这个事件，但连接之后我么还需要传递信息，所以需要丰富这个事件的回调函数。

回调函数有一个参数ws，这个ws掌管着和WS客户端的连接，其事件也和WS客户端相同，不过不需要onopen。需要绑定的还有message，close：

    wss.on('connection', function(ws) {
        ws.on('message', function(data) {
            
        });
        ws.on('close', function() {
            
        });
    });

message事件在WS客户端给这个WS服务器发数据时调用，data就是这个数据，一般为string类型

close事件在WS客服端给这个WS服务器发送关闭请求时调用

一个简单的聊天室，需要在一个用户加入时告诉其他所有用户有新用户加入，也就是需要一个广播的方法，我们可以根据ws的示例来定义广播方法：

    wss.broadcast = function(data) {
        for (var i in this.clients) this.clients[i].send(JSON.stringify(data));
    };

这里可以看到wss的clients存放了所有与wss相连的WS客户端连接。

在一个WS客户端连接了WS服务器，我们需要把现有的所有房间内用户的信息给新进入房间的用户，并告诉所有房间内的用户有新用户加入，默认新进入房间的用户叫“游客”，修改代码：

    wss.on('connection', function(ws) {
        ws.on('message', function(data) {
        });
        ws.on('close', function() {
        });
        //给每个用户一个单独的id
        ws.uid = uuid.v4();
        //新进入房间的用户的昵称
        ws.nick = "游客";
        //把目前所有房间内人员的信息发给新用户
        for (var i in this.clients) {
            ws.send(JSON.stringify({
                nick: this.clients[i].nick,
                uid: this.clients[i].uid,
                type: "join"
            }));
        }
        //将新加入用户的信息告诉所有房间内的用户
        wss.broadcast({
            nick: ws.nick,
            uid: ws.uid,
            type: "join"
        });
    });

这样新用户加入时的服务器端处理就完成了

在一个用户向服务器发送信息时,需要广播这条信息,同时也要指出发送人的信息,所以修改代码:

    ws.on('message', function(data) {
        wss.broadcast({
            nick: ws.nick,
            uid: ws.uid,
            time: moment(data.time).format("HH:mm:ss"),
            message: data.message,
            type: "message"
        });
    });

在一个WS客户端向WS服务器发送关闭请求时，需要通知其他所有房间内的用户，所以修改代码：

    ws.on('close', function() {
        wss.broadcast({
            nick: ws.nick,
            uid: ws.uid,
            type: "exit"
        });
    });
在一个用户要修改自己的昵称，WS客户端需要向WS服务器发送申请，所以修改代码：

    ws.on('message', function(data) {
        //解析数据
        data = JSON.parse(data);
        //若为message,则为WS客户端向WS服务器发送信息,进行广播
        if (data.type === "message") {
            wss.broadcast({
                nick: ws.nick,
                uid: ws.uid,
                time: moment(data.time).format("HH:mm:ss"),
                message: data.message,
                type: "message"
            });
        //若为nickname,则为WS客户端向WS服务器发送昵称修改请求,则修改用户昵称,并进行广播
        } else if (data.type === "nickname") {
            wss.broadcast({
                oldnick: ws.nick,
                nick: data.nick,
                uid: ws.uid,
                type: "nickname"
            });
            ws.nick = data.nick;
        }
    });

这样一个简单的聊天室的WS服务器就完成了,所有代码如下:

    var WebSocketServer = require('ws').Server,
        wss = new WebSocketServer({
            port: process.env.WSPORT || 3001
        });
    
    wss.broadcast = function(data) {
        for (var i in this.clients) this.clients[i].send(JSON.stringify(data));
    };
    
    wss.on('connection', function(ws) {
        ws.on('message', function(data) {
            data = JSON.parse(data);
            if (data.type === "message") {
                wss.broadcast({
                    nick: ws.nick,
                    uid: ws.uid,
                    time: moment(data.time).format("HH:mm:ss"),
                    message: data.message,
                    type: "message"
                });
            } else if (data.type === "nickname") {
                wss.broadcast({
                    oldnick: ws.nick,
                    nick: data.nick,
                    uid: ws.uid,
                    type: "nickname"
                });
                ws.nick = data.nick;
            }
        });
        ws.on('close', function() {
            wss.broadcast({
                nick: ws.nick,
                uid: ws.uid,
                type: "exit"
            });
        });
        ws.uid = uuid.v4();
        ws.nick = "游客";
        for (var i in this.clients) {
            ws.send(JSON.stringify({
                nick: this.clients[i].nick,
                uid: this.clients[i].uid,
                type: "join"
            }));
        }
        wss.broadcast({
            nick: ws.nick,
            uid: ws.uid,
            type: "join"
        });
    });


###WebSocket客户端实现###
***
在浏览器中,则需要建立一个WS客户端

    //创建一个WS客户端
    var ws = new WebSocket("ws://localhost:3001");

给它按照WebSocket的API绑定事件:
    
    //WS客户端连接到WS服务器后, 设定默认昵称,并加入版聊
    ws.onopen = function(event) {
        $("#nickname").val("游客");
        $logs.append("<div class='alert alert-success'>您已加入版聊</div>");
    };
    //如果WS服务器关闭,给予断开提示
    ws.onclose = function(event) {
        $logs.append("<div class='alert alert-danger'>您已断开版聊</div>");
    };
    //如果WS服务器向这个WS客户端发送信息:
    ws.onmessage = function(event) {
        var data = JSON.parse(event.data);
        //发送文本信息, 显示到页面上
        if (data.type === "message") {
            $chat.append("<p>" + data.nick + "(" + data.time + "): " + data.message + "</p>");
        //有新用户加入, 显示用户加入通知, 并修改当前用户列表
        } else if (data.type === "join") {
            if ($("p[uid='" + data.uid + "']", $users).length === 0) {
                $users.append("<p uid='" + data.uid + "'>" + data.nick + "</p>");
                $logs.append("<div class='alert alert-warning'>" + data.nick + "加入了版聊</div>");
            }
        //有用户离开, 显示用户离开通知, 并修改当前用户列表
        } else if (data.type === "exit") {
            $("p[uid='" + data.uid + "']", $users).remove();
            $logs.append("<div class='alert alert-warning'>" + data.nick + "离开了版聊</div>");
        //有用户修改昵称, 显示用户修改昵称, 修改用户列表
        } else if (data.type === "nickname") {
            $("#nickname").val(data.nick);
            $("p[uid='" + data.uid + "']", $users).text(data.nick);
            $logs.append("<div class='alert alert-warning'>" + data.oldnick + " 修改昵称为 " + data.nick + "</div>");
        }
    };

具体需要发送信息时,使用ws.send发送：
    
    //从WS客户端向WS服务器发送信息数据
    ws.send(JSON.stringify({
        time: new Date().getTime(),
        message: message,
        type: "message"
    }));

需要发送修改昵称请求时，采用同样的方式：

    //从WS客户端向WS服务器发送昵称修改请求
    ws.send(JSON.stringify({
        nick: nick,
        type: "nickname"
    }));

这样一个完整的WS客户端代码：

    //创建一个WS客户端
    var ws = new WebSocket("ws://localhost:3001");
    //WS客户端连接到WS服务器后, 设定默认昵称,并加入版聊
    ws.onopen = function(event) {
        $("#nickname").val("游客");
        $logs.append("<div class='alert alert-success'>您已加入版聊</div>");
    };
    //如果WS服务器关闭,给予断开提示
    ws.onclose = function(event) {
        $logs.append("<div class='alert alert-danger'>您已断开版聊</div>");
    };
    //如果WS服务器向这个WS客户端发送信息:
    ws.onmessage = function(event) {
        var data = JSON.parse(event.data);
        //发送文本信息, 显示到页面上
        if (data.type === "message") {
            $chat.append("<p>" + data.nick + "(" + data.time + "): " + data.message + "</p>");
        //有新用户加入, 显示用户加入通知, 并修改当前用户列表
        } else if (data.type === "join") {
            if ($("p[uid='" + data.uid + "']", $users).length === 0) {
                $users.append("<p uid='" + data.uid + "'>" + data.nick + "</p>");
                $logs.append("<div class='alert alert-warning'>" + data.nick + "加入了版聊</div>");
            }
        //有用户离开, 显示用户离开通知, 并修改当前用户列表
        } else if (data.type === "exit") {
            $("p[uid='" + data.uid + "']", $users).remove();
            $logs.append("<div class='alert alert-warning'>" + data.nick + "离开了版聊</div>");
        //有用户修改昵称, 显示用户修改昵称, 修改用户列表
        } else if (data.type === "nickname") {
            $("#nickname").val(data.nick);
            $("p[uid='" + data.uid + "']", $users).text(data.nick);
            $logs.append("<div class='alert alert-warning'>" + data.oldnick + " 修改昵称为 " + data.nick + "</div>");
        }
    };
    //发送消息按钮事件
    $("#send").click(function(event) {
        var message = $("#message").val();
        if (message.trim() !== "") {
            //从WS客户端向WS服务器发送信息数据
            ws.send(JSON.stringify({
                time: new Date().getTime(),
                message: message,
                type: "message"
            }));
        }
    });
    //修改昵称按钮事件
    $("#changeNick").click(function(event) {
        var nick = $("#nickname").val();
        if (nick.trim() !== "") {
            //从WS客户端向WS服务器发送昵称修改请求
            ws.send(JSON.stringify({
                nick: nick,
                type: "nickname"
            }));
        }
    });


###写在最后###
***
这样一个完整的基于WebSocket的简单聊天室就完成了，试用一下，虽然功能不完善，但是已经可以用了，并且兼容firefox25和chrome

