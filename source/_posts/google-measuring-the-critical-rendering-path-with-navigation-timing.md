layout: art
title: 使用导航计时监测渲染关键路径
subtitle: 翻译自谷歌Web开发最佳实践手册
categories: 
- 翻译
tags: 
- HTML
- CSS
date: 2014/5/21
---

没办法监测，就没办法优化。幸运的是，浏览器提供了一系列用来监测渲染关键路径上每一步的接口，叫导航计时接口（Navigation Timing API）
<!-- more -->

###长话短说
* 导航计时为监测渲染关键路径提供了高分辨率的时间戳
* 浏览器在到达渲染关键路径的不同阶段时，会触发一系列的事件

###用于监测的时间戳
好的性能策略都是建立在良好的测量基础之上的。下面这张图说明了导航计时接口提供的API：

![导航计时接口提供的API](http://skyinlayerblog.qiniudn.com/blog/img/2014-5-21/1.png)

上面的每一个标签都提供了一个方法，用于检测每一个页面加载的高分辨率的时间戳。在这里，我们仅仅介绍除了与网络相关的时间戳的哪些一部分时间戳，剩下的我们会在以后的章节作介绍

那么，这些时间戳代表着什么？
* domLoading：整个处理过程开始的时间，也就是浏览器开始解析HTML文档的第一个字节的时间
* domInteractive：浏览器解析完所有HTML，并完成DOM构建的时间
* domContentLoaded：开始构建渲染树的时间点，就是DOM构建完毕后，若没有样式以及阻塞的JavaScript运行的时间点
    * 许多JavaScript框架都会监听这个事件，然后执行他们自己的逻辑。因此浏览器提供了EventStart和EventEnd两个时间戳来允许我们知道具体运行消耗的时间
* domComplete：和名字一样，记录了页面上的所有资源都下载完成（包括图片）以及所有处理逻辑都结束后的时间点。这个时间点过后，浏览器旋转的加载标记将不再旋转了
* loadEvent：最后，浏览器触发onload事件来执行一些其他的应用逻辑

###里程碑
根据HTML的规范，浏览器会检测所有事件：什么时候应该触发事件，应该满足哪些条件等等。对于我们来说，我们只需要关注渲染关键路径上的一些“里程碑”事件：
* domIneractive：说明DOM构建完毕
* domContentLoaded：当DOM和CSSOM都完成后触发
    * 如果没有“解析器阻塞”的JavaScript代码，documentContentLoaded将直接在domInteractive之后触发
* domComplete：当页面及其所有资源全部完毕时触发

```html
<html>
  <head>
    <title>Critical Path: Measure</title>
    <meta name="viewport" content="width=device-width,initial-scale=1.0">
    <link href="style.css" rel="stylesheet">
    <script>
      function measureCRP() {
        var t = window.performance.timing,
          interactive = t.domInteractive - t.domLoading,
          dcl = t.domContentLoadedEventStart - t.domLoading,
          complete = t.domComplete - t.domLoading;
        var stats = document.createElement('p');
        stats.textContent = 'interactive: ' + interactive + 'ms, ' +
            'dcl: ' + dcl + 'ms, complete: ' + complete + 'ms';
        document.body.appendChild(stats);
      }
    </script>
  </head>
  <body onload="measureCRP()">
    <p>Hello <span>web performance</span> students!</p>
    <div><img src="awesome-photo.jpg"></div>
  </body>
</html>
```
上面的例子乍看之下可能比较吓人，但实际上非常简单，导航计时API捕获了相关的时间戳，而我们的JavaScript代码放在onload事件的回调函数中，只有触发了onload事件，才会执行。onload事件只有在domInteractive、domContentLoaded和domComplete事件都完成之后才会触发，所以我们可以捕获到这些时间戳之间的差值，算出每个阶段所耗费的时间

![时间戳检测结果](http://skyinlayerblog.qiniudn.com/blog/img/2014-5-21/2.png)

综上所述，我们可以获得一些“里程碑事件”以及一些简单的函数来输出测量结果。当然我们可以不将这些数据输出到页面上，而是发送这些分析的数据到专门的分析服务器（Google的分析工具就会自动做这些事），这样就能很方便的检测网页的性能，确定候选页面，并尝到优化所带来的甜头。


