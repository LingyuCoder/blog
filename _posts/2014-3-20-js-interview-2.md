---
layout: art
title: 前端面试题（15-25）
subTitle: 前端面试题积累系列
desc: 这两天在一问一答上刷了不少JavaScript题，也做了一些其他的前端面试笔试题，在这里记录一下，积少成多，聚沙成塔！
tags: [JavaScript, HTML, CSS]
categories: [笔试面试积累]
---
{% raw %}
##第十五题
绘制一个如图红色十字架，方块长150px，宽50px：

![一个长为150px大小的红十字架](http://skyinlayer.com/images/fe_interview/4.png)

要求：
1. 使用2个div完成
2. 使用3个div完成
3. 使用5个div完成

###两个div实现：
<iframe width="100%" height="500" src="http://jsfiddle.net/skyinlayer/Nak3p/embedded/result,html,css" allowfullscreen="allowfullscreen" frameborder="0">&nbsp;</iframe>

###三个div实现
<iframe width="100%" height="500" src="http://jsfiddle.net/skyinlayer/Nak3p/1/embedded/result,html,css" allowfullscreen="allowfullscreen" frameborder="0">&nbsp;</iframe>

###5个div实现
<iframe width="100%" height="500" src="http://jsfiddle.net/skyinlayer/Nak3p/2/embedded/result,html,css" allowfullscreen="allowfullscreen" frameborder="0">&nbsp;</iframe>

###（附送）一个div实现
<iframe width="100%" height="500" src="http://jsfiddle.net/skyinlayer/Nak3p/3/embedded/result,html,css" allowfullscreen="allowfullscreen" frameborder="0">&nbsp;</iframe>

##第十六题
请将优化如下CSS属性：
###border
```css
border-width: 1px;
border-color: #000;
border-style: solid;
```
###background
```css
background-position:0 0;
background-repeat:no-repeat;
background-attachment:fixed;
background-color:#f00;
background-image:url(background.gif);
```
###font
```css
font-style:italic;
font-family:"Lucida Grande",sans-serif;
font-size:1em;
font-weight:bold;
font-variant:small-caps;
line-height:140%;
```
###list-style
```css
list-style-position:inside;
list-style-type:square;
list-style-image:url(image.gif);
```
###color
```css
color:#336699;
color:#ffcc00;
```
###答案
首先看border的格式：
```css
border：[ border-width ] || [ border-style ] || [ border-color ]
```
所以答案应该是：
```css
border: 1px solid #000;
```

---

然后看看background：
```css
background：[ <bg-layer>, ]* <final-bg-layer> 

<bg-layer> = [ background-image ] || [ background-position ] [ / background-size ]? || [ background-repeat ] || [ background-attachment ] || [ [ background-origin ] || [ background-clip ] ]{1,2}

<final-bg-layer> = [ background-color ] || [ background-image ] || [ background-position ] [ / background-size ]? || [ background-repeat ] || [ background-attachment ] || [ [ background-origin ] || [ background-clip ] ]{1,2}
```
我去，这么长...可以看到如果是多重背景，除了最后一组规则以外，其他的都没有背景色，其他属性的排列顺序是：
1. background-image
2. background-position/background-size
3. background-repeat
4. background-attachment
5. background-origin background-clip

这样，可以得到答案为
```css
background: #f00 url(background.gif) 0 0 no-repeat fixed;
```

---

然后看看font：
```css
font：[ [ <font-style> || <font-variant> || <font-weight> ]? <font-size> [ / <line-height> ]? <font-family> ] | caption | icon | menu | message-box | small-caption | status-bar
```
可以看到其排列顺序：
1. font-style:
2. font-variant
3. font-weight
4. font-size/line-height
5. font-family
6. ...

所以可以得到的答案为：
```css
font: italic bold small-caps 1em/140% "Lucida Grande",sans-serif;
```

---

看看list-style：
```css
list-style：[ list-style-image ] || [ list-style-position ] || [ list-style-type ]
```
这个简单很多，而且没有什么特殊规则，所以答案是：
```css
list-style: url(image.gif) inside square;
```

---

最后看看color，color只有当使用hex表示且形式是`#aabbcc`时可以简写，所以答案是：
```css
color:#369;
color:#fc0;
```

##第十七题
如何设置CSS强制不换行/不截断单词换行/截断单词换行?


首先明确几个相关属性：
1. word-break: 设置或检索对象内文本的字内换行行为
2. word-wrap：设置或检索当内容超过指定容器边界时是否断行
3. white-space：设置或检索对象内空格的处理方式

###word-break
设置或检索对象内文本的字内换行行为
1. normal：依照亚洲语言和非亚洲语言规则，允许在字内换行
2. keep-all：与所有非亚洲语言的normal相同，对于中文、韩文、日文，不允许字断开。适合包含少量亚洲文本的非亚洲文本。 
3. break-all：与亚洲语言的normal相同，允许非亚洲语言在任意字内断开。该值适合包含一些非亚洲文本的亚洲文本，比如使连续的英文字母间断行。 

chrome、opera不支持keep-all

###word-wrap
设置或检索当内容超过指定容器边界时是否断行
1. normal：允许内容顶开或溢出指定的容器边界
2. break-word：内容将在边界内换行，如果需要，单词内部允许断行

###white-space
设置或检索对象内空格的处理方式
1. normal：默认处理方式
2. 用等宽字体显示预先格式化的文本，不合并文字间的空白距离，当文字超出边界时不换行。可查阅pre对象 
3. 强制在同一行内显示所有文本，合并文本间的多余空白，直到文本结束或者遭遇br对象。 
4. 用等宽字体显示预先格式化的文本，不合并文字间的空白距离，当文字碰到边界时发生换行。 
5. 保持文本的换行，不保留文字间的空白距离，当文字碰到边界时发生换行。 

###强制不换行
```css
.no-wrap {
    white-space: nowrap;
}
```
###不截断单词换行
```css
.wrap {
    white-space: normal;
    word-wrap: break-word;
    word-break: normal;
}
```
###强制英文单词断行
```css
.wrap-break-word {
    white-space: normal;
    word-wrap: break-wrod;
    word-break: break-all;
}
```

##第十八题
如果需要给`<a>`设置伪类，应该按照何种顺序进行设置？

解答：如《CSS禅意花园》中的爱恨原则，使用`LoVe/HAte`方式来记忆，设置的顺序为：
1. L——link: 适用于未被访问的链接
2. V——visited：适用于已经访问过的链接
3. H——hover：适用于光标（鼠标指针）指向一个元素，但还未激活它时
4. A——active：适用于一个元素被用户激活时

如果还需要加入focus，规则则变为`LVHFA`

##第十九题
媒体查询中的`only`属性是干什么的？

解答：`only`用来将样式应用于某种特定的媒体类型，可以用来排除不支持媒体查询的浏览器。其实`only`属性很多时候是用来对支持`Media Type`但不支持`Media Query`的设备隐藏样式表的。

其主要有：
1. 若设备支持媒体查询（Media Query），正常调用样式，`only`就当不存在
2. 若设备不支持媒体查询（Media Query），但支持媒体类型（Media Type），样式将不会被调用
3. 如果媒体查询和媒体类型都不支持，样式自然不会被调用

##第二十题
HTML中的文档类型是什么？尽可能多的写出文档类型

解答：Web 世界中存在许多不同的文档。只有了解文档的类型，浏览器才能正确地显示文档。
```html
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Frameset//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-frameset.dtd">
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN" "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">
```

##第二十一题
`data-`属性是干什么的？

解答：HTML5中可以使用`data-`来为元素添加自定义的合法属性，然后我们可以通过dom节点进行取值,比如如下节点：
```html
<div id="some-dom" data-first="asdfasdf" data-second=123 data-third=true></div>
```
然后我们可以通过DOM的`dataset`属性取到它们：
```javascript
> var div = document.getElementById("some-dom");
> var divDataSet = div.dataset;
> console.log(divDataSet);
DOMStringMap {first: "asdfasdf", second: "123", third: "true"} 
```
需要注意一点事，所有的值都是字符串类型

当然如果我们使用`getAttribute()`方法也是同样可行的：
```javascript
> div.getAttribute("data-first");
"asdfasdf"
```

在获得了dataset对象之后，我们可以利用这个对象进行CRUD操作：
```javascript
//修改属性值
> divDataSet.second = 999;
> div.outerHTML
'<div id="some-dom" data-first="asdfasdf" data-second="999" data-third="true"></div>'
//增加新属性
> divDataSet.newProperty = "skyinlayer";
> div.outerHTML
'<div id="some-dom" data-first="asdfasdf" data-second="999" data-third="true" data-new-property="skyinlayer"></div>'
//删除属性
> delete divDataSet.first
> div.outerHTML
'<div id="some-dom" data-second="999" data-third="true" data-new-property="skyinlayer"></div>'
```

##第二十二题
简述一下cookie，sessionStorage，localStorage的区别

###cookie
标准的客户端浏览器状态保存方式，cookie每次发送请求的时候都会被带回到服务器，从而保证了服务器可以知道浏览器当前的状态，但同时也意味着其容量不能太大，最多不能超过4k

###sessionStorage
HTML5提供的两种客户端存储数据的新方法（localStorage、sessionStorage）之一，是针对一个session的数据进行存储，有时间限制。sessionStorage数据的存储金特定于某个绘画中，也就是说数据只会保存到浏览器关闭，但浏览器如果是刷新或重新打开页面，数据还是存在的。每在新标签或者新窗口开启一个新页面，都会初始化一个新的会话。Chrome、Safari、Android版的Webkit对其限制是2.5MB，IE8+和Opera限制是5MB

###localStroage
HTML5提供了两种客户端存储数据的新方法的另一种，它不是针对session的数据进行存储，而是用于持久化的本地存储，除非主动删除数据，否则数据永远不会过期。它的存储空间比cookie要大得多，大多数桌面浏览器会设置每个来源5MB的限制，Chrome和Safari和Android版的Wekit限制则是2.5MB

##第二十三题
优化以下CSS：
```css
.style {
    margin-top: 4px;
    margin-right: 12px;
    padding: 10px 0px 10px 0px;
    background-color: #ff9800;
    background-image: url(/img/logo.png);
    background-size: 240px 80px;
    border-width: 2px;
    border-style: dashed;
    border-color: #ff8800;
}
```

答案： 
```css
.style {
    margin: 4px 12px 0 0;
    padding: 10px 0;
    background: #ff9800 url(/img/logo.png) 240px 80px;
    border: 2px dashed #f80;
}
```

##第二十四题
请列举出CSS中用于隐藏元素的两个属性？两者的差异？还有什么其他方式吗？

这题很有意思，之前曾经在禅意花园上看到过类似的隐藏元素方案

首先两个属性，不用说分别是`display: none`和`visibility: hidden`,区别就是前者不会在文档流中占据位置，而后者会，如下例所示

<iframe width="100%" height="300" src="http://jsfiddle.net/skyinlayer/b5qPx/embedded/result,css,html" allowfullscreen="allowfullscreen" frameborder="0">&nbsp;</iframe>

至于还有什么其他方式，禅意花园上的一种方式就是，将元素的`width`、`height`属性设置成0（块状元素），这样自然就隐藏了

还有一些比较YD的方法，比如说将其移位到屏幕外
```css
.hide {
    /*这样不会占据空间*/
    position: absolute;
    top: -9999em;
}
.hide {
    /*占据空间*/
    position: relative;
    top: -9999em;
}
.hide {
    /*占据空间，且可以点击*/
    opacity: 0;
}
```
等等

另外在设置了`display: none`和`visibility: hidden`的时候，将图片放在背景中将不会加载图片，而放在`<img>`标签中将会加载图片：

![图片加载规则](http://skyinlayer.com/images/fe_interview/7.png)

##第二十五题
有两个盒子A、B，B在A盒子中，俩盒子的CSS如下：
```css
#A {
    position: relative;
    width: 500px;
    height: 500px;
    background: green;
}

#B {
    position: absolute;
    max-width: 300px;
    max-height: 300px;
    background-color: blue;
}
```
请实现B在A中的水平方向和垂直方向居中

解答：这题想简单了以为直接设置负数的`margin-top`和`margin-left`就行了，现在发现不是这么回事，因为它给的是`max-width`和`max-height`，并不能确定元素当前的大小是多少，而且B元素是绝对定位，所以用内联元素的垂直居中方式也不可能，`margin: auto`也不行...所以这里的解法应该是通过JavaScript算出当前元素的大小，然后设定相应的负数`margin`

思路确定后就是要获取元素的`width`和`height`属性，如果有jQuery的话直接`$().width()`或`$().height()`就行了，但是一般情况下笔试都是写原生的JavaScript，所以需要通过原生的方式计算出元素的宽度和高度

也许会想到使用`dom.style.height`和`dom.style.width`来获取高度和宽度，但是这样只适合获取内联样式，并不适合获取计算后的样式，所以我们需要通过其他的方法：
```javascript

var B = document.getElementById("B");
var A = document.getElementById("A");
var bSize = getComputedSize(B);
B.style.marginTop = "-" + bSize.height/2 + "px";
B.style.marginLeft = "-" + bSize.width/2 + "px";
B.style.left = "50%";
B.style.top = "50%";

function getComputedSize(dom){
    var size = {},
        tmp;
    if(dom.currentStyle) {
        //IE提供currentStyle查询
        size.height = dom.currentStyle.height;
        size.width = dom.currentStyle.width;
    } else {
        //其他浏览器使用window.getComputedStyle方法
        tmp = window.getComputedStyle(dom, null);
        size.height = tmp.height;
        size.width = tmp.width;
    }
    //删除末尾的px并转换成数字
    size.height = Number(size.height.replace("px", ""));
    size.width = Number(size.width.replace("px", ""));
    return size;
}
```
这样就可以了

{% endraw %}