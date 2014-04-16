---
layout: art
title: 阿里巴巴前端笔试题（1-10）
subTitle: 前端面试题积累系列
desc: 最近笔了阿里巴巴的笔试题，有很多细节上的问题需要总结。题目还是不错的
tags: [JavaScript, HTML, CSS]
categories: [笔试面试积累]
---

{% raw %}
##第一题
###题面
说出以下函数的作用是？空白区域应该填写什么？
```javascript
// define  
(function (window) {  
    function fn(str) {  
        this.str = str;  
    }  
    fn.prototype.format = function () {  
        var arg = ______;  
        return this.str.replace(_______, function (a, b) {  
            return arg[b] || '';  
        });  
    }  
    window.fn = fn;  
})(window);  
// use  
(function(){  
    var t = new fn('<p><a href="{0}">{1}</a><span>{2}</span></p>');
    console.log( t.format('http://www.alibaba.com', 'Alibaba', 'Welcome') );  
})();  
```

###解答
看题面就是，类似于写一个模板引擎。将模板里的`{1}`之类的占位符替换成传给它的参数。所以arg应该就是arguments。但是由于arg不是数组，而是一个类数组对象。所以需要进行一些转换，比较常规的转换方式如下：
```javascript
var arg = Array.prototype.slice.call(arguments, 0);
```
等号右边也就是第一空的答案了

第二空则是要通过正则找出占位符，并根据占位符内的数字将其替换成arg数组内的字符串，说实话replace方法的第二个参数为函数的情况很少遇到，这里就是考的这个，最初想法是直接用全局正则匹配一下：
```javascript
return this.str.replace(/\{\d+\}/g, function (a, b) {  
    return arg[b] || '';  
}); 
```
这样，但是穿进去之后发现不太对，因为b参数是正则匹配到的字符串在完整字符串中的位置。于是去查了一下W3C：
> 该函数的第一个参数是匹配模式的字符串。接下来的参数是与模式中的子表达式匹配的字符串，可以有 0 个或多个这样的参数。接下来的参数是一个整数，声明了匹配在 stringObject 中出现的位置。最后一个参数是 stringObject 本身。

这里显然是因为没有子表达式，所以直接b成了声明的匹配在stringObject中出现的位置。这样就好说了，与模式中字表达式匹配，那加一个子表达式进去，变成这样：
```javascript
return this.str.replace(/\{(\d+)\}/g, function (a, b) {  
    return arg[b] || '';  
}); 
```
跑一下，齐活，输出`<p><a href="http://www.alibaba.com">Alibaba</a><span>Welcome</span></p> `

##第二题
###题面
![第二题题面](http://skyinlayer.com/img/fe_interview/9.png)

###解答
这题由于时间不太够，就没有写可执行代码，主要是涉及cookie操作。可以分成用户第一次进入检测，用户点击我知道了检测两个行为来分别处理：

第一次进入的时候，首先判断cookie中是否有今天已来过标记，没有记录就写进一个标记，同时由于同一天不显示，所以这个写入带标记的cookie的过期时间应该为1天，这里标记为visited：
```javascript
if(document.cookie.indexOf(visited) === -1){
    document.cookie = 'visited=' + escape('1') + ';expires=' + new Date((new Date().getTime() + 24 * 3600 * 1000)).toGMTString();
    showTips();
}
```

点不再访问的时候，应该运行如下代码：
```javascript
document.cookie = 'visited=' + escape('1') + ';expires=' + new Date((new Date().getTime() +  100 * 365 * 24 * 3600 * 1000)).toGMTString();
```
这样设定一个100年才过期的cookie，就相当于永久不显示了

##第三题
###题面
![第3题题面](http://skyinlayer.com/img/fe_interview/10.png)

###解答
在ul的li上绑点击事件，典型的事件代理的题，要输出index，所以需要提前进行一些提前处理：
```javascript
(function(){
    var nav = document.getElementById("nav");
    var liList = nav.children;

    function bindEvent(ele, event, callback) {
        if (ele.attachEvent) {
            ele.attachEvent("on" + event, function(event) {
                event = event || window.event;
                event.target = event.target || event.srcElement;
                callback(event);
            });
        } else {
            ele.addEventListener(event, callback, false);
        }
    };

    bindEvent(nav, "click", function(event) {
        var target = event.target;
        var a;
        var i, m;
        if (target.tagName.toLowerCase() === "li") {
            a = target.children[0];
            for (i = 0, m = liList.length; i < m; i++) {
                if (liList[i] === event.target) {
                    console.log(i + 1);
                    console.log(a.getAttribute("href"));
                    console.log(a.innerText);
                }
            }
        }
    });
}());
```
这个事件代理的思想就是，在ul上采用冒泡机制绑定点击事件，在回调函数中使用event.target(IE底下会说)判断是否是li节点，如果是，则输出需要的数字

这里说要支持（该死的）IE，于是多了好几个点：
- IE的事件绑定需要用attachEvent，而不能直接用addEventListener，所以需要额外处理
- 老版本的event不是又函数传入，而是写在window里面，所以也需要做一个兼容
- 老版本的IE中，并没有event.target，所以取而代之的是event.srcElement
- IE6、7、8使用数组的slice方法会报错，同时也无法使用indexOf，所以要么把这两个方法重新实现，要么直接通过遍历的方式来处理，我这里直接采用遍历的方式（因为重新实现代码加长很多）
- 去死吧IE

##第四题
###题面
![第4题题面](http://skyinlayer.com/img/fe_interview/11.png)

###解答
妈蛋被坑了，没看到还要写出其框内内容，写了个绝对定位就交了，呵呵呵呵呵呵呵呵呵呵呵呵呵呵呵呵呵呵呵呵呵呵呵呵呵呵呵呵呵呵呵呵呵呵呵呵呵呵呵呵呵呵呵呵呵呵呵呵呵呵呵呵呵呵呵呵呵呵呵呵呵呵呵呵呵呵呵呵呵呵呵呵呵呵呵呵呵呵呵呵呵呵呵呵呵呵呵呵呵呵呵呵呵呵呵呵

及其简单的绝对定位题，里面的内容分成两块，一块是左边的二维码，一块是右边的文字部分。左边浮动，右边触发bfc


<iframe width="100%" height="600" src="http://jsfiddle.net/skyinlayer/27hGA/1/embedded/result,html,css" allowfullscreen="allowfullscreen" frameborder="0">&nbsp;</iframe>

##第五题
###题面
![第5题题面](http://skyinlayer.com/img/fe_interview/12.png)

###解答
这题是作文...完全答不全，这里的答案不一定对，都是网上摘抄的

可以分成两个部分进行阐述： 1. http连接建立  2.对网页及其资源进行请求

http建立经过如下步骤：
1. 浏览器获得url后，对其通过DNS进行解析，转换成ip地址，以及添加上响应的端口（如果没有显式指定，默认80）
2. 浏览器通过三步握手与这个服务器建立TCP连接
3. 在连接建立后，发送一个HTTP请求报文，里面包含了请求的资源的URL，请求方法，参数等等信息
4. 服务器接收到请求报文后进行处理，返回一个包含请求资源内容的响应报文
5. 浏览器关闭这个TCP连接（在HTTP1.1中不会进行关闭，除非进行显式的connection=close，而HTTP1.0中，则会关闭，可以通过keepAlive指定不关闭）

对网页的资源请求：
1. 浏览器的url框获得url后，通过上述的方式获得HTML文档，获得完成后触发document.onload事件
2. 解析HTML文档，然后按照HTML文档结构从上往下开始请求资源（批量4-8）
3. 请求CSS样式表，当样式表到来的时候，将会拿它和之前已经到来的样式表进行合并和解析，修改渲染树，对页面进行回流和重绘
4. `<scirpt>`所添加的脚本在执行完成之前，会阻塞后续的HTML进行解析。而如果通过src添加外链的方式来引入js脚本，那么在请求、下载、解析、运行所有过程完成之前，都不会进行后续HTML的解析
5. 如果通过javascript添加script标签的方式加载，将会异步进行加载


##第六题
###题面
![第6题题面](http://skyinlayer.com/img/fe_interview/13.png)
###解答
这题本来不难，一个下拉框，可以只用html+css实现，活用一下css的伪类就行了，至于那个小箭头用after伪元素画一下问题不大，代码如下，测试了一下能到IE7：

<iframe width="100%" height="600" src="http://jsfiddle.net/skyinlayer/ZQ5Jd/1/embedded/result,css,html" allowfullscreen="allowfullscreen" frameborder="0">&nbsp;</iframe>

但是底下的要求，直接让我吐血，支持IE6+...就这一句话得加多少乱七八糟的兼容....IE6不支持子元素选择器，去掉之。IE6没hover，去掉之。另外小箭头肯定不能用border画了，懒得弄图片了，补上js代码。结果如下：

<iframe width="100%" height="600" src="http://jsfiddle.net/skyinlayer/ZQ5Jd/4/embedded/result,css,html" allowfullscreen="allowfullscreen" frameborder="0">&nbsp;</iframe>

##第七题
###题面
![第7题题面](http://skyinlayer.com/img/fe_interview/14.png)

###解答
表单序列化，获取表单中的元素然后获取他们的值，拼接成字符串，挺有意思的一道题

通过form.elements可以获得所有的元素，顺序遍历一遍就好，需要注意的是checkbox和radio的checked状态，另外除了input以外，还有select和textarea（这里可能考虑不全）

```javascript
function serialize(form) {
    var params = [];
    var elements = form.elements;
    var i, m;
    var input;
    for (i = 0, m = elements.length; i < m; i++) {
        input = elements[i];
        if (input.tagName.toLowerCase() === "input") {
            switch (input.type) {
                case "radio":
                case "checkbox":
                    if (!input.checked) {
                        break;
                    }
                default:
                    if (input.disabled == false && input.name.length) {
                        params.push(encodeURI(input.name) + "=" + encodeURI(input.value));
                    }
            }
        } else if (input.tagName.toLowerCase() === "textarea" || input.tagName.toLowerCase() === "select") {
            if (input.disabled == false && input.name.length) {
                params.push(encodeURI(input.name) + "=" + encodeURI(input.value));
            }
        }
    }
    return params.join("&");
};
```

##第八题
###题面
![第8题题面](http://skyinlayer.com/img/fe_interview/15.png)
###解答
数组去重...这还只是扁平数组，不难，去哪儿那题是嵌套数组。不过它竟然要自己构造数组。去重的话直接用一个Object做标记就行。也可以考虑直接用indexOf判断，不过效率会降低
```javascript
var array = [];
var i;

function getRandomNumberString() {
    return Math.floor(Math.random() * 100) + '';
};

for (i = 0; i < 100; i++) {
    array.push(getRandomNumberString());
}

function unique(array) {
    var result = [];
    var uniObj = {};
    var i, tmp;
    for (i = array.length; i--;) {
        tmp = parseInt(array[i]);
        if (!uniObj[tmp]) {
            result.push(tmp);
            uniObj[tmp] = 1;
        }
    }
    return result;
}

console.log(unique(array));
```

##第九题
###题面
![第9题题面](http://skyinlayer.com/img/fe_interview/16.png)

###解答
竟然会有这种题，好吧

第一个地方是浏览器嗅探。这里使用了无关属性`document.all`来嗅探IE，这样并不好。应该直接使用方法来嗅探，所以将其改为`window.attachEvent`

第二个地方是事件对象未处理，我也是后来才知道的，自己只写了第一条就交了。这里由于老式IE对event和event.target不支持，所以需要进行兼容

第三个地方，记得提升变量申明

总体修改代码如下：
```javascript
var addListener;
if (window.addEventListener) {
    addListener = function(el, type, listener, useCapture) {
        el.addEventListener(type, listener, useCapture);
    };
} else if (window.attachEvent) {
    addListener = function(el, type, listener) {
        el.attachEvent("on" + type, function(event) {
            event = event || window.event;
            event.target = event.target || event.srcElement;
            listener.apply(el, [event]);
        });
    };
}
```

##第十题
###题面
![第10题题面](http://skyinlayer.com/img/fe_interview/17.png)

###解答
呵呵，还能不能愉快的答题了`(╯‵□′)╯︵┻━┻`

{% endraw %}