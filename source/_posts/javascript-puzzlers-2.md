layout: art
title: JavaScript选择题解答（21-37）
subtitle: javascript puzzlers的个人解答
tags: 
- JavaScript
categories: 
- 笔试面试
date: 2014/2/11
---

最近做了个heroku上的JavaScript的测试（[题目地址](http://javascript-puzzlers.herokuapp.com/)），错了一大堆，感觉js的概念还有很多不是很清晰，这里记录一下

<!-- more -->

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

###第二十四题
What is the result of this expression? (or multiple ones)
```javascript
[1 < 2 < 3, 3 < 2 < 1]
```
A: \[true, true\]

B: \[true, false\]

C: error

D: other

运算符的运算顺序和隐式类型转换的题，从[MDN上运算符优先级](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Operator_Precedence)，'<'运算符顺序是从左到右，所以变成了\[true < 3, false < 1\]

接着进行隐式类型转换，'<'操作符的转换规则（来自[$雨$的文章《Javascript类型转换的规则》](http://www.cnblogs.com/mizzle/archive/2011/08/12/2135885.html)）:

1. 如果两个操作值都是数值，则进行数值比较
2. 如果两个操作值都是字符串，则比较字符串对应的字符编码值
3. 如果只有一个操作值是数值，则将另一个操作值转换为数值，进行数值比较
4. 如果一个操作数是对象，则调用valueOf()方法（如果对象没有valueOf()方法则调用toString()方法），得到的结果按照前面的规则执行比较
5. 如果一个操作值是布尔值，则将其转换为数值，再进行比较

所以，这里首先通过Number()转换为数字然后进行比较，true会转换成1，而false转换成0，就变成了\[1 < 3, 0 < 1\]

所以结果为A

###第二十五题
What is the result of this expression? (or multiple ones)
```javascript
// the most classic wtf
2 == [[[2]]]
```
A: true

B: false

C: undefined

D: other

又是隐式类型转换的题（汗）

题目作者的解释是：
both objects get converted to strings and in both cases the resulting string is "2"

也就是说左右两边都被转换成了字符串，而字符串都是"2"

这里首先需要对==右边的数组进行类型转换，根据以下规则（来自[justjavac的文章《「译」JavaScript 的怪癖 1：隐式类型转换》](http://justjavac.iteye.com/blog/1848749)）：
1. 调用 valueOf()。如果结果是原始值（不是一个对象），则将其转换为一个数字。
2. 否则，调用 toString() 方法。如果结果是原始值，则将其转换为一个数字。
3. 否则，抛出一个类型错误。

所以右侧被使用toString()方法转换为"2"，然后又通过Number("2")转换为数字2进行比较，结果就是true了，选A

###第二十六题
What is the result of this expression? (or multiple ones)
```javascript
3.toString()
3..toString()
3...toString()
```
A: "3", error, error

B: "3", "3.0", error

C: error, "3", error

D: other

说实话这题有点常见了，很多人都踩过3.toString()的坑（包括我）...虽然JavaScript会在调用方法时对原始值进行包装，但是这个点是小数点呢、还是方法调用的点呢，于是乎第一个就是error了，因为JavaScript解释器会将其认为是小数点。

而第二个则很好说通了，第一个点解释为小数点，变成了(3.0).toString()，结果就是"3"了

第三个也是，第一个点为小数点，第二个是方法调用的点，但是后面接的不是一个合法的方法名，于是乎就error了

综上，选C

###第二十七题
What is the result of this expression? (or multiple ones)
```javascript
(function(){
  var x = y = 1;
})();
console.log(y);
console.log(x);
```
A: 1, 1

B: error, error

C: 1, error

D: other

变量提升和隐式定义全局变量的题，也是一个JavaScript经典的坑...

还是那句话，在作用域内，变量定义和函数定义会先行提升，所以里面就变成了:
```javascript
(function(){
    var x;
    y = 1;
    x = 1;
})();
```
这点会问了，为什么不是```var x, y;```，这就是坑的地方...这里只会定义第一个变量x，而y则会通过不使用var的方式直接使用，于是乎就隐式定义了一个全局变量y

所以，y是全局作用域下，而x则是在函数内部，结果就为1, error，选C

###第二十八题
What is the result of this expression? (or multiple ones)
```javascript
var a = /123/,
    b = /123/;
a == b
a === b
```
A: true, true

B: true, false

C: false, false

D: other

首先需要明确JavaScript的正则表达式是什么。JavaScript中的正则表达式依旧是对象，使用typeof运算符就能得出结果：

```javascript
console.log(typeof /123/);
//输出结果：
//"object"
```

'=='运算符左右两边都是对象时，会比较他们是否指向同一个对象，可以理解为C语言中两个指针的值是否一样（指向同一片内存），所以两个结果自然都是false

###第二十九题
What is the result of this expression? (or multiple ones)
```javascript
var a = [1, 2, 3],
    b = [1, 2, 3],
    c = [1, 2, 4]
a == b
a === b
a > c
a < c
```
A: false, false, false, true

B: false, false, false, false

C: true, true, false, true

D: other

和上题类似，JavaScript中Array的本质也是对象，所以前两个的结果都是false，

而JavaScript中Array的'>'运算符和'<'运算符的比较方式类似于字符串比较字典序，会从第一个元素开始进行比较，如果一样比较第二个，还一样就比较第三个，如此类推，所以第三个结果为false，第四个为true。

综上所述，结果为false, false, false, true，选A

###第三十题
What is the result of this expression? (or multiple ones)
```javascript
var a = {}, b = Object.prototype;
[a.prototype === b, Object.getPrototypeOf(a) === b]
```
A: \[false, true\]

B: \[true, true\]

C: \[false, false\]

D: other

原型链的题（总会有的），考查的\_\_proto\_\_和prototype的区别。首先要明确对象和构造函数的关系，对象在创建的时候，其\_\_proto\_\_会指向其构造函数的prototype属性

Object实际上是一个构造函数（typeof Object的结果为"function"）,使用字面量创建对象和new Object创建对象是一样的，所以a.\_\_proto\_\_也就是Object.prototype，而Object.getPrototypeOf(a)与a.\_\_proto\_\_是一样的，所以第二个结果为true

而实例对象是没有prototype属性的，只有函数才有，所以a.prototype其实是undefined，第一个结果为false

综上，选A

###第三十一题
What is the result of this expression? (or multiple ones)
```javascript
function f() {}
var a = f.prototype, b = Object.getPrototypeOf(f);
a === b
```
A: true

B: false

C: null

D: other

还是\_\_proto\_\_和prototype的区别，两者不是一个东西，所以选B

###第三十二题
What is the result of this expression? (or multiple ones)
```javascript
function foo() { }
var oldName = foo.name;
foo.name = "bar";
[oldName, foo.name]
```
A: error

B: \["", ""\]

C: \["foo", "foo"\]

D: \["foo", "bar"\]

考察了函数的name属性，使用函数定义方式时，会给function对象本身添加一个name属性，保存了函数的名称，很好理解oldName为"foo"。name属性时只读的，不允许修改，所以```foo.name = "bar";```之后，foo.name还是"foo"，所以结果为\["foo", "foo"\]，选C

PS：name属性不是一个标准属性，不要去使用，除非你想要坑别人

###第三十三题
What is the result of this expression? (or multiple ones)
```javascript
"1 2 3".replace(/\d/g, parseInt)
```
A: "1 2 3"

B: "0 1 2"

C: "NaN 2 3"

D: "1 NaN 3"

String.prototype.replace、正则表达式的全局匹配和parseInt（又是parseInt...），可以根据题意看出来题目上漏了一个'\'


首先需要确定replace会传给parseInt哪些参数。举个栗子：
```javascript
"1 2 3".replace(/\d/g, function(){
    console.log(arguments);
});
//输出结果：
//["1", 0, "1 2 3"]
//["2", 2, "1 2 3"]
//["3", 4, "1 2 3"] 
```
一共三个：
1. match：正则表达式被匹配到的子字符串
2. offset：被匹配到的子字符串在原字符串中的位置
3. string：原字符串

这样就很好理解了，又回到之前parseInt的问题了，结果就是parseInt("1", 10), parseInt("2", 2), parseInt("3", 4)所以结果为"1, NaN, 3"，选D

###第三十四题
What is the result of this expression? (or multiple ones)
```javascript
function f() {}
var parent = Object.getPrototypeOf(f);
f.name // ?
parent.name // ?
typeof eval(f.name) // ?
typeof eval(parent.name) //  ?
```
A: "f", "Empty", "function", "function"

B: "f", undefined, "function", error

C: "f", "Empty", "function", error

D: other

又是Function.name属性的题，和三十二题一样样，f.name值为"f"，而eval("f")则会输出f函数，所以结果为"function"

接着看parent，parent实际上就是f.\_\_proto\_\_，需要明确的是JavaScript中的函数也是对象，其也有自己的构造函数Function，所以f.\_\_proto\_\_ === Function.prototype结果是true，而Function.prototype就是一个名为Empty的function
```javascript
console.log(Function.prototype);
console.log(Function.prototype.name);
//输出结果：
//function Empty() {}
//Empty
```
所以parent.name的值为Empty

如果想直接在全局作用域下调用Empty，显示未定义...因为Empty并不在全局作用域下

综上所述，结果为C

###第三十五题
What is the result of this expression? (or multiple ones)
```javascript
var lowerCaseOnly =  /^[a-z]+$/;
[lowerCaseOnly.test(null), lowerCaseOnly.test()]
```
A: \[true, false\]

B: error

C: \[true, true\]

D: \[false, true\]

正则表达式的test方法会自动将参数转换为字符串，原式就变成了```[lowerCaseOnly.test("null"), lowerCaseOnly.test("undefined")]```，结果都是真，所以选C

###第三十六题
What is the result of this expression? (or multiple ones)
```javascript
[,,,].join(", ")
```
A: ", , , "

B: "undefined, undefined, undefined, undefined"

C: ", , "

D: ""

JavaScript中使用字面量创建数组时，如果最末尾有一个逗号','，会背省略，所以实际上这个数组只有三个元素（都是undefined）：
```javascript
console.log([,,,].length);
//输出结果：
//3
```
而三个元素，使用join方法，只需要添加两次，所以结果为", , "，选C

###第三十七题
What is the result of this expression? (or multiple ones)
```javascript
var a = {class: "Animal", name: 'Fido'};
a.class
```
A: "Animal"

B: Object

C: an error

D: other

经典坑中的一个，class是关键字。根据浏览器的不同，结果不同：

chrome的结果： "Animal"

Firefox的结果："Animal"

Opera的结果："Animal"

IE 8以上也是： "Animal"

IE 8 及以下： 报错

###总结
终于把37题全部弄完了，虽然很多题都偏而怪，但其中涉及的知识还是相当重要的。JavaScript中的糟粕和精华永远是一个话题，也是笔试面试时经常遇到的问题。

