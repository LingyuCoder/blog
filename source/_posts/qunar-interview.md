layout: art
title: 去哪儿笔试题之我答
subtitle: 专注细节，考查二分、数组操作、正则表达式
tags: 
- 笔试面试题
- JavaScript
categories: 
- 笔试面试
date: 2014/3/8
---


题目来自： [IT面试论坛](http://www.itmian4.com/forum.php?mod=forumdisplay&fid=44)

之前想报去哪儿的实习，去参加参加笔试，结果因为填报的时间太晚了，没去成。今天全国统一笔试放出来了笔试题，说实话让我现场写基本上都写不出来...深刻感到了自己实力的不足，在这里借助浏览器内部的调试工具试着写了写，把握一下细节，也算是一种积累了

<!-- more -->

##第一题
###题目
输入一个有序数组和一个数，若在数组中返回索引，若不在返回应该插入的索引

###想法
没啥好想的，经典二分题

###实现
因为好久没摸java了，所以写了个JavaScript版本的：
```javascript
var getPosInArray = function(arr, ele) {
    if (Object.prototype.toString.apply(arr) !== '[object Array]') {
        throw Error("The first param must be an array!!!");
    }
    if (typeof ele !== "number") {
        throw Error("The second param must be a number!!!");
    }
    var left = 0,
        right = arr.length - 1,
        middle;
    for (; left <= right;) {
        middle = left + Math.floor((right - left) / 2);
        if (arr[middle] === ele) {
            return middle;
        } else if (arr[middle] > ele) {
            right = middle - 1;
        } else {
            left = middle + 1;
        }
    }
    return left;
};
```
java的也是类似的

##第二题
###题目
给定一个随机数组，数组可能包含数组（也就是说数组元素可能为数组）。要求用js实现一个函数，返回该数组中所有元素，重复的要求去掉。例如：数组\[2,3,\[4,6,\[3,8\]\],12,10\]，返回结果为：\[2,3,4,6,8,12,10\]

###想法
数组中的数组，很容易想到的一种方式就是新建一个结果数组，通过递归遍历将不同的值插入到结果数组中，JavaScript中查询结果数组中是否已有某值的时候可以用`arr.indexOf(ele) === -1`来确定，同时注意一下类型检测，使用`Object.prototype.toString.apply(rawArray) === '[object Array]'`来进行数组的检测，用`typeof`来检测基础类型

###实现
这道题是前端题，自然是JavaScript：
```javascript
var getUniEle = function(rawArr) {
    if (Object.prototype.toString.apply(rawArr) !== '[object Array]') {
        throw Error("The param must be an array!!!");
    }
    var result = [],
        process = function(arr) {
            var i,
                m;
            for (i = 0, m = arr.length; i < m; i++) {
                if (typeof arr[i] === 'number' && result.indexOf(arr[i]) === -1) {
                    result.push(arr[i]);
                } else if (Object.prototype.toString.apply(arr[i]) === '[object Array]') {
                    processCurArray(arr[i]);
                } else {
                    throw Error("Any element must be an array or a number!!!");
                }
            }
        };
    process(rawArr);
    return result;
};
```

##第三题
###题目
这个题和腾讯2014校园招聘前端题目是一样的。
给定一个URL字符串，要求用js实现一个函数，返回该URL的域名、请求路径、参数和hash值、
例如：URL：`http://www.qunar.com/plane/queryPlane.html?startTime=xxxx&endTime=xxxxx#tags`
返回结果为：
```javascript
{
    host: "www.qunar.com",
    path: "plane/queryPlane.html",
    query: {
        "startTime": "xxxxx",
        "endTime": "xxxxx"
    },
    hash: "tags"
}
```
注明：xxxx为url编码后的字符串，设计函数是肯定要求把它解码过来！

###想法
解析url这个题目很常见，容易想到通过正则表达式提取，但是我就栽在这种常见的题目上了，正则怎么写都不对，跪了

首先要了解一个常规的url分为哪些内容，一个包含所有内容的url大致上长这样：`scheme://host:port/path?query#fragment`，其中：
* scheme: 通信协议，如http，https，ftp等
* host：主机（域名或者是IP地址）
* port：端口
* path：请求的路径
* query：请求所发送的数据
* fragment：片段，用于指向网页中的片段

需要知道其中哪些是可能被省略的，最简单的url只有主机，比如skinlayer.com，其他都是可选的。在正则匹配的时候需要使用`()?`来进行可选时的匹配

比如如下的url就比较完整：`http://www.qunar.com:8080/plane/queryPlane.html?startTime=xxxx&endTime=xxxxx#tags`

* 将url拆分，首先匹配scheme，scheme前面都是字母，然后是`://`，所以可以写出这样的正则:`(?:(\w+)\:\/\/)?`，这里用了非捕获性匹配`(?:)`，匹配到上面的`http://`部分，但由于非捕获性分组的存在，仅仅捕获了`http`

* 然后匹配主机部分，主机部分不可省略，同时其可能是字母，数字，小数点，下划线，所以可以写出这样的正则：`([\w\d]+(?:\.[\w\d]+)*)`，匹配并捕获到上面的`www.qunar.com`部分

* 然后匹配端口，同样是可选，格式为`:dd`，所以可以写出正则：`(?:\:[\d]+)?`，匹配到`:8080`部分，捕获`8080`

* 然后匹配路径，从之前匹配到之后的?或者#（如果没有query部分，就可能直接碰到#），都是path部分，因此通过排除这两个字符的方式来写正则`(?:\/([^?#]+))?`，匹配到`/plane/queryPlane.html`，捕获`plane/queryPlane.html`

* 接着就是query这个大头了，我们先把里面这一部分抠出来，留在以后再进行详细的处理转换为对象，这里可以看到到#之前都是这个部分`(?:\?([^#]*))?`，匹配到`?startTime=xxxx&endTime=xxxxx`，捕获`startTime=xxxx&endTime=xxxxx`

* 最后捕获一些fragment就行了，很好弄，#后面所有的字符都是这一部分`(?:#(.*))?`

最后再加上起始和结束就可以生成完整的正则表达式了：
```javascript
var reg = /^(?:(\w+)\:\/\/)?([\w\d]+(?:\.[\w]+)*)(?:\:(\d+))?(?:\/([^?#]+))?(?:\?([^#]*))?(?:#(.*))?$/;
```
相当长，说实话，如果让我笔试写肯定跪逼了

然后运用在url字符串上：
```javascript
var regResult = url.match(/^(?:(\w+)\:\/\/)?([\w\d]+(?:\.[\w]+)*)(?:\:(\d+))?(?:\/([^?#]+))?(?:\?([^#]*))?(?:#(.*))?$/);
//["http://www.qunar.com:8080/plane/queryPlane.html?startTime=xxxx&endTime=xxxxx#tags", "http", "www.qunar.com", "8080", "plane/queryPlane.html", "startTime=xxxx&endTime=xxxxx", "tags"]
```
生成的数组各个元素基本上就是我们要的了，除了query部分，对query部分做一下单独的处理，首先利用正则表达式将所有的键值对字符串取出来放在一个数组中：
```javascript
var rawParams = result.query.match(/([^=&]+)=([^&=]+)/g);
```
这个正则由于可能匹配多次，所以用到了全局匹配

然后将所有的键值对字符串进行分割，分割成键和值插入到结果中就行了，这里分割使用了`String.split()`方法：
```javascript
result.query = {};
if (rawParams) {
    for (var i = rawParams.length; i--;) {
        tmp = rawParams[i].split("=");
        result.query[tmp[0]] = unescape(tmp[1]);
    }
}
```

需要注意题目上有一句话：`xxxx为url编码后的字符串，设计函数是肯定要求把它解码过来！`，所以这里需要使用unescape来进行解码

最后完整的代码如下：
```javascript
var parseUrl = function(url) {
    if (typeof url !== "string") {
        throw Error("The param is not a string!!!");
    }
    if (url === ""){
        throw Error("The param is an empty string!!!");
    }
    var regResult = url.match(/^(?:(\w+)\:\/\/)?([\w\d]+(?:\.[\w]+)*)(?:\:(\d+))?(?:\/([^?#]+))?(?:\?([^#]*))?(?:#(.*))?$/);
    var result = {
        url: regResult[0],
        scheme: regResult[1],
        host: regResult[2],
        port: regResult[3],
        path: regResult[4],
        query: regResult[5],
        fragment: regResult[6]
    };

    if (typeof result.query !== "undefined") {
        var rawParams = result.query.match(/([^=&]+)=([^&=]+)/g);
        var tmp;
        result.query = {};
        if (rawParams) {
            for (var i = rawParams.length; i--;) {
                tmp = rawParams[i].split("=");
                result.query[tmp[0]] = unescape(tmp[1]);
            }
        }
    }
    return result;
};
```
由于加了非字符串以及空字符串的检测，基本上能解析所有的情况了

##总结
这三题都是看似简单（解题思路很容易想到），但实际上实现起来很在乎细节。正则这个东西说实话在纸上写很难保证正确，基本上都是边调试边写，看来要笔试好还有很长的路要走




















