layout: art
title: 构建对象模型
subtitle: 翻译自谷歌Web开发最佳实践手册
categories: 
- 翻译
tags: 
- HTML
- CSS
date: 2014/5/20
---

浏览器渲染页面之前会构建DOM树和CSSOM树
<!-- more -->

##长话短说
* 字节(bytes) → 字符(characters) → 标记(tokens) → 节点(nodes) → 对象模型(object model)
* HTML标记将会被转化为一个文档对象模型（Document Object`enter code here` Module，以下简称DOM），而CSS标记将会被转化成一个CSS对象模型（CSSOM）
* DOM和CSSOM是互相独立的数据结构
* Chrome的开发者工具的Timeline里面可以捕捉到DOM和CSSOM的构建和处理

##DOM树构建
比如一段如下HTML
```html
<html>
  <head>
    <meta name="viewport" content="width=device-width,initial-scale=1.0">
    <link href="style.css" rel="stylesheet">
    <title>Critical Path</title>
  </head>
  <body>
    <p>Hello <span>web performance</span> students!</p>
    <div><img src="awesome-photo.jpg"></div>
  </body>
</html>
```

其从字节到DOM树的过程如下图所示：

![从字节到DOM树的过程](http://skyinlayerblog.qiniudn.com/blog/img/2014-5-20/1.png)

具体的过程分为如下几步：
1. 转换（Conversion）：浏览器从网络或硬盘中读取原始的字节，并根据其编码方式转换为独立的字符
2. 标记化（Tokenizing）：浏览器根据W3C的html5标准解析出尖括号内的字符串，每一个标记有自己的意义和规则
3. 对象化（Lexing）：将标记转变为对象，对象内定义了他们的值和规则
4. DOM构建（DOM construction）：由于HTML标记定义了节点之间的关系，且这个关系是树型结构的（某个节点包含多个节点），所以通过一个树来保存

![DOM树的树状结构](http://skyinlayerblog.qiniudn.com/blog/img/2014-5-20/2.png)

整个过程输出的是一个DOM，它是网页的DOM树，后面的处理都会用到DOM树

每一次浏览器要讲HTML标记转换成DOM树，都需要经过这些过程：从字节转换到字符，获取其中的标记，转换标记到节点，通过节点构建DOM树，这些过程需要消耗一定的时间

![Chrome DevTools中的DOM树构建过程](http://skyinlayerblog.qiniudn.com/blog/img/2014-5-20/3.png)

如果打开Chrome开发者工具，并在页面加载时记录Timeline，你讲看到这些步骤的具体时间。在上例中，浏览器花费了约5ms将一个HTML碎片从字节转换到DOM树，当然，如果页面较大，这个时间会更长。在接下来的创建流畅动画的章节中，如果浏览器需要处理大量的HTML，这里很容易成为瓶颈。

DOM树构建好后，我们还需要将其渲染到屏幕上。DOM树中并没有告诉浏览器应该如何渲染这些节点，而完成这个职责的就是下面的CSSOM树了

##CSSOM树构建
当浏览器为页面构建DOM树的时候，它会统计head部分的link标签，指向外部CSS样式文件。浏览器需要这些文件来渲染页面，它会直接发送请求来获取文件

```css
body { font-size: 16px }
p { font-weight: bold }
span { color: red }
p span { display: none }
img { float: right }
```

当然我们也可以在HTML标记中声明CSS样式（内联样式），但保持CSS和HTML的独立使得我们能够将设计与内容分离：设计者基于CSS工作，而开发者则专注于HTML，等等

和HTML一样，我们将CSS样式转换到某种浏览器能够理解且使用的结构。其大致过程如下：

![浏览器将CSS字节转换到CSSOM](http://skyinlayerblog.qiniudn.com/blog/img/2014-5-20/4.png)

浏览器将CSS字节转换成字符，然后构建标记和节点，最后练级到一个叫做CSS对象模型（CSSOM）的树型数据结构

![树状CSSOM](http://skyinlayerblog.qiniudn.com/blog/img/2014-5-20/5.png)

HTML是树状结构很好理解，那么为什么CSSOM也是树状结构呢？在计算页面上对象的需要使用的样式集时，浏览器首先将最常规的样式赋给节点（如果是body元素的孩子，那么会使用body的所有样式），然后递归细化，逐步添加上特殊的规则，这也就是级联样式表中“级联”的意思

上面的树并不是完整的CSSOM树，目前只是展示了样式表中的样式如何互相覆盖。么一个浏览器都提供了一套自己的样式，也就是“用户代理样式（user agent styles）”，在我们不提供任何样式的时候，就会使用这些央视。如果在Chrome开发者工具里面查看“计算后样式（computed styles）”，可以看到所有节点中样式的来源

如果想知道CSS处理花费多长时间，可以在开发者工具中记录Timeline，并查看“Resalcuate”事件：与DOM解析不同的是，这里不会分开的“Parse CSS”各个阶段，解析、CSSOM树构建以及样式的递归计算都放在这一个事件之中

![通过开发者工具查看样式处理](http://skyinlayerblog.qiniudn.com/blog/img/2014-5-20/6.png)

这里可以看到，这次样式处理花费了约0.6ms，涉及页面上的8个元素。那这8个元素从哪儿来？CSSOM和DOM是完全独立的数据结构，浏览器隐藏了很重要的一步，通过渲染树（render tree）将CSSOM和DOM连接起来，下一章就将介绍这个渲染树

