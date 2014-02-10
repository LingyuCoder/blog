---
layout: art
title: JavaScript选择题解答（1-20）
subTitle: javascript puzzlers的个人解答
desc: 最近做了个heroku上的JavaScript的测试（<a href="http://javascript-puzzlers.herokuapp.com/">题目地址</a>），错了一大堆，感觉js的概念还有很多不是很清晰，这里记录一下
tags: [javascript]
categories: [前端技术]
---
{% raw %}
最近做了个heroku上的JavaScript的测试（[题目地址](http://javascript-puzzlers.herokuapp.com/)），错了一大堆，感觉js的概念还有很多不是很清晰，这里记录一下

###第一题
What is the result of this expression? (or multiple ones)
```javascript
["1", "2", "3"].map(parseInt) 
```
A：\["1", "2", "3"\]

B：\[1, 2, 3\]

C：\[0, 1, 2\]

D：other

解答：这里考的是map、parseInt的用法。map会传递三个参数给其作为参数的函数，为(element, index, array)，分别为当前的元素、当前元素在数组中的位置、整个数组：

    > ["1", "2", "3"].map(function(){console.log(arguments)}) 
    ["1", 0, Array[3]]
    ["2", 1, Array[3]]
    ["3", 2, Array[3]]
 

而parseInt只接收两个参数，为(element, radix)，element代表需要被转换为int的字符串，radix代表当前字符串里数字的进制数

所以相当于说，结果数组的元素实际分别为为：

    parseInt("1", 0)
    parseInt("2", 1)
    parseInt("3", 2)

parseInt("1", 0)的值为1，MDN上可以看到parseInt函数的radix为0时的行为

If radix is undefined or 0 (or absent), JavaScript assumes the following:

If the input string begins with "0x" or "0X", radix is 16 (hexadecimal) and the remainder of the string is parsed.

If the input string begins with "0", radix is eight (octal) or 10 (decimal).  Exactly which radix is chosen is implementation-dependent.  ECMAScript 5 specifies that 10 (decimal) is used, but not all browsers support this yet.  For this reason always specify a radix when using parseInt.

If the input string begins with any other value, the radix is 10 (decimal).

所以这里radix值实际为10，所以结果为1

而parseInt("2", 1)和parseInt("3", 2)则确实无法解析，会生成NaN

所以答案为\[1,NaN,NaN\]，为D

###第二题和第五题
What is the result of this expression? (or multiple ones)
```javascript
[typeof null, null instanceof Object]
```
A: \["object", false\]

B: \[null, false\]

C: \["object", true\]

D: other

考察typeof运算符和instanceof运算符，上MDN上看一下typeof运算符，一些基础类型的结果为：
Undefined           "undefined"
Null                "object"
Boolean             "boolean"
Number              "number"
String              "string"
Any other object    "object"
Array               "object"

自从javascript创造出来，typeof null的值就是object了

而null instanceof 任何类型 都是false

所以答案为\["object", false\], 选A

###第三题
What is the result of this expression? (or multiple ones)
```javascript
[ [3,2,1].reduce(Math.pow), [].reduce(Math.pow)] ]
```
A: an error

B: \[9, 0\]

C: \[9, NaN\]

D: \[9, undefined\]

这题考的Math.pow和Array.prototype.reduce

Math.pow(base, exponent)接受两个参数：基数、需要计算的次方

reduce传递给其作为参数的函数几个值：
* previousValue：上一次计算的结果
* currentValue：当前元素的值
* index： 当前元素在数组中的位置
* array：整个数组

reduce本身接受两个参数，callback和initialValue，分别是reduce的回调函数和计算初始值--也就是第一次reduce的callback被调用时的previousValue的值，默认为0

reduce在数组为空且没有定义initialValue时，会抛出错误，如chrome下：TypeError: Reduce of empty array with no initial value

所以选A

###第四题
What is the result of this expression? (or multiple ones)
```javascript
var val = 'smtg';
console.log('Value is ' + (val === 'smtg') ? 'Something' : 'Nothing');
```
A: Value is Something

B: Value is Nothing

C: NaN

D: other

这题考的javascript中的运算符符优先级，[MDN传送门](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Operator_Precedence)，这里'+'运算符的优先级要高于'?'所以运算符，实际上是 'Value is true'?'Something' : 'Nothing'，当字符串不为空时，转换为bool为true，所以结果为'Something'，选D

###第六题
What is the result of this expression? (or multiple ones)
```javascript
var name = 'World!';
(function () {
    if (typeof name === 'undefined') {
        var name = 'Jack';
        console.log('Goodbye ' + name);
    } else {
        console.log('Hello ' + name);
    }
})();
```
A: Goodbye Jack

B: Hello Jack

C: Hello undefined

D: Hello World

这题考的是javascript作用域中的变量提升，javascript的作用于中使用var定义的变量都会被提升到所有代码的最前面，于是乎这段代码就成了：
```javascript
var name = 'World!';
(function () {
    var name;//现在还是undefined
    if (typeof name === 'undefined') {
        name = 'Jack';
        console.log('Goodbye ' + name);
    } else {
        console.log('Hello ' + name);
    }
})();
```
这样就很好理解了，```typeof name === 'undefined'```的结果为true，所以最后会输出'Goodbye Jack'，选A

###第七题
What is the result of this expression? (or multiple ones)
```javascript
var END = Math.pow(2, 53);
var START = END - 100;
var count = 0;
for (var i = START; i <= END; i++) {
    count++;
}
console.log(count);
```
A: 0

B: 100

C: 101

D: other

这题考查javascript中的数字的概念：首先明确一点，javascript和其他语言不同，仅有一种数字，IEEE 754标准的64位浮点数，能够表示的整数范围是-2^53~2^53（包含边界值），所以Math.pow(2, 53)即为javascript中所能表示的最大整数，在最大整数在继续增大就会出现精度丢失的情况，END + 1 的值其实是等于END的，这也就造成了死循环，所以选D

###第八题
What is the result of this expression? (or multiple ones)
```javascript
var ary = [0,1,2];
ary[10] = 10;
ary.filter(function(x) { return x === undefined;});
```
A: \[undefined 脳 7\]

B: \[0, 1, 2, 10\]

C: \[\]

D: \[undefined\]

考查Array.prototype.filter方法的使用，MDN上有这么一句it is not invoked for indexes which have been deleted or which have never been assigned values，所以结果为空数组，选C

###第九题
What is the result of this expression? (or multiple ones)
```javascript
var two   = 0.2
var one   = 0.1
var eight = 0.8
var six   = 0.6
[two - one == one, eight - six == two]
```
A: \[true, true\]

B: \[false, false\]

C: \[true, false\]

D: other

浮点数计算时的精度丢失问题，其他语言也会出现...至于结果，反正我是蒙的...chrome中计算出来的结果：\[0.1, 0.20000000000000007\]，也就是\[true, false\]，选C

###第十题
What is the result of this expression? (or multiple ones)
```javascript
function showCase(value) {
    switch(value) {
    case 'A':
        console.log('Case A');
        break;
    case 'B':
        console.log('Case B');
        break;
    case undefined:
        console.log('undefined');
        break;
    default:
        console.log('Do not know!');
    }
}
showCase(new String('A'));
```
A: Case A

B: Case B

C: Do not know!

D: undefined

这题考的是使用new方法创建基础类型，使用new方法创建的基础类型，首先来看个栗子(chrome):
```javascript
> typeof new String("skyinlayer");
"object"
typeof "skyinlayer";
"string"
```
这样基本上就能看到结果了，但是为什么呢？MDN上的解释是，字符串字面量和直接调用String()方法（不使用new调用构造函数）的结果是原始字符串。JS自动回转化原始字符串到String对象。所以可以在原始字符串上使用用String对象的方法。而在上下文中，在原始字符串的方法被调用或者从其中获取属性时，JS会自动包裹原始字符串然后调用方法或者获取属性。

所以呢，JS本身有原始字符串和字符串对象之分，只不过在调用方法和获取属性时的时候会自动转换，但typeof运算符运算时是不会转换的。Number和Boolean同样适用

所以这里结果为Do not know!，选C

###第十一题
What is the result of this expression? (or multiple ones)
```javascript
function showCase2(value) {
    switch(value) {
    case 'A':
        console.log('Case A');
        break;
    case 'B':
        console.log('Case B');
        break;
    case undefined:
        console.log('undefined');
        break;
    default:
        console.log('Do not know!');
    }
}
showCase(String('A'));
```
A: Case A

B: Case B

C: Do not know!

D: undefined

和上题原理一样，不过这里没有使用new来生成字符串，所以生成的结果就是原始字符串，相当于```showCase('A')```，所以结果就是A了

###第十二题
What is the result of this expression? (or multiple ones)
```javascript
function isOdd(num) {
    return num % 2 == 1;
}
function isEven(num) {
    return num % 2 == 0;
}
function isSane(num) {
    return isEven(num) || isOdd(num);
}
var values = [7, 4, '13', -9, Infinity];
values.map(isSane);
```
A: \[true, true, true, true, true\]

B: \[true, true, true, true, false\]

C: \[true, true, true, false, false\]

D: \[true, true, false, false, false\]

还是JS的数字相关，不过这次考察的是取模，这题我也是瞎蒙的（果断跪了）。

前两个基本上没什么疑问，必然是true

'13'在进行计算前则会进行隐式类型转换（JS最恶心的部分之一），详细参见[$雨$的文章《Javascript类型转换的规则》](http://www.cnblogs.com/mizzle/archive/2011/08/12/2135885.html)，这里的规则就是将字符串通过Number()方法转换为数字，所以结果为13 % 2 ，也就是true

而JS中负数取模的结果是负数，这里-9%2的结果实际上是-1，所以为false

而Infinity对任意数取模都是NaN，所以是false

综上，结果为\[true, true, true, false, false\]，也就是C

###第十三题
What is the result of this expression? (or multiple ones)
```javascript
parseInt(3, 8)
parseInt(3, 2)
parseInt(3, 0)
```
A: 3, 3, 3

B: 3, 3, NaN

C: 3, NaN, NaN

D: other

还是parseInt的题，考的和第一题类似，第一个值为3没什么好说的。如果出现的数字不符合后面输入的进制，则为NaN，所以第二个值为NaN。而radix为0时的情况第一题下面有介绍，这里也是一样为默认10，所以结果为3，所以答案为3, NaN, 3，选D

###第十四题
What is the result of this expression? (or multiple ones)
```javascript
Array.isArray( Array.prototype )
```
A: true

B: false

C: error

D: other

死知识，[MDN传送门](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/prototype)，这是MDN官方给的例子...

###第十五题
What is the result of this expression? (or multiple ones)
```javascript
var a = [0];
if ([0]) { 
  console.log(a == true);
} else { 
  console.log("wut");
}
```
A: true

B: false

C: "wut"

D: other

同样是一道隐式类型转换的题，不过这次考虑的是'=='运算符，a本身是一个长度为1的数组，而当数组不为空时，其转换成bool值为true。

而==左右的转换，会使用```如果一个操作值为布尔值，则在比较之前先将其转换为数值```的规则来转换，Number(\[0\])，也就是0，于是变成了0 == true，结果自然是false，所以最终结果为B

###第十六题
What is the result of this expression? (or multiple ones)
```javascript
[] == []
```
A: true

B: false

C: error

D: other

这题考的是数组字面量创建数组的原理和==运算符，首先JS中数组的真实类型是Object这点很明显```typeof []```的值为"object"，而==运算符当左右都是对象时，则会比较其是否指向同一个对象。而每次调用字面量创建，都会创造新的对象，也就是会开辟新的内存区域。所以指针的值自然不一样，结果为 false，选B

###第十七题
What is the result of this expression? (or multiple ones)
```javascript
'5' + 3  
'5' - 3  
```
A: 53, 2

B: 8, 2

C: error

D: other

又是一道隐式类型转换的题

加法： 加法运算中，如果有一个操作值为字符串类型，则将另一个操作值转换为字符串，最后连接起来

减法： 如果操作值之一不是数值，则被隐式调用Number()函数进行转换

所以第一行结果为字符串运算，为'53'。第二行结果为2，选A

###第十八题
What is the result of this expression? (or multiple ones)
```javascript
1 + - + + + - + 1 
```
A: 2

B: 1

C: error

D: other

C语言中的经典...对于这种问题，原理什么的不懂，蒙吧，结果是2

###第十九题
What is the result of this expression? (or multiple ones)
```javascript
var ary = Array(3);
ary[0]=2
ary.map(function(elem) { return '1'; }); 
```
A: \[2, 1, 1\]

B: \["1", "1", "1"\]

C: \[2, "1", "1"\]

D: other

又是考的Array.prototype.map的用法，map在使用的时候，只有数组中被初始化过元素才会被触发，其他都是undefined，所以结果为\["1", undefined × 2\]，选D

###第二十题
What is the result of this expression? (or multiple ones)
```javascript
function sidEffecting(ary) { 
  ary[0] = ary[2];
}
function bar(a,b,c) { 
  c = 10
  sidEffecting(arguments);
  return a + b + c;
}
bar(1,1,1)
```
A: 3

B: 12

C: error

D: other

这题考的是JS的函数arguments的概念：

在调用函数时，函数内部的arguments维护着传递到这个函数的参数列表。它看起来是一个数组，但实际上它只是一个有length属性的Object，不从Array.prototype继承。所以无法使用一些Array.prototype的方法。

arguments对象其内部属性以及函数形参创建getter和setter方法，因此改变形参的值会影响到arguments对象的值，反过来也是一样

具体例子可以参见[Javascript秘密花园#arguments](http://bonsaiden.github.io/JavaScript-Garden/zh/#function.arguments)

所以，这里所有的更改都将生效，a和c的值都为10，a+b+c的值将为21，选D

{% endraw %}