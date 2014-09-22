layout: art
title: 前端面试题（26-35）
subtitle: 前端面试题积累系列
tags: 
- JavaScript
- HTML
- CSS
categories: 
- 笔试面试积累
date: 2014/3/24
---

这两天在一问一答上刷了不少JavaScript题，也做了一些其他的前端面试笔试题，在这里记录一下，积少成多，聚沙成塔！

<!-- more -->


##第二十六题
简述一下什么是JSONP？它与AJAX有什么不同？

###JSONP是什么
JSONP看似和JSON很像，但实际上完全不同，JSON是一种数据交换格式，而JSONP则是一种非官方跨域数据交互协议。由于在页面中，Ajax直接请求存在跨域无权限访问的问题，但使用拥有`src`属性的标签（`<script>`, `<img>`, `<iframe>`）能不受跨域影响，所以一种比较普遍的方式就是通过`<script>`标签包裹可执行的JavaScript代码，代码内部包含请求所需要的数据和请求响应后需要被触发的回调函数。为了便于客户端使用数据，逐渐就形成了JSONP。它的一个要点就是允许用户传递一个回调函数的参数给服务端，然后服务端将JSON数据包裹在这个回调函数中，这样客户端就可以随意定制自己的函数来自动处理返回的数据了

###简单的JSONP实现
一个简单的实现：
```javascript
function getComments(data){
    console.log(data);
}

function getJSON(url){
    var script = document.createElement('script');
    script.setAttribute('src', url);
    document.head.appendChild(script);
}

getJSON("http://api.duoshuo.com/threads/counts.jsonp?short_name=skyinlayer&threads=/blog/2014/03/20/js-interview-2&callback=getComments");
```
这里通过JSONP去获取我在多说中的一篇文章下的所有评论，并通过`getComments()`方法显示出来，由于JSONP返回的数据一定是一段可执行的JavaScript代码，所以通过将其包裹在`<script>`标签中，在获取后执行。可以看一下获取到的实际内容：
```javascript
getComments({"response":{"\/blog\/2014\/03\/20\/js-interview-2":{"thread_id":"1158950126861942862","channel_key":null,"thread_key":"\/blog\/2014\/03\/20\/js-interview-2","comments":0,"reposts":0,"likes":0,"weibo_reposts":0,"qqt_reposts":0}},"options":{"comments_zero":"暂无评论","comments_one":"1","comments_multiple":"{num}"},"code":0});
```
不是很好看，格式化一下：
```javascript
getComments({
    "response": {
        "\/blog\/2014\/03\/20\/js-interview-2": {
            "thread_id": "1158950126861942862",
            "channel_key": null,
            "thread_key": "\/blog\/2014\/03\/20\/js-interview-2",
            "comments": 0,
            "reposts": 0,
            "likes": 0,
            "weibo_reposts": 0,
            "qqt_reposts": 0
        }
    },
    "options": {
        "comments_zero": "暂无评论",
        "comments_one": "1",
        "comments_multiple": "{num}"
    },
    "code": 0
});
```
这样就一目了然了，其实JSONP返回的就是一个函数调用，具体调用的函数名称就是我们传递给服务器的callback方法，由于我们自己定义了处理函数，只需要将数据作为参数，调用这个函数就行了

###jQuery中的JSONP
jQuery中可以使用`.getJSON()`方法来使用JSONP，如果在url中出现了类似`callback=?`字段，jQuery将会使用JSONP的方式进行处理

jQuery还提供了`.ajax`方法，将其`dataType`设置成`jsonp`就能按照JSONP方式获取数据，但实际上JSONP和ajax是两码事，jQuery只是为了方便使用将其包裹在一起，这也是很多人（包括我）误以为JSONP就是Ajax的原因

jQuery的JSONP实现机制一样，不过它做了一层封装，生成了一个随机的函数名进行JSONP请求，生成的JSONP回调函数名称大致如下`jQuery200001010612421669066_1395458842940`,它内部会定义一个同名函数，在其内部调用我们传给jQuery的回调函数

##第二十七题
JavaScript中的null、undefined、undeclared的区别

解答：首先需要明确的是，`null`、`undefined`是JavaScript中的两个值类型，而`undeclared`则是语法错误，表明变量未定义。`typeof null`的值是`'object'`，这也就说明了null的意思是变量是一个不存在的对象（但它还是对象），而undefined则代表着变量已经声明，但未赋值

##第二十八题
实现一个如下的数组复制方法：`[1,2,3,4,5].duplicator()`，返回结果`[1,2,3,4,5,1,2,3,4,5]`

解答：
这题看似很简单，但是数组内部的元素并没有确定，所以完全可能是对象甚至是数组，所以这题实际上是考的深度复制，相当复杂：
```javascript
Object.prototype.deepClone = function() {
    var result = Object.prototype.toString.call(this) === '[object Array]' ? [] : {},
        hasOwnProperty = Object.prototype.hasOwnProperty,
        deepClone = Object.prototype.deepClone,
        item,
        tmp;
    for (item in this) {
        tmp = this[item];
        if(typeof item === 'object'){
            result[item] = tmp.deepClone();
        } else {
            result[item] = tmp;
        }
    }
    return result;
};

Array.prototype.duplicator = function(){
    return this.concat(this.deepClone());
};

var arr = [1,2,3,4,5];
console.log(arr.duplicator());
```

##第二十九题
谈谈你对Web标准的理解

参考资料： [浅谈web标准、可用性、可访问性](http://www.alibuybuy.com/posts/55190.html)

###什么是Web标准
Web标准不是一个标准，而是一系列标准的集合。网页主要由三部分组成：结构、表现和行为。对应的标准也分为三个方面：结构化标准语言（XHTML、XML），表现标准语言（CSS），行为标准主要包括对象模型（W3C DOM）、ECMAScript等

###为什么要遵循Web标准
遵循Web标准有如下优点：
1. 代码的效率：在HTML文件中使用最精简的代码，而把样式也页面布局信息包含进CSS文件中。放在服务器上的文件会变小，下载文件需要时间短。同时CSS文件支持缓存，加载速度更快
2. 易于维护：页面的样式和布局信息保存在单独的CSS文件中，可在多个页面中引入相同的CSS文件达到网站的一致性，同时需要修改时也仅仅需要修改单独的CSS文件中内容，更加易于维护
3. 可访问性：对于那些视力受损（盲人、色盲、色弱等等）的用户，通过屏幕阅读器使用键盘命令将网页的内容读给他们听。以语义化的HTML（结构和表现相分离的HTML）编写的网页文件，就可以让此类用户更容易导航，且网页文件中的总要信息也更有可能被这些用户找到
4. 设备兼容性：纯HTML，无附加样式信息，可以针对具有不同特点的设备而被重新格式胡，只需要引入另外一套样式表即可。同时CSS本身也可以让你为不同的呈现方式和媒体类型规定不同而样式表
5. 网络爬虫/搜索引擎：搜索引擎使用“爬虫”，解析网页。语义化的HTML能更加快速的被解析，从而知道哪些才是重要的内容，会极大的影响网页在搜索结果中排名

##第三十题
简述XMLHttpRequest对象，并说明其如何使用

###什么是XMLHttpRequst对象
XMLHttpRequest对象是Ajax的核心，用于在后台与服务器中交换数据，使用它能够：
1. 在不重新加载页面的情况下更新网页
2. 在页面已加载后从服务器请求数据
3. 在页面已加载后从服务器接收数据
4. 在后台服务器发送数据

需要注意的是所有现代浏览器都支持XMLHttpRequest，但它并不再W3C标准的定义之中...

###如何使用
```javascript
//创建一个XMLHttpRequest对象
var xhr = new XMLHttpRequest();
//定义请求方法
var type = "GET";
//定义获取数据的URL
var url = "/someAction"
//定义异步执行还是同步执行
var aysnc = true;
//定义需要发送的数据
var data = JSON.stringify({
    param : "someProperty"
});
//确定XMLHttpRequest状态变换时的回调函数
xhr.onreadystatechange = function(){
    if(xhr.readyState === 4){
        //loaded
        if(xhr.status === 200){
            //200 成功
        } else {
            //失败
        }
    }
};
//确定XMLHttpRequest执行的参数
xhr.open(type, url, async);
//发送请求
xhr.send(data);
```

##第三十一题
简述网页的可用性、可访问性

###什么是可用性？
可用性（Usability）指的是产品对用户来说有效、易学、高效、好记、少错和令人满意程度，是交互式产品额重要质量指标，是产品竞争力的核心

###什么是可访问性？
可访问性（Acessibility）指的是：Web内容对于残障用户的可阅读和可理解性。同时提升可访问性也可以让普通用户更容易理解Web内容

##第三十二题
DOM操作，如何添加、移除、移动、复制、创建和查找节点

创建节点：
1. createDocumentFragment()
2. createElement()
3. createTextNode()
4. cloneNode() （可传入bool型参数表明是否复制所有子节点）

添加：
1. appendChild()

移除：
1. removeChild()

替换：
1. replaceChild()

插入：
1. insertBefore()将新元素做为父元素的最后一个子元素进行添加

查找：
1. getElementsByTagName()：通过标签查找，返回一个类似数组的Object对象
2. getElementsByName(): 通过Name属性查找，返回一个类似数组的Object对象
3. getElementById()：通过元素id查找，返回一个DOM对象，否则返回null

修改：
1. innerHTML改变节点内部结构
2. style.property改变样式

遍历：
1. childNodes 获取所有子元素的列表

属性
1. getAttribute()
2. setAttribute()

##第三十三题
简介HMTL5中的语义元素

###语义化元素的优点
1. 使网页结构更清晰
2. 使代码可读性增强，便于修改和维护
3. 可访问性
4. 搜索引擎优化
###article
代表文档、页面或应用程序中独立的、完整的、可以独自被外部引用的内容。article通常有自己的标题（一般放在一个header元素里面），有时候还会有自己的脚注（放在其footer元素中）
###section
用于对网站或应用程序中页面上的内容进行分块。一个section元素通常由内容及其标题组成。如果一个容器只是为了被定义样式或通过脚本定义行为时，建议使用div。需要给section增加一个标题，不建议给没有标题的内容区块使用section元素

不要将secion和article混淆使用，article元素可以看成一种特殊种类的section元素，它比section元素更强调独立性。即section元素强调分段或分块，而artcle强调独立性，具体来说，如果一块内容相对来说比较独立、完整的时候，应该使用article，如果想将一块内容分成几段，应该使用section
###nav
一个可以用作页面导航的链接组，其中的导航元素链接到其他页面或当前页面的其他部分。一般只将主要的、基本的链接组元素放进nav元素即可
###aside
用来表示当前页面或文章的附属信息部分，它可以包含当前页面或主要内容相关的引用、侧边栏、广告、导航条，以及其他类似的有别于主要内容的部分。它主要由两种用法
1. 被包含在article元素中作为主要内容的附属信息部分，其中的内容可以是与当前文章有关的参考资料、名词解释等等
2. 在article元素之外使用，作为页面或站点全局的附属信息部分

###time与微格式
微格式，是一个利用HTML的class属性来网页添加附加信息的方法

time用来无歧义地、明确地对机器的日期和时间进行编码，并且让人易读的方式来展现他，它有一个pubdate可选属性（boolean值），用于表示这个time元素代表了文章（存在于article元素中时）或整个网页的发布日期

###header
一种具有引导和导航作用的结构元素，通常用来防止整个页面或页面内的一个内容区块的标题，但也可以包含其他内容。一个网页并未限制header元素的个数，可以拥有多个，可以为每个内容区块（article、section）增加一个header元素。HTML5中，一个header元素至少要包含一个heading元素（h1~h6），也可以包括一个hgroup元素，最新的W3C HTML5标准，它还可以包括nav元素

###hgroup
将标题及其子标题进行分组的元素，通常会将h1~h6元素进行分组

###footer
作为其上层父级内容区块或是一个根区块的脚注，通常包括其相关区块的脚注信息。页面中也未限制footer元素的个数，也可以为article元素或section元素添加footer元素
###address
用来呈现联系信息，包括文档作者或文档维护者的名字、他们的网站链接、电子邮箱、真实地址、电话号码等

###兼容性
也可以通过js插件的形式为不支持HTML5语义化元素的浏览器添加HTML5元素支持，一般是使用`html5shiv`
```html
<!--[if lt IE 9]>
<script src="dist/html5shiv.js"></script>
<![endif]-->
```
##第三十四题
什么是事件的冒泡？如何阻止冒泡？如何阻止事件的默认行为？什么是事件代理？

###事件的冒泡
在某个元素上触发某类事件，这个事件会向元素的父级元素传播，由里到外，直至它被处理或者它到达了元素层次的最顶层

另外关于事件的几个需要注意的地方：
1. 事件冒泡只是事件处理方式的一种，一共有两种事件处理的方式 1) 从里到外的冒泡型事件  2) 从外到里的捕获型事件
2. 不是所有时间都能冒泡，有很多事件不冒泡：`blur`、`focus`、`load`、`unload`
3. 阻止冒泡不能阻止对象的默认行为

###阻止冒泡
可以使用`event.stopPropagation()`来阻止冒泡

比如如下HTML结构：
```html
<div id="parent">
    <p>这是父元素</p>
    <div id="child">这是子元素</div>
</div>
```

为其添加事件处理器：
```javascript
var parent = document.getElementById("parent");
var child = document.getElementById("child");
var clickHandler = function(evt){
    console.log(this.id + " is clicked");
};
//采用冒泡方式处理事件，如果要采用捕获方式处理，将第三个参数改为true
parent.addEventListener("click", clickHandler, false);
child.addEventListener("click", clickHandler, false);
```

点击子元素后可以看到console框中出现如下结果

![console中显示parent元素和child元素都被点击了](http://lingyu.wang/img/fe_interview/6.png)

修改处理函数，添加`stopPropagaton()`方法：
```javascript
var clickHandler = function(evt){
    console.log(this.id + " is clicked");
    evt.stopPropagation();
};
```

再次点击子元素，console中将是如下结果

![console中仅显示child元素都被点击了](http://lingyu.wang/img/fe_interview/7.png)

###阻止事件的默认行为
在平常我们经常会遇到一个表单中有个提交按钮（type为submit），用于提交表单，但是我们不希望它直接提交，而是希望将其元素值提取之后进行ajax交互，于是就需要屏蔽提交按钮默认行为

我们可以使用`event.preventDefault()`来阻止元素事件的默认行为

###事件代理
如果我们有一个ul元素，其中有100个li元素，每个点击都会触发一个相同的点击事件，那么我们可能需要为这100个li元素各绑定一个回调函数，费时费力费内存。由于事件的冒泡机制，我们可以通过事件代理的方式，只在ul元素上绑定一个click事件，然后确定其event.target对象是否是li元素就行了,如下例所示：


有一个ul元素，其中5个li元素：
```html
<ul id="ul">
   <li value='1'>1</li>
   <li value='2'>2</li>
   <li value='3'>3</li>
   <li value='4'>4</li>
   <li value='5'>5</li>
</ul>
```

为ul元素绑定一个click事件回调函数来处理所有li元素的click事件

```javascript
var ul = document.getElementById("ul");
ul.addEventListener("click", function(evt){
    if(evt.target.tagName === 'LI'){
        console.log("li " + evt.target.getAttribute("value") + " is clicked");
    }
}, false);
```

点击各个li查看效果：

![各个li元素被点击时都会触发事件并显示哪个li元素被点击](http://lingyu.wang/img/fe_interview/8.png)

这样我们就可以通过为ul增加一个事件代理来处理所有li元素的点击事件了。同理，我们可以使用事件代理让一个元素下的不同子元素共享一个事件处理逻辑

##第三十五题
简述伪类和伪元素有什么异同，并写出几个常见的伪类和伪元素

相当多的人将伪类和伪元素相混淆

###相同点
他们的共同点在于，他们都属于CSS选择器的范畴，CSS引入伪类和伪元素的概念是为了实现基于文档树之外的信息的格式化造成伪类和伪元素混淆的最基本原因，就是他们俩可以使用相同的语法进行添加：

```css
.someclass:before {}
.someclass:hover {}
```

###不同点
1. 伪类时根据元素所具有的不同状态来添加相应的样式，而伪元素则是对元素中特定的内容添加相应的样式
2. 伪元素和伪类使用语法可以不同，伪元素可以使用`::before`这样的双冒号来使用（当然使用单冒号也可以），而伪类不行
3. 伪元素和伪类进行选择器优先级计算时不同，伪元素与标签选择器的优先级为0001，而伪类的优先级与类选择器的优先级一样为0010

###一些例子
`before`,`after`,`first-line`,`first-letter`都是伪元素，而像`link`,`visited`,`hover`,`active`,`first-child`,`lang`,`focus`等都是伪类

