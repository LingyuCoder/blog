---
layout: art
title: 前端面试题（1-14）
subTitle: 前端面试题积累系列
desc: 这两天在一问一答上刷了不少JavaScript题，也做了一些其他的前端面试笔试题，在这里记录一下，积少成多，聚沙成塔！
tags: [JavaScript, HTML, CSS]
categories: [笔试面试积累]
---
{% raw %}
##第一题
下列关于浏览器对象的说法错误的是：
* A：location对象相当于IE浏览器中的地址栏，包含关于当前URL地址的信息
* B: history对象记录了用户在一个李蓝旗中已经访问过的URLS
* C: location对象是window对象的子对象
* D：location对象是history对象的父对象

这题考查的是location对象和history对象，之前并没有怎么接触过。

答案是D

###location对象
location对象里面存放了当前URL的一些信息：

![localtion对象存放的信息](http://lingyu.wang/img/fe_interview/1.png)

location对象同时window对象和window.document对象的子对象：
```javascript
> window.location === window.document.location
true
```

我们可以通过修改其href实现跳转

###history对象
history对象是window对象的子对象，里面记录了访问历史：

![history对象存放的信息](http://lingyu.wang/img/fe_interview/2.png)

history与location对象不同的是，其不存在于window.document对象之中
```javascript
> window.document.history
undefined
```

history对象有三个比较常用的跳转方法：
* back()：移动到当前页面的在历史记录中的上一个页面
* forward()：移动到当前页面在历史记录中的下一个页面
* go(n)：接收一个参数n如果参数为正整数或0，移动到当前页面后的第n个页面（0的效果为刷新），如果为负数，移动到当前页面前的第n个页面，超出范围的话将被忽略


##第二题
析如下JavaScript代码，请问依次打印什么：
```javascript
console.log(Function instanceof Object);
console.log(Object instanceof Function);
console.log([].constructor === Array.prototype.constructor);
console.log(new Object(1).constructor === new Number(2).constructor);
```

这题考察了Function、Object以及constructor

首先我们要确定instanceof方法，如A instanceof B，A必须是一个合法的对象，B是一个合法的JavaScript函数。如果函数B在对象A的原型链中被发现，那么instanceof操作符将返回true，否则返回false

第一行`console.log(Function instanceof Object);`：

由于Function.prototype是一个对象，它的构造函数是Object，所以从原型链上来说，所有的函数顺着原型链查找，最后都会到达Object的构造原型的Object.prototype对象，所以答案为true。

由此我们可以得出另外一个结论，所有的函数instanceof Object的结果，都是true
```javascript
> (function(){}) instanceof Object
true
```

第二行`console.log(Object instanceof Function);`：

因为在JavaScript中所有的构造函数（Object、Function、Array）都是函数，而所有函数都是其构造函数（Function）的实例，所以答案也是true

第三行`console.log(arr.constructor === Array.prototype.constructor);`：

首先我们需要知道constructor的概念，constructor属性始终指向创建当前对象的构造函数。所以很容易得到如下结果:
```javascript
> [].constructor === Array
true
```
而每个函数都有一个默认的属性prototype，这个prototype的constructor默认指向这个函数：
```javascript
> var SomeType = function(){};
> SomeType.prototype.constructor === SomeType
true
```
由此可以得知：
```javascript
> [].constructor === Array
true
> Array === Array.prototype.constructor
true
> [].constructor === Array.prototype.constructor
true
```

当然我们哈有另外一个比较简单的思路，其实Array.prototype这个对象比较特殊，它是集上是个数组:
```javascript
> Array.prototype
[]
```
这样就相当于比较`[].constructor === [].constructor`了，结果自然是true

第四行`console.log(new Object(1).constructor === new Number(2).constructor);`：

说实话我被这个坑了，以为是false，后来发现`new Object()`方法如果传入一个基础类型或基础类型对象，会自动构造成基础类型对象：

```javascript
> new Object(123) instanceof Number
true
> new Object("asdf") instanceof String
true
> new Object(false) instanceof Boolean
true
> typeof new Object(123)
"object"
```

这样就很好理解了，`new Object()`如果传入一个数字，将会调用new Number()，其他类似。所以这里答案是true

##第三题
下列JavaScript运行完成后，x的值是多少：
```javascript
var somevar;
var x = somevar === undefined;
```

这题错了，囧

以往一直使用`typeof somevar === 'undefined'`来检测undefined，这下被坑了

undefined可能出现在如下两种情况之中：
1. 变量未定义
2. 定义了变量但未赋值

使用`typeof somevar === 'undefined'`进行判断：
```javascript
> typeof somevar === 'undefined'
true
> var someothervar;
> typeof someothervar === 'undefined'
true
```
由此可见，这种方法在两种情况下都适用

使用`somevar === undefined`进行判断：
```javascript
> somevar === undefined
ReferenceError: somevar is not defined
> var someothervar;
> someothervar === undefined
true
```
我勒个去...也就是说，这种检测方式仅仅适用于第二种情况，所以这题答案是true

##第四题
```javascript
var obj = {
    toString: function() {
        return "obj作用域内";
    },
    func: function() {
        alert(this);
        var innerfunc = function() {
            alert(this);
        };
        innerfunc.call(this);
    }
};
obj.func.call(window);
```
弹出来的第二个对话框内容是什么

考this的题，没跑了

首先看`obj.func.call(window)`，这句使用了call方法指定this，没啥说的，this肯定指向window，所以第一个对话框的内容肯定是`[object window]`，但是它问第二个对话框，好吧，继续

进入到func内部，其又用call来调用，传入的还是this，也就是window对象，所以第二个对话框也是window

##第五题
考虑如下代码：
```javascript
var message = "Hello world!";
var t1 = message.substring(1, 4);
var t2 = message.substr(1,4);
```
t1，t2的值各是多少？

通过这道题我才知道原来还有substr这么个玩意...

首先来看substring方法，其接受两个参数，left和right，分别代表截取的起始点和终点，这是一个左闭右开的区间，right位置的字符不会被截取，所以这里会截取的是message\[1\], message\[2\], message\[3\]三个字符为'ell'

接下来看substr方法，其亦接受两个参数，left和count，分别代表截取的起始点和截取字符的个数...所以会截取message\[1\], message\[2\], message\[3\], message\[4\]四个字符，也就是'ello'...


##第六题
```javascript
if (a in window) {
    var a = 1;
}
console.log(a);
```

看了那么多关于变量声明提升的概念，这题竟然错了，呵呵

这题就是考的变量的提升：提升后的代码如下：
```javascript
var a;
if (a in window) {
    a = 1;
}
console.log(a);
```
这样就很明显了，答案是1...

##第七题
```javascript
var x = 10;
var foo = {
    x: 20,
    bar: function() {
        var x = 30;
        return this.x;
    }
};

alert(foo.bar());
alert((foo.bar)());
alert((foo.bar = foo.bar)());
alert((foo.bar, foo.bar)());
```
弹出的内容依次是？

这题也是考的不同调用方法中的this，本来挺有自信的，但发现和想的不太一样

第一行`foo.bar()`比较明显，对象的方法调用，this指向拥有该方法的独享，所以输出值为20

第二行`(foo.bar)()`和我想的不太一样，我以为这会是函数调用，结果不是，其也是对象方法调用，this值指向foo对象，所以答案是20

第三行`(foo.bar = foo.bar)()`有一个赋值语句，JavaScript的复制语句返回的是被赋予的值，这是函数调用，所以this指向全局对象window，答案是10

第四行`(foo.bar, foo.bar)()`，逗号表达式，也是函数调用，都好表达式的值默认是最后的那个值，答案是10

##第八题
在javascript中要改变页面文档的背景色，需要修改document对象的（）属性。

我凑，才知道document还有这么个神奇的属性可以改变背景颜色，而不是通过改变CSS的方式，答案是`bgColor`属性，修改完后，body会多一个`bgcolor`属性，而body的css也会加上一条`background-color`规则

##第九题
在通过元素的style属性修改CSS时，有横线的属性（如background-color）应该如何表示？

答案：将横线去掉，横线后的首字母大写，如backgroundColor

##第十题
JavaScript有哪些数据类型？

答案：一共六种，number、boolean、string、object、null、undefined

##第十一题
img标签的alt和title分别是什么意思

答案: title用于给与一些提示性文字鼠标悬停可以看到title的信息。而alt则是在图片无法显示是的替换文字

##第十二题
实现一个两列，左边宽度自适应，右边宽度固定200px的布局

答案：
```html
<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Document</title>
    <style>
        .g-sd {
            float:right;
            width: 200px;
            height: 400px;
            background-color: #f0f0f0;
        }
        .g-mn {
            zoom: 1;
            overflow: hidden;
            height: 700px;
            background: #f0ffff;
        }
    </style>
</head>
<body>
    <div class='g-sd'></div>
    <div class='g-mn'></div>
</body>
</html>
```

##第十三题
如何对JavaScript对象进行深拷贝？

```javascript
Object.prototype.deepClone = function() {
    var hasOwnProperty = Object.prototype.hasOwnProperty,
        toString = Object.prototype.toString,
        deepClone = Object.prototype.deepClone,
        result,
        iter,
        cur,
        m;

    if (toString.call(this) === '[object Array]') {
        result = [];
    } else {
        result = {};
    }
    for (iter in this) {
        cur = this[iter];
        if (hasOwnProperty.call(this, iter)) {
            if (typeof cur === 'object') {
                result[iter] = deepClone.call(cur);;
            } else {
                result[iter] = cur;
            }
        }
    }
    return result;
};
```
测试用例：
```javascript
var someObj = {
    num: 123,
    str: "someString",
    bool: true,
    func: function(){},
    obj: {
        arr: [1,2,{
            num: 1
        }]
    },
    arr: [1,2,"string"]
};
console.log(someObj.deepClone());
```
结果图：

![深度复制成功](http://lingyu.wang/img/fe_interview/3.png)

##第十四题
动态打印时间，格式为yyyy-MM-dd hh:mm:ss?
```javascript
Date.prototype.format = function(format) {
    var hasOwnProperty = Object.prototype.hasOwnProperty,
        timeObj = {
            "YYYY": this.getFullYear(),
            "YY": this.getFullYear().toString().slice(2),
            "MM": this.getMonth() + 1,
            "DD": this.getDate(),
            "hh": this.getHours(),
            "mm": this.getMinutes(),
            "ss": this.getSeconds()
        },
        item,
        value;
    for (item in timeObj){
        value = timeObj[item];
        if(hasOwnProperty.call(timeObj, item)){
            format = format.replace(item, value < 10 ? "0" + value : value);
        }
    }
    return format;
};

setInterval(function(){
    console.log(new Date().format("YYYY-MM-DD hh:mm:ss"));
},1000);
```

{% endraw %}
