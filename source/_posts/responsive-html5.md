layout: art
title: 聊聊响应式网页设计中的HTML5
subtitle: 读《响应式Web设计-HTML5和CSS3实践》有感（HTML5部分）
tags: 
- JavaScript
- HTML
- CSS
- 响应式
categories: 
- 前端技术
date: 2014/2/15
---


继上一篇《聊聊响应式网页设计》。这一篇记录了响应式网页设计中的HTML5部分

<!-- more -->

系列文章：

[《聊聊响应式网页设计》](http://lingyu.wang#/art/blog/2014/02/14/responsive-web-design/)

继上一篇《聊聊响应式网页设计》。这一篇记录了响应式网页设计中的HTML5部分。

###HTML5带来了什么？

###何为HTML5？
何为HTML5？wiki上的定义：HTML5是HTML下一个主要的修订版本，现在仍处于发展阶段。目标是取代1999年所制定的HTML 4.01和XHTML 1.0标准，以期能在互联网应用迅速发展的时候，使网络标准达到符合当代的网络需求。

###多了些啥？
相比较HTML4.01而言，其新增了很多有实质价值的东西。具体来说，HTML5添加了许多新的语法特征，其中包括```<video>```, ```<audio>```,和```<canvas>```元素，同时集成了SVG内容。这些元素是为了更容易的在网页中添加和处理多媒体和图片内容而添加的。其它新的元素包括```<section>```, ```<article>```, ```<header>```, 和```<nav>```,是为了丰富文档的数据内容。新的属性的添加也是为了同样的目的。同时也有一些属性和元素被移除掉了。一些元素，像```<a>```, 和```<menu>```被修改，重新定义或标准化了。同时APIs和DOM已经成为HTML5中的基础部分了。HTML5还定义了处理非法文档的具体细节，使得所有浏览器和客户端程序能够一致地处理语法错误。

###为什么现在开始HTML5？
几乎所有现代浏览器都能正确理解常见的HTML5属性，其提供的新的结构元素、视频、音频标签对于老版本的IE可以使用腻子脚本（一段能给老版本浏览器带来新特性的JavaScript代码，如[Modernizr](http://modernizr.com/)）来弥补。

##如何编写HTML5页面？
###使用HTML5文档类型声明
如果你使用了Emmet（原名zencoding），在页面中敲入```html:5```代码，按下CTRL+E，就会自动扩展成如下代码：
```html
<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Document</title>
</head>
<body>
    
</body>
</html>
```
可以看到第一行的文档声明很简洁，没错，这就是HTML5的文档声明。

还记得其他的文档声明吗？
```html
<!-- HTML4.01文档过渡定义类型，此类型定义的文档可以使用HTML中的标签与元素包括一些不被W3C推荐的标签（例如：font、b等），不可以使用框架 -->
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<!-- HTML4.01文档严格定义类型，此类型定义的文档可以使用HTML中的标签与元素，不能包含不被W3C推荐的标签（例如：font、b等），不可以使用框架 -->
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<!-- XHTML1.0文档过渡定义类型，此类型定义的文档可以使用HTML中的标签与元素包括一些不被W3C推荐的标签（例如：font、b等），不可以使用框架 -->
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<!-- XHTML1.0文档严格定义类型，此类型定义的文档只可以使用HTML中定义的标签与元素，不能包含不被W3C推荐的标签（例如：font、b）(梦之都就使用了此类型)，不可以使用框架 -->
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<!-- XHTML1.0文档框架定义类型，等同于XHTML1.0文档过渡定义类型，但可以使用框架 -->
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Frameset//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-frameset.dtd">
<!-- XHTML1.1文档严格定义类型，等同于XHTML1.0文档过渡定义类型 -->
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN" "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">
```

我勒个凑，为什么HTML5的文档声明如此简短？因为HTML5是以简洁的方式高速浏览器用“标准模式”渲染页面。这种思想贯穿HTML5始终。

##细谈HTML5带来的改变
###大小写？无所谓~
下面这两句代码实际上是一样的效果：
```html
<img src="someImage.png" alt="someImage">
<img SRC="someImage.png" aLt="someImage">
```
###引号？无所谓~
下面这两句也是一样的：
```html
<div id="wrapper"></div>
<div id=wrapper></div>
```
###闭合？那是XML才干的事~
下面这两句也是一样的：
```html
<img src="someImage.png" alt="someImage">
<img src="someImage.png" alt="someImage"/>
```
###省略type，敲码更轻松
link标签和script的标签，经常被使用，而主要是CSS文件和JavaScript文件，何不将其作为默认？下面其实也是一样的
```html
<link href="CSS/main.css" rel="stylesheet" type="text/css">
<link href=CSS/main.css rel=stylesheet>

<script type="text/javascript"></script>
<script></script>
```

###a标签能嵌套多个标签了
如今，```<a>```标签之中可以嵌套一组元素了。不过需要注意的是，```<a>```标签不能嵌套```<a>```标签，也不能在```<a>```标签中嵌套表单

###增加了很多语义化元素
HTML5中新增了很多语义化元素，使得HTML也能真正表达页面本质了，这个将在下面详细介绍

##新来的语义化元素们

###section

元素```<section>```用来定义文档或应用程序中的区域（或节）。它的主要功能是为了区分内容区域，如果只是想包裹起来便于设置样式的话，还是用```<div>```吧。HTML5允许每个```<section>```容器有自己独立的大钢结构

比如这个博客中的侧边栏就有类似如下代码：
```html
<section>
    <header>
        <h2>最近的文章</h2>
    </header>
    <ul></ul>
</section>
<section>
    <header>
        <h2>文章类别</h2>
    </header>
    <ul></ul>
</section>
<section>
    <header>
        <h2>文章标签</h2>
    </header>
    <div></div>
</section>
```
其中使用section将最近文章、文章类别、文章标签的区域区分开来

###nav
元素```<nav>```用来定义文档的主导航区域，其中的连接指向其他页面或是当前页面的其他区域。其中经常包含一组链接

比如在这个博客中，左侧的导航栏中有如下代码：
```html
<nav>
    <ul>
        <li><a href="/index.html">首页</a></li>
        <li><a href="/archieves.html">所有文章</a></li>
        <li><a href="/items.html">小玩意儿</a></li>
        <li><a href="/about.html">关于我</a></li>
    </ul>
</nav>
```
用来包含最核心的导航链接

###article
元素```<article>```用来包裹独立的内容片断。和```<section>```很相似。《响应式Web设计》书上对他们俩的区分是真么说的：

_当搭建一个页面是，想想你准备放入```<article>```标签的内容能否作为一个整块而被复制黏贴到另外一个完全不同的网站且能保持完整的意义？另一种办法是，想想包裹在```<article>```中的内容能否在RSS订阅源中独立成一篇文章？应该使用```<article>```标签包裹的内容，最明显的例子就是博客正文_

###aside
元素```<aside>```用来表示与页面主内容松散相关的内容，实践中，一般用来做侧边栏，另外像引文、广告以及导航元素（友情链接）也可以使用

###hgroup
如果有页面有一组```<h1>```, ```<h2>```, ```<h3>```标签时，可以考虑使用```hgroup```将他们包裹，这样HTML5大纲的算法就会只提取第一个标题元素进入文档大纲

###header
元素```<header>```不会被计入大纲，所以不能用其来划分内容结构，应该使用它来包含对区域内容的介绍说明。```<header>```可以用作网站头部的“刊头”区域，也可以用作对其他内容如```<article>```元素的简要介绍

###footer
元素```<footer>```与```<header>```一样,不会计入大钢结构,所以不能用于划分内容结构,但它可以用来包含一些其所在区域的辅助信息,比如一些超链接和版权信息啥的

###address
元素```<address>```用于标注其最近的```<article>```或```<body>```祖先元素的联系信息

##为你的网页生成大纲吧

书中介绍了两个将html转换成大纲的网站: [HTML5 Outliner by gsnedders](http://gsnedders.html5.org/outliner/)和[HTML5 Outliner by hoyois](http://hoyois.github.io/html5outliner/)，其中第二个需要用firefox打开

两者都支持直接输入URL、上传HTML文件、直接敲入HTML内容来生成大纲

比如下面这一段HTML，一个很常见的HTML文档：
```html
<!doctype html>
<html lang="zh">
<head>
    <meta charset="UTF-8">
    <title>标题</title>
</head>
<body>
    <h1>整个文章的主题</h1>
    <header>
        <nav>
            <hgroup>
                <h1>主导航条</h1>
                <h2>这里放置最主要的导航</h2>
            </hgroup>
            <ul>
                <li>导航1</li>
                <li>导航2</li>
                <li>导航3</li>
            </ul>
        </nav>
    </header>
    <aside>
        <h2>侧边栏</h2>
        <section>
            <h3>侧边栏区域1</h3>
            <ul></ul>
        </section>
        <section>
            <h3>侧边栏区域2</h3>
            <ul></ul>
        </section>
        <section>
            <h3>侧边栏区域3</h3>
            <ul></ul>
        </section>
    </aside>
    <section>
        <h1>内容</h1>
        <article>
            <hgroup>
                <h1>第一篇文章</h1>
                <h2>文章副标题</h2>
                <h3>文章描述</h3>
            </hgroup>
            <header>
                <nav>
                    <h2>文章内部导航</h2>
                    <ul>
                        <li>导航1</li>
                        <li>导航2</li>
                        <li>导航3</li>
                    </ul>
                </nav>
            </header>
            <p>正文内容</p>
        </article>
        <article>
            <hgroup>
                <h1>第二篇文章</h1>
                <h2>文章副标题</h2>
                <h3>文章描述</h3>
            </hgroup>
            <header>
                <nav>
                    <h2>文章内部导航</h2>
                    <ul>
                        <li>导航1</li>
                        <li>导航2</li>
                        <li>导航3</li>
                    </ul>
                </nav>
            </header>
            <p>正文内容</p>
        </article>
    </section>
    <footer>一些版权信息</footer>
</body>
</html>
```
生成的大纲如下：

1. 整个文章的主题
    1. 主导航条
    2. 侧边栏
        1. 侧边栏区域1
        2. 侧边栏区域2
        3. 侧边栏区域3
    3. 内容
        1. 第一篇文章
            1. 文章内部导航
        2. 第二篇文章
            1. 文章内部导航

##HTML5的文本级语义元素

###b
元素```<b>```通常用来给文本加粗，如今可以将其仅仅作为样式钩子来使用了

###em
元素```<em>```，HTML5中赋予它的语义是：强调内容中的重点

###i
元素```<i>```，过去只是给文本加斜体，如今它表示的语义是：一小段有不同于语态或语气的文字，或者样子上与普通文章有所差异以便标明不同特点的文字

注意这些元素，其中```<b>```已然会被很多浏览器默认渲染为粗体，而```<i>```则会被渲染为斜体，可以通过设置样式重置来消除浏览器默认的渲染效果

##HTML5的多媒体标签
###视频标签video
如今绝大部分浏览器都支持HTML5的视频和音频，就连IE也从9就支持了，放心大胆的去用吧

使用```<video src="myVideo.ogg"></video>```来嵌入视频，同时可以增加一些其他属性如：
* width：播放器的宽度
* height： 播放器的高度
* controls：为播放器添加控制栏
* autoplay：播放器加载完后自动对视频进行播放
* preload：媒体预加载
* loop：重复播放视频
* poster：定义视频缩略图

同时，由于每个浏览器自身支持的视频格式的不同，可以为了兼容不同的浏览器，定义一个视频源栈，浏览器会从栈顶向下查找，如果找到能播放的格式，就忽略后面的源，对其进行播放，代码如下：
```html
<video width="640" height="360" contorls autoplay preload="auto" loop poster="myVidelPost.jpg">
    <source src="video/myVideo.ogv" type="video/ogg">
    <source src="video/myVideo.mp4" type="video/mp4">
</video>
```

###audio
元素```<audio>```和```<video>```基本一致，除了width、height、poster外基本相同，但```audio```没有可视区域

###响应式设计中的视频
通过设置width和height为百分比来达到响应式的效果，但这样没办法解决iframe中视频的响应问题，可以使用JavaScript来解决，其中[FitVids](http://fitvidsjs.com/)就是一个用来解决iframe中视频响应问题的jQuery插件























