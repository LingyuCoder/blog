layout: art
title: JavaScript隐式类型转换
subtitle: 转啊转啊转啊转啊转啊转啊转啊转啊转啊转，开始想念Java了
tags: 
- JavaScript
categories: 
- JS技术
date: 2014/3/30
---

从大犀牛上汇总一下隐式类型转换，并配上一些实例帮助理解，希望以后面试的时候不会被坑

<!-- more -->

##对象转原始值
###对象转布尔
对象转Boolean很简单，所有对象都是true

举个栗子：
```javascript
> !!new Boolean(false)
true

> if(new Boolean(false)){
    console.log(true);
  } else {
    console.log(false);
  }
true
```

###对象转字符串
对象转字符串经过如下步骤：
- 如果对象有toString()方法，则调用toString()。如果toString()返回一个原始值，那么将这个值转为字符串（如果它不是字符串的话），并返回
- 如果对象没有toString()方法，或者调用toString()方法返回的不是一个原始值，那么调用valueOf()方法。 如果valueOf()方法返回的是原始值，那么将它转换为字符串，并返回
- 如果无法从toString()或valueOf()获得一个原始值，那么将抛出一个类型错误异常

来个栗子：
```javascript
function Obj(){}
Obj.prototype.toString = function(){return "callToString"}
Obj.prototype.valueOf = function(){return "callValueOf"}
var data = {
    "callToString" : "callToString",
    "callValueOf" : "callValueOf"
};

console.log(data[new Obj()]);//输出"callToString"

Obj.prototype.toString = function(){return {};}

console.log(data[new Obj()]);//输出"callValueOf"
```

###对象转数字
对象转数字经过如下步骤：
- 如果对象有valueOf()方法，后者返回一个原始值，那么将这个原始值转换为数字并返回
- 如果对象没有valueOf()方法，或返的不是一个原始值，尝试toString()方法。如果有toString()方法，且返回一个原始值，那么将其转换成数字并返回
- 如果无法从valueOf()或toString()获得一个原始值，那么将抛出一个类型错误异常

```javascript
function Obj() {}
Obj.prototype.toString = function() {
    return "20"
};

console.log(new Obj() * 1);//输出20

Obj.prototype.valueOf = function() {
    return "10"
};

console.log(new Obj() * 1);//输出10
```
由这个栗子可以看到，转数字时会优先尝试valueOf()方法，然后尝试toString()方法，虽然获得的原始类型都是字符串，但会将字符串转换为数字


##运算符与隐式类型转换
###“+”运算符
“+”运算符的行为如下：
- 如果其中一个操作数是对象，那么会将对象转换为原始值类型（Date通过toString方法，其他对象依次尝试valueOf和toString()）
- 如果对象转换到原始值后，其中一个是字符串，那么另一个也被转成字符串，进行字符串连接
- 否则两个操作数都将转换为数字（或NaN），然后想加

```javascript
function Obj(){}
Obj.prototype.valueOf = function(){
    return "234";
};

console.log(123 + new Obj());//输出"123234"

Obj.prototype.valueOf = function(){
    return 234;
};

console.log(123 + new Obj());//输出"357"

Obj.prototype.valueOf = function(){
    return true;
};

console.log(123 + new Obj());//输出"124"

console.log(123 + new Date());//输出"123Sun Mar 30 2014 12:53:02 GMT+0800 (中国标准时间)"
```

###其他算数运算符
乘法(\*)，除法(/)，取模(%)，减法(-)，以及一元算数运算符（+，-，++，--）都是在需要的时候将操作数转化为数字，就是根据上面先尝试valueOf，后尝试toString的方式来转换。如果有一个操作数是NaN，那么运算结果也是NaN

###位运算符
位运算符需要它的操作数是整数，这些整数表示32位整型而不是64位浮点数，所以在进行位运算之前，首先将操作数转换为数字，然后转换为32位整型，之后进行操作。而NaN，Infinity和-Infinity都转换成0。

###关系表达式
严格相等（===）不会进行类型转换，而使用相等（==）会进行隐式的类型转换。严格相等会比较类型和值，类型不一致的两个值肯定不相等，具体规则如下：- 两个值类型不同，他们不相等
- 都是null或都是undefined，他们不相等
- 都是布尔true或布尔false，他们相等
- 有一个值是NaN，那么不相等，NaN也不等于自身
- 都位数字时，且他们值相等，那么相等，0与-0相等
- 两个值都为字符串，如果他们长度或内容不同，则不相等
- 两个值都引用对象、数组或函数，如果它们引用同一个对象，他们相等，否则不相等

举一些栗子来验证一下：
```javascript
> ({}) === ({})
false

> [] === []
false

> var a, b;
> a = b = {};
> a === b
true

> NaN === NaN
false

> null === undefined
false

> 0 === -0
true

> Infinity === Infinity
true

> Infinity === -Infinity
false
```

相等运算符（==）会进行隐式类型转换，规则如下：
- 如果两个操作数类型相等，则和上面严格相等的比较规则一样
- 如果其中一个值是null，另一个是undefined，他们相等
- 如果一个是数字，另一个是字符串，则会先将字符串转为数字再比较
- 如果其中一个是布尔类型，也会将其转换为数字，然后在比较，true转换为1，false转换为0
- 如果一个值为对象，另一个值为数字或字符串，那么像将其转换为原始值。JavaScript语言核心的内置类会优先尝试valueOf，然后尝试toString。但Date类只是用toString转换
- 其他不同类型之间的比较均不相等

举一些栗子：
```javascript
> null == undefined
true

> ({}) == ({})
false

> [] == []
false

> "123" == 123
true

> true == "1"
true

> NaN == NaN
false

> function Obj(){}
> Obj.prototype.toString = function(){return "tostring";}
> Obj.prototype.valueOf = function(){return "valueof";}
> new Obj() == "valueof"
true

> Infinity == Infinity
true

> Infinity == -Infinity
false
```
##比较运算符
小于、大于，小于等于、大于等于这些比较运算符的操作数可能是任意类型，但只有数字和字符串才能真正进行比较操作，所以会对其进行转换：
- 如果操作数是对象，那么这个对象会转换为原始值，同样有限使用valueOf，然后使用toString
- 对象转换为原始值后，如果都是字符串，按照字典序比较
- 如果至少有一个操作数不是字符串，那么两个操作数都将转换为数字进行比较，0与-0相等，Infinity比任何数字都大（除了Infinity本身），-Infinity比任何数字都小，如果其中一个操作数是NaN，比较操作符返回false

举几个栗子：
```javascript
> NaN < 1
false

> NaN > 1
false

> Infinity < Infinity
fasle

> Infinity > Infinity
false

> Infinity > -Infinity
true

> "a" < "b"
true

> "abcd" < "abce"
true
```

###in运算符
in运算符永远期望左操作数是字符串，右操作数是一个对象，所以左操作数会隐式类型转换：
```javascript
function Obj(){}
Obj.prototype.toString = function(){return "callToString"}
Obj.prototype.valueOf = function(){return "callValueOf"}
var data = {
    "callToString" : "callToString"
};

console.log(new Obj() in data);//输出true

Obj.prototype.toString = function(){return {};}

console.log(new Obj() in data);//输出false

data.callValueOf = "callValueOf";

console.log(new Obj() in data);//输出true
```
第一个console时，首先将`new Obj()`创建的对象转换为字符串，先尝试toString方法，获得callToString字符串，而它在data对象中存在，所以输出true

第二个console时，首先将`new Obj()`创建的对象转换为字符串，先尝试toString方法，获得一个对象，不是原始值，于是尝试valueOf方法，获得callValueOf字符串，而它在data对象中不存在，所以输出false

第三个console和第二个console过程一样，不过这一次data中存在callValueOf字符串，所以输出true

###instanceof运算符
instanceof运算符总是希望左操作数是一个对象，右操作数是一个函数。instanceof一次检查左操作数的对象的原型链的VO，如果存在右操作数函数的prototype存在于左操作数对象的原型链上，那么返回true，否则返回false

###逻辑表达式
逻辑操作符实际上并不总是作用于Boolean类型，它是根据左右操作数是真值还是假值来判定的

假值包括：
- false
- null
- undefined
- 0
- -0
- NaN
- ""

除了假值以外的所有值都是真值

逻辑&&运算符中，如果左操作数是假值，那么不计算右操作数，直接返回左操作数（短路）。如果左操作符是真值，返回右操作数
```javascript
var a,b;
a = null;
b = "something";
console.log(a && b);//输出null

a = "something";
b = null;
console.log(a && b);//输出null

a = "something";
b = "otherthing";
console.log(a && b);//输出"otherthing"
```

逻辑||运算符也是一样会出现短路，不过短路的条件时左值为真值。所以当左操作数为真值时，不计算右操作数而直接返回左操作数，否则返回右操作数
```javascript
var a,b;
a = "something";
b = null;
console.log(a || b);//输出"something"

a = null;
b = null;
console.log(a || b);//输出null

a = null;
b = "something";
console.log(a || b);//输出"something"
```

逻辑非（!）是一元运算符，它会先将操作数转换为布尔值（真值转true，假值转false）：
```javascript
> !""
true

> !NaN
true

> !"a"
false
```
一般我们需要将任意类型根据其真假值转换为Boolean时，可以使用如下方式：
```javascript
result = !!param;
```

