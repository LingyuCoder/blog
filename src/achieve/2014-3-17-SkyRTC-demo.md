---
layout: art
title: 开源WebRTC库——SkyRTC实例
subTitle: 使用SkyRTC搭建视频、音频聊天室
desc: 忙了几天终于把SkyRTC库上传到NPM上了，并写了一份详细的使用文档，标明了基本的使用方法和类，修正了几个小bug，更多的bug还需要更多的测试，把文档发一下，具体见<a href='https://github.com/LingyuCoder/SkyRTC-demo'>我在Github上的SkyRTC-demo</a>
tags: [WebSocket, NodeJs, WebIM, WebRTC, JavaScript]
categories: [即时通信]
---

{% raw %}
忙了几天终于把SkyRTC库上传到NPM上了，并写了一份详细的使用文档，标明了基本的使用方法和类，修正了几个小bug，更多的bug还需要更多的测试，把文档发一下，具体见[我在Github上的SkyRTC-demo](https://github.com/LingyuCoder/SkyRTC-demo)

##简介
这是一个使用SkyRTC和SkyRTC-client搭建浏览器中音频、视频、文字聊天室的Demo

##安装和使用
1. 安装Node.js及npm环境
2. 下载源码到本地，并解压缩
3. 移动到解压后的目录下
4. 使用命令`npm install`安装所需要的库
5. 运行命令`node server.js`，建议配合`forever`
6. 访问`localhost:3000#roomName`查看效果，其中`roomName`为进入的房间名，不同房间的用户无法互相通信

##功能说明
支持划分房间的在线音频、视频、文字聊天，提供房间内文件共享功能

##SkyRTC项目链接
[SkyRTC项目](https://github.com/LingyuCoder/SkyRTC)

[SkyRTC-client项目](https://github.com/LingyuCoder/SkyRTC-client)
{% endraw %}