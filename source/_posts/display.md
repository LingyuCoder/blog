layout: art
title: 对比display布局（clearfix）
subtitle: 通过实例对比display的block、inline、inline-block属性
tags: 
- CSS
categories: 
- CSS
date: 2014/3/7
---


最近在看面试题的时候看到很多次出现display的inline、block、inline-block的区别。在这里做一做实验，可以从margin、padding、border、width、height来区别

<!-- more -->

##display: block
###典型元素
如```<div>```、```<p>```、```<h1>```、```<form>```、```<ul>```等等

###缺省宽度
缺省宽度为其容器的100%

###换行
前后均会换行

###设定盒子模型属性时
设定```margin```、```padding```、```border```、```width```、```height```后都会根据设定进行相应显示
```css
.block {
    display: block;
    margin: 1em;
    padding: 1em;
    border: 1em solid transparent;
    width: 10em;
    height: 10em;
}
```
![display: block时的盒子模型](/img/display/1.png)

![display: block时的z真正显示的盒子模型](/img/display/2.png)

##display: inline
###典型元素
如```<span>```、```<a>```、```<label>```、```<input>```、```<img>```、```<strong>```、```<em>```等等

###缺省宽度
宽度为内容宽度，且宽度不可变

###换行
前后均不会换行

###设定盒子模型属性时
设定```width```、```height```均不会起任何作用

设定```margin```时，仅有左右margin会起作用，上下margin无效

设定```padding```与```border```时，上下左右均有效，但不会影响布局（仅仅会拉大background，border显示）
```css
.inline {
    display: inline;
    width: 200em;
    height: 200em;
    margin: 1em;
    padding: 1em;
    border: 1em solid #FF8686;
}
```
![display: inline时真正显示的盒子模型](/img/display/3.png)

![display: inline时的盒子模型](/img/display/4.png)

##display: inline-block
###典型元素
无

###缺省宽度
缺省宽度为内容宽度，可以设置宽度

###换行
前后均不会换行

###设定盒子模型属性时
设定```width```、```height```、```margin```、```padding```、```border```时均会撑大元素，并且与```display:block```时一样显示，但前后不会换行
```css
.inline-block {
    display: inline-block;
    width: 15em;
    height: 15em;
    margin: 1em;
    padding: 1em;
    border: 1em solid #FF8686;
}
```
![display: inline-block时的实际显示的盒子模型](/img/display/5.png)

![display: inline-block时的盒子模型](/img/display/6.png)

###其他
可以通过```verticle-align: middle```等属性来对文字与设定了```display:inline-block```来进行布局

```css
.inline-block {
    display: inline-block;
    width: 15em;
    height: 15em;
    margin: 1em;
    padding: 1em;
    border: 1em solid #FF8686;
    vertical-align: middle;
}
```
![Alt text](/img/display/7.png)

###浏览器兼容性
兼容ie8+、ff26+、chrome31+、safari7+、opera19+，详见[caniuse.com](http://caniuse.com/#search=inline-block)

需要让老版IE兼容，可以通过如下方式：
```css
div {
    display: inline-block;/*触发块元素*/
    *display: inline;/*让块元素呈递为内联对象*/
    *zoom: 1;/*为内联对象触发块元素的layout*/
}
```

##总结
display的这三个常用属性还是有很多陷阱的，面试也经常会问，在这里做一个对比。其实display还有很多新增的table布局的属性，比如```display: table```,```display: table-cell```等等，也可以深入的去试验一下具体的效果。这里把三种对比放在jsfiddle上

<iframe width="100%" height="600" src="http://jsfiddle.net/skyinlayer/KC3Xr/embedded/result,css,html" allowfullscreen="allowfullscreen" frameborder="0">&nbsp;</iframe>

