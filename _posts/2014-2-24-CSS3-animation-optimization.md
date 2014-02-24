---
layout: art
title: 如何让CSS3的动画不再卡顿失帧？
subTitle: 编写高性能的CSS3动画
desc: 最近拜读了一下html5rocks上两位大神写的一篇关于CSS3动画性能优化的文章，学到了很多，在这里记录一下，其中的知识都是来源于那篇文章，我只是截取了其中比较关注的内容出来
tags: [css]
categories: [前端技术]
---
{% raw %}
最近拜读了一下[html5rocks](http://www.html5rocks.com/)上几位大神写的一篇关于CSS3动画性能优化的文章，学到了很多，在这里记录一下，其中的知识都是来源于那篇文章，我只是截取了其中比较关注的内容出来，原文地址[High Performance Animations](http://www.html5rocks.com/en/tutorials/speed/high-performance-animations/)

##原理
现代浏览器在使用CSS3动画时，以下四种情形绘制的效率较高，分别是：
* 改变位置
* 改变大小
* 旋转
* 改变透明度

一次动画帧浏览器需要做如下工作：
1. 计算需要被加载到节点上的样式结果（Recalculate style）
2. 为每个节点生成图形和位置（Layout）
3. 将每个节点填充到图层中（Paint Setup和Paint）
4. 组合图层到页面上（Composite Layers）

如果我们需要使得动画的性能提高，需要做的就是减少浏览器在动画运行时所需要做的工作。最好的情况是，改变的属性仅仅印象图层的组合，变换（```transform```）和透明度（```opacity```）就属于这种情况

现代浏览器如Chrome，Firefox，Safari和Opera都对变换和透明度采用硬件加速，但IE10+不是很确定是否硬件加速

##触发重布局的属性
有些节点，当你改变他时，会需要重新布局（这也意味着需要重新计算其他被影响的节点的位置和大小）。这种情况下，被影响的DOM树越大（可见节点），重绘所需要的时间就会越长，而渲染一帧动画的时间也相应变长。所以需要尽力避免这些属性

一些常用的改变时会触发重布局的属性：
盒子模型相关属性会触发重布局：
* width
* height
* padding
* margin
* display
* border-width
* border
* min-height

定位属性及浮动也会触发重布局：
* top
* bottom
* left
* right
* position
* float
* clear

改变节点内部文字结构也会触发重布局：
* text-align
* overflow-y
* font-weight
* overflow
* font-family
* line-height
* vertival-align
* white-space
* font-size

这么多常用属性都会触发重布局，可以看到，他们的特点就是可能修改整个节点的大小或位置，所以会触发重布局

###别使用CSS类名做状态标记
如果在网页中使用CSS的类来对节点做状态标记，当这些节点的状态标记类修改时，将会触发节点的重绘和重布局。所以在节点上使用CSS类来做状态比较是代价很昂贵的

##触发重绘的属性
修改时只触发重绘的属性有：
* color
* border-style
* border-radius
* visibility
* text-decoration
* background
* background-image
* background-position
* background-repeat
* background-size
* outline-color
* outline
* outline-style
* outline-width
* box-shadow

这样可以看到，这些属性都不会修改节点的大小和位置，自然不会触发重布局，但是节点内部的渲染效果进行了改变，所以只需要重绘就可以了
###手机就算重绘也很慢
在重绘时，这些节点会被加载到GPU中进行重绘，这对移动设备如手机的影响还是很大的。因为CPU不如台式机或笔记本电脑，所以绘画巫妖的时间更长。而且CPU与GPU之间的有较大的带宽限制，所以纹理的上传需要一定时间

##触发图层重组的属性
###透明度竟然不会触发重绘？
需要注意的是，上面那些触发重绘的属性里面没有```opacity```（透明度），很奇怪不是吗？实际上透明度的改变后，GPU在绘画时只是简单的降低之前已经画好的纹理的alpha值来达到效果，并不需要整体的重绘。不过这个前提是这个被修改```opacity```本身必须是一个图层，如果图层下还有其他节点，GPU也会将他们透明化
###强迫浏览器创建图层
在Blink和WebKit的浏览器中，一当一个节点被设定了透明度的相关过渡效果或动画时，浏览器会将其作为一个单独的图层，但很多开发者使用```translateZ(0)```或者```translate3d(0,0,0)```去使浏览器创建图层。这种方式可以消除在动画开始之前的图层创建时间，使得动画尽快开始（创建图层和绘制图层还是比较慢的），而且不会随着抗锯齿而导出突变。不过这种方法需要节制，否则会因为创建过多的图层导致崩溃
###Chrome中的抗锯齿
Chrome中，非根图层以及透明图层使用grayscale antialiasing而不是subpixel antialiasing，如果抗锯齿方法变化，这个效果将会非常显著。如果你打算预处理一个节点而不打算等到动画开始，可以通过这种强迫浏览器创建图层的方式进行
###transform变换是你的选择
我们通过节点的```transform```可以修改节点的位置、旋转、大小等。我们平常会使用```left```和```top```属性来修改节点的位置，但正如上面所述，```left```和```top```会触发重布局，修改时的代价相当大。取而代之的更好方法是使用```translate```，这个不会触发重布局

##JS动画和CSS3动画的比较
我们经常面临一个抉择：是使用JavaScript的动画还是使用CSS的动画，下面将对比一下这两种方式
###JS动画
缺点：JavaScript在浏览器的主线程中运行，而其中还有很多其他需要运行的JavaScript、样式计算、布局、绘制等对其干扰。这也就导致了线程可能出现阻塞，从而造成丢帧的情况。

优点：JavaScript的动画与CSS预先定义好的动画不同，可以在其动画过程中对其进行控制：开始、暂停、回放、中止、取消都是可以做到的。而且一些动画效果，比如视差滚动效果，只有JavaScript能够完成

###CSS动画
缺点：缺乏强大的控制能力。而且很难以有意义的方式结合到一起，使得动画变得复杂且易于出问题。
优点：浏览器可以对动画进行优化。它必要时可以创建图层，然后在主线程之外运行。

##前瞻
Google目前正在探究通过JS的多线程（Web Workers）来提供更好的动画效果，而不会触发重布局及样式重计算

##结论
动画给予了页面丰富的视觉体验。我们应该尽力避免使用会触发重布局和重绘的属性，以免失帧。最好提前申明动画，这样能让浏览器提前对动画进行优化。由于GPU的参与，现在用来做动画的最好属性是如下几个：
* opacity
* translate
* rotate
* scale

也许会有一些新的方式使得可以使用JavaScript做出更好的没有限制的动画，而且不用担心主线程的阻塞问题。但在那之前，还是好好考虑下如何做出流畅的动画吧

{% endraw %}
