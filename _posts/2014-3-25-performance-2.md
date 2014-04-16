---
layout: art
title: 前端性能优化（JavaScript篇）
subTitle: 前端性能优化系列
desc: 最近准备笔试面试题的时候看到很多关于前端性能优化的问题，所以提前调研做做准备，加上我之前写的两篇博客，组成一个新系列
tags: [JavaScript, HTML, CSS]
categories: [性能优化]
---

{% raw %}
##优化循环
如果现在有个一个`data[]`数组，需要对其进行遍历，应当怎么做？最简单的代码是：
```javascript
for (var i = 0; i < data.length; i++) {
    //do someting
}
```
这里每次循环开始前都需要判断i是否小于`data.length`，JavaScript并不会对`data.length`进行缓存，而是每次比较都会进行一次取值。如我们所知，JavaScript数组其实是一个对象，里面有个length属性，所以这里实际上就是取得对象的属性。如果直接使用变量的话就会少一次索引对象，如果数组的元素很多，效率提升还是很可观的。所以我们通常将代码改成如下所示：
```javascript
for(var i = 0, m = data.length; i < m; i++) {
    //do someting
}
```
这里多加了一个变量m用于存放`data.length`属性，这样就可以在每次循环时，减少一次索引对象，但是代价是增加了一个变量的空间，如果遍历不要求顺序，我们甚至可以不用m这个变量存储长度，在不要求顺序的时候可以使用如下代码：
```javascript
for(var i = data.length; i--; ) {
    //do someting
}
```
当然我们可以使用while来替代：
```javascript
var i = data.length;
while(i--) {
    //do someting
}
```
这样就可只使用一个变量了

##运算结果缓存
由于JavaScript中的函数也是对象（JavaScript中一切都是对象），所以我们可以给函数添加任意的属性。这也就为我们提供符合备忘录模式的缓存运算结果的功能，比如我们有一个需要大量运算才能得出结果的函数如下：
```javascript
function calculator(params) {
    //大量的耗时的计算 
    return result;
}
```
如果其中不涉及随机，参数一样时所返回的结果一致，我们就可以将运算结果进行缓存从而避免重复的计算：
```javascript
function calculator(params) {
    var cacheKey = JSON.stringify(params);
    var cache = calculator.cache = calculator.cache || {};
    if(typeof cache[cacheKey] !== 'undefined') {
        return cache[cacheKey];
    }
    //大量耗时的计算
    cache[cacheKey] = result;
    return result;
}
```
这里将参数转化为JSON字符串作为key，如果这个参数已经被计算过，那么就直接返回，否则进行计算。计算完毕后再添加入cache中，如果需要，可以直接查看cache的内容：`calculator.cache`

这是一种典型的空间换时间的方式，由于浏览器的页面存活时间一般不会很长，占用的内存会很快被释放（当然也有例外，比如一些WEB应用），所以可以通过这种空间换时间的方式来减少响应时间，提升用户体验。这种方式并不适用于如下场合：
1. 相同参数可能产生不同结果的情况（包含随机数之类的）
2. 运算结果占用特别多内存的情况

##不要在循环中创建函数
这个很好理解，每创建一个函数对象是需要大批量空间的。所以在一个循环中创建函数是很不明智的，尽量将函数移动到循环之前创建，比如如下代码：
```javascript
for(var i = 0, m = data.length; i < m; i++) {
    handlerData(data[i], function(data){
        //do something
    });
}
```
就可以修改为：
```javascript
var handler = function(data){
    //do something
};
for(var i = 0, m = data.length; i < m; i++) {
    handlerData(data[i], handler);
}
```

##让垃圾回收器回收那些不再需要的对象
之前我曾在 [浅谈V8引擎中的垃圾回收机制](http://skyinlayer.com/blog/2014/03/19/v8-gc/) 中讲到了V8引擎如何进行垃圾回收。可以从中看到，如果长时间保存对象，老生代中占用的空间将增大，每次在老生代中的垃圾回收过程将会相当漫长。而垃圾回收器判断一个对象为活对象还是死对象，是按照是否有活对象或根对象含有对它的引用来判定的。如果有根对象或者活对象引用了这个对象，它将被判定为活对象。所以我们需要通过手动消除这些引用来让垃圾回收器对回收这些对象。
###delete
一种方式是通过`delete`方式来消除对象中的键值对，从而消除引用。但这种方式并不提倡，它会改变对象的结构，可能导致引擎中对对象的存储方式变更，降级为字典方式进行存储（详细请见[V8 之旅：对象表示](http://newhtml.net/v8-object-representation/)），不利于JavaScript引擎的优化，所以尽量减少使用
###null
另一种方式是通过将值设为null来消除引用。通过将变量或对象的属性设为null，可以消除引用，使原本引用的对象成为一个“孤岛”，然后在垃圾回收的时候对其进行回收。这种方式不会改变对象的结构，比使用`delete`要好
###全局对象
另外需要注意的是，垃圾回收器认为根对象永远是活对象，永远不会对其进行垃圾回收。而全局对象就是根对象，所以全局作用域中的变量将会一直存在
###事件处理器的回收
在平常写代码的时候，我们经常会给一个DOM节点绑定事件处理器，但有时候我们不需要这些事件处理器后，就不管它们了，它们默默的在内存中保存着。所以在某些DOM节点绑定的事件处理器不需要后，我们应当销毁它们。同时绑定的时候也尽量使用事件代理的方式进行绑定，以免造成多次重复的绑定导致内存空间的浪费，事件代理可见[前端性能优化（DOM操作篇）](http://skyinlayer.com/blog/2014/03/25/performance-1/)
###闭包导致的内存泄露
JavaScript的闭包可以说即是“天使”又是“魔鬼”，它“天使”的一面是我们可以通过它突破作用域的限制，而其魔鬼的一面就是和容易导致内存泄露，比如如下情况：
```javascript
var result = (function() {
    var small = {};
    var big = new Array(10000000);
    //do something
    return function(){
        if(big.indexOf("someValue") !== -1) {
            return null;
        } else {
            return small;
        }
    }
})();
```
这里，创建了一个闭包。使得返回的函数存储在result中，而result函数能够访问其作用域内的small对象和big对象。由于big对象和small对象都可能被访问，所以垃圾回收器不会去碰这两个对象，它们不会被回收。我们将上述代码改成如下形式：
```javascript
var result = (function() {
    var small = {};
    var big = new Array(10000000);
    var hasSomeValue;
    //do something
    hasSomeValue = big.indexOf("someValue") !== -1;
    return function(){
        if(hasSomeValue) {
            return null;
        } else {
            return small;
        }
    }
})();
```
这样，函数内部只能够访问到hasSomeValue变量和small变量了，big没有办法通过任何形式被访问到，垃圾回收器将会对其进行回收，节省了大量的内存。

##慎用eval和with
Douglas Crockford将eval比作魔鬼，确实在很多方面我们可以找到更好地替代方式。使用它时需要在运行时调用解释引擎对`eval()`函数内部的字符串进行解释运行，这需要消耗大量的时间。像`Function`、`setInterval`、`setTimeout`也是类似的

Douglas Crockford也不建议使用with，with会降低性能，通过with包裹的代码块，作用域链将会额外增加一层，降低索引效率

##对象的优化
###缓存需要被使用的对象
JavaScript获取数据的性能有如下顺序（从快到慢）：变量获取 > 数组下标获取（对象的整数索引获取） > 对象属性获取（对象非整数索引获取）。我们可以通过最快的方式代替最慢的方式：
```javascript
var body = document.body;
var maxLength = someArray.length;
//...
```
需要考虑，作用域链和原型链中的对象索引。如果作用域链和原型链较长，也需要对所需要的变量继续缓存，否则沿着作用域链和原型链向上查找时也会额外消耗时间

###缓存正则表达式对象
需要注意，正则表达式对象的创建非常消耗时间，尽量不要在循环中创建正则表达式，尽可能多的对正则表达式对象进行复用

###考虑对象和数组
在JavaScript中我们可以使用两种存放数据：对象和数组。由于JavaScript数组可以存放任意类型数据这样的灵活性，导致我们经常需要考虑何时使用数组，何时使用对象。我们应当在如下情况下做出考虑：
1. 存储一串相同类型的对象，应当使用数组
2. 存储一堆键值对，值的类型多样，应当使用对象
3. 所有值都是通过整数索引，应当使用数组

###数组使用时的优化
1. 往数组中插入混合类型很容易降低数组使用的效率，尽量保持数组中元素的类型一致
2. 如果使用稀疏数组，它的元素访问将远慢于满数组的元素访问。因为V8为了节省空间，会将稀疏数组通过字典方式保存在内存中，节约了空间，但增加了访问时间

###对象的拷贝
需要注意的是，JavaScript遍历对象和数组时，使用`for...in`的效率相当低，所以在拷贝对象时，如果已知需要被拷贝的对象的属性，通过直接赋值的方式比使用`for...in`方式要来得快，我们可以通过定一个拷贝构造函数来实现，比如如下代码：
```javascript
function copy(source){
    var result = {};
    var item;
    for(item in source) {
        result[item] = source[item];
    }
    return result;
}
var backup = copy(source);
```
可修改为：
```javascript
function copy(source){
    this.property1 = source.property1;
    this.property2 = source.property2;
    this.property3 = source.property3;
    //...
}
var backup = new copy(source);
```

###字面量代替构造函数
JavaScript可以通过字面量来构造对象，比如通过`[]`构造一个数组，`{}`构造一个对象，`/regexp/`构造一个正则表达式，我们应当尽力使用字面量来构造对象，因为字面量是引擎直接解释执行的，而如果使用构造函数的话，需要调用一个内部构造器，所以字面量略微要快一点点。

##缓存AJAX
曾经听过一个访问时间比较（当然不精确）：
* cpu cache ≈ 100 * 寄存器
* 内存 ≈ 100 * cpu cache
* 外存 ≈ 100 * 内存
* 网络 ≈ 100 * 外存

可看到访问网络资源是相当慢的，而AJAX就是JavaScript访问网络资源的方式，所以对一些AJAX结果进行缓存，可以大大减少响应时间。那么如何缓存AJAX结果呢

###函数缓存
我们可以使用前面缓存复杂计算函数结果的方式进行缓存，通过在函数对象上构造cache对象，原理一样，这里略过。这种方式是精确到函数，而不精确到请求

###本地缓存
HTML5提供了本地缓存sessionStorage和localStorage，区别就是前者在浏览器关闭后会自动释放，而后者则是永久的，不会被释放。它提供的缓存大小以MB为单位，比cookie（4KB）要大得多，所以我们可以根据AJAX数据的存活时间来判断是存放在sessionStorage还是localStorage当中，在这里以存储到sessionStorage中为例(localStorage只需把第一行的`window.sessionStorage`修改为`window.localStorage`)：
```javascript
function(data, url, type, callback){
    var storage = window.sessionStorage;
    var key = JSON.stringify({
        url : url,
        type : type,
        data : data
    });
    var result = storage.getItem(key);
    var xhr;
    if (result) {
        callback.call(null, result);
    } else {
        xhr.onreadystatechange = function(){
            if(xhr.readyState === 4){
                if(xhr.status === 200){
                    storage.setItem(key, xhr.responseText);
                    callback.call(null, xhr.responseText);
                } else {
                }
            }
        };
        xhr.open(type, url, async);
        xhr.send(data);
    }
};
```

##使用布尔表达式的短路
在很多语言中，如果bool表达式的值已经能通过前面的条件确定，那么后面的判断条件将不再会执行，比如如下代码
```javascript
function calCondition(params) {
    var result;
    //do lots of work
    return !!result;
}

if(otherCondition && calCondition(someParams)) {
    console.log(true);
} else {
    console.log(false);
}
```
这里首先会计算`otherCondition`的值，如果它为false，那么整个正则表达式就为false了，后续的需要消耗大量时间的`calCondition()`函数就不会被调用和计算了，节省了时间

##使用原生方法
在JavaScript中，大多数原生方法是使用C++编写的，比js写的方法要快得多，所以尽量使用诸如`Math`之类的原生对象和方法

##字符串拼接
在IE和FF下，使用直接`+=`的方式或是`+`的方式进行字符串拼接，将会很慢。我们可以通过Array的`join()`方法进行字符串拼接。不过并不是所有浏览器都是这样，现在很多浏览器使用`+=`比join()方法还要快

##使用web worker
web worker是HTML5提出的一项新技术，通过多线程的方式为JavaScript提供并行计算的能力，通过message的方式进行相互之间的信息传递，我还没有仔细研究过

##JavaScript文件的优化
###使用CDN
在编写JavaScript代码中，我们经常会使用库（jQuery等等），这些JS库通常不会对其进行更改，我们可以将这些库文件放在CDN（内容分发网络上），这样能大大减少响应时间

###压缩与合并JavaScript文件
在网络中传输JS文件，文件越长，需要的时间越多。所以在上线前，通常都会对JS文件进行压缩，去掉其中的注释、回车、不必要的空格等多余内容，如果通过uglify的算法，还可以缩减变量名和函数名，从而将JS代码压缩，节约传输时的带宽。另外经常也会将JavaScript代码合并，使所有代码在一个文件之中，这样就能够减少HTTP的请求次数。合并的原理和sprite技术相同

###使用Application Cache缓存
这个在之前的文章[前端性能优化（Application Cache篇）](http://skyinlayer.com/blog/2014/02/20/application-cache/)中已有描述，就不赘述了

{% endraw %}