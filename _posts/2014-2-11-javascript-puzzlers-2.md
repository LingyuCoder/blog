---
layout: art
title: JavaScript选择题解答（21-37）
subTitle: javascript puzzlers的个人解答
desc: 最近做了个heroku上的JavaScript的测试（<a href="http://javascript-puzzlers.herokuapp.com/">题目地址</a>），错了一大堆，感觉js的概念还有很多不是很清晰，这里记录一下，下半部分
tags: [JavaScript]
categories: [前端技术]
---
{% raw %}

###第二十一题
What is the result of this expression? (or multiple ones)
```javascript
var a = 111111111111111110000,
    b = 1111;
a + b;
```
A: 111111111111111111111

B: 111111111111111110000

C: NaN

D: Infinity

又是一道考查JavaScript数字的题，与第七题考察点相似。由于JavaScript实际上只有一种数字形式IEEE 754标准的64位双精度浮点数，其所能表示的整数范围为-2^53~2^53(包括边界值)。这里的111111111111111110000已经超过了2^53次方，所以会发生精度丢失的情况。综上选B

###第二十二题
What is the result of this expression? (or multiple ones)
```javascript
var x = [].reverse;
x();
```
A: \[\]

B: undefined

C: error

D: window

这题考查的是函数调用时的this和Array.prototype.reverse方法。

首先看Array.prototype.reverse方法，首先举几个栗子：
```javascript
console.log(Array.prototype.reverse.call("skyinlayer"));
//skyinlayer
console.log(Array.prototype.reverse.call({}));
//Object {}
console.log(Array.prototype.reverse.call(123));
//123
```
这几个栗子可以得出一个结论，Array.prototype.reverse方法的返回值，就是this

Javascript中this有如下几种情况：

全局下this，指向window对象
```javascript
console.log(this);
//输出结果：
//Window {top: Window, window: Window, location: Location, external: Object, chrome: Object…}
```

函数调用，this指向全局window对象：
```javascript
function somefun(){
    console.log(this);
}
somefun();
//输出结果：
//Window {top: Window, window: Window, location: Location, external: Object, chrome: Object…}
```

方法调用，this指向拥有该方法的对象：
```javascript
var someobj = {};
someobj.fun = function(){
    console.log(this);
};
console.log(someobj.fun());
//输出结果：
//Object {fun: function}
```

调用构造函数，构造函数内部的this指向新创建对象：
```javascript
function Con() {
    console.log(this);
}
Con.prototype.somefun = function(){};
console.log(new Con());
//输出结果：
//Con {somefun: function}
```

显示确定this：
```javascript
function somefun(){
    console.log(this);
};
somefun.apply("skyinlayer");
somefun.call("skyinlayer");
//输出结果：
//String {0: "s", 1: "k", 2: "y", 3: "i", 4: "n", 5: "l", 6: "a", 7: "y", 8: "e", 9: "r", length: 10}
//String {0: "s", 1: "k", 2: "y", 3: "i", 4: "n", 5: "l", 6: "a", 7: "y", 8: "e", 9: "r", length: 10} 
```

这里可以看到，使用的是函数调用方式，this指向的是全局对象window，所以选D

###第二十三题
What is the result of this expression? (or multiple ones)
```javascript
Number.MIN_VALUE > 0
```
A: false

B: true

C: error

D: other

考查的Number.MIN\_VALUE的概念，[MDN传送门](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/MIN_VALUE)，关键的几句话

* The Number.MIN_VALUE property represents the smallest positive numeric value representable in JavaScript.
翻译：Number.MIN_VALUE表示的是JavaScript中最小的正数

* The MIN_VALUE property is the number closest to 0, not the most negative number, that JavaScript can represent.
翻译：MIN_VALUE是接近0的数，而不是最小的数

* MIN\_VALUE has a value of approximately 5e-324. Values smaller than MIN_VALUE ("underflow values") are converted to 0.
翻译：MIN_VALUE值约等于5e-324，比起更小的值（大于0），将被转换为0

所以，这里是true，选B

顺带把Number的几个常量拉出来：
* Number.MAX_VALUE：最大的正数
* Number.MIN_VALUE：最小的正数
* Number.NaN：特殊值，用来表示这不是一个数
* Number.NEGATIVE_INFINITY：负无穷大
* Number.POSITIVE_INFINITY：正无穷大

如果要表示最小的负数和最大的负数，可以使用\-Number.MAX\_VALUE和\-Number.MIN\_VALUE

{% endraw %}