title: koa-anywhere
subtitle: 通过一条命令，将当前目录变成一个静态文件服务器
tags: 
- NodeJs
- koa
- ES6
categories: 
- NodeJs
date: 2014/9/24
---

最近写了一个快速启动静态文件服务器的NodeJs包[koa-anywhere](https://github.com/LingyuCoder/koa-anywhere)，可以通过一条命令快速的启动静态文件服务器，而且支持多级目录。目前已经发到了NPM上了

<!-- more -->

koa-anywhere
============
通过一条命令，将当前目录变成一个静态文件服务器

需要Node版本：>= 0.11.13


#Install
```
$ npm install -g koa-anywhere
```

#Usage
只需一条简单的命令`ka`就可以启动一个静态文件服务器
```
$ cd <想要共享的目录>
$ ka
```

##Option
###port
通过`-p <端口号>`或者`--port <端口号>`来指定静态文件服务器的端口

默认端口为`3000`

###deep
通过`-d <层级数>`或者`--deep <层级数>`来确定静态文件需要显示的文件层级，超过层级的文件不显示

默认层级数为`3`

###silent
通过`-s`或者`--silent`来决定是否显示日志

默认为`false`，也就是显示日志