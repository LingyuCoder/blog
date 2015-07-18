layout: art
title: JavaScript的继承
subtitle: 对JavaScript继承的一些思考和实践
tags: 
- JavaScript
categories: 
- JS技术
date: 2014/4/18
---

面试遇到了继承的问题，虽然以前有在《JavaScript模式》里读过，不过由于记得不是很牢直接花样作死了。面试官也说继承的知识相当重要，于是乎又在闲暇的时候写了些继承的实现

<!-- more -->

##new都干了些什么
---
###大致流程
通过new创建的对象，大致过程如下：

1. 首先创建个Object
2. 修改这个对象的`__proto__`，使其指向构造函数的`prototype`
3. 将这个对象交给构造函数的`this`，调用构造函数
4. 如果构造函数没有return，那么返回这个对象。否则构造函数返回return语句后面的内容

###模拟一下
我们可以通过在Function.prototype上创建个新方法来模拟new：
```javascript
Function.prototype.__new__ = function(){
    var newObj;
    var resultObj;
    newObj = {};
    newObj.__proto__ = this.prototype;
    resultObj = this.apply(newObj, arguments);
    return (typeof resultObj === 'object' && resultObj) || newObj;
};
```

##constructor的问题
在创建一个函数时，会为这个函数增加一个`prototype`属性指向一个对象，而这个`prototype`对象内有一个属性就是`constructor`，这样在使用构造函数创建一个新对象时，新对象的`__proto__`自然指向含有`constructor`的构造函数的`prototype`对象。但当更换了这个构造函数的`prototype`，一切就不一样了。比如如下代码

```javascript
function A(){}
A.prototype = {}
console.log(new A().constructor)
//输出：function Object() { [native code] } 
```
这里并没有输出`function A(){}`。因为A的`prototype`对象已经被重写了，其为一个Object实例，A的`prototype`对象中不包含`constructor`属性。而输出Object构造函数是因为Object实例的`__proto__`指向`function Object(){}`的prototype属性，而它内部有constructor：

```javascript
var tmp = new A();
console.log(tmp.__proto__.hasOwnProperty("constructor"));
//输出：false
console.log(tmp.__proto__.__proto__.hasOwnProperty("constructor"));
//输出：true
```

所以，如果直接使用通过修改`prototype`的方式实现继承，这将导致`constructor`不正确，比如如下代码：
```javascript
function Parent(){}
function Child(){}
Child.prototype = new Parent();
console.log(new Child().constructor);
//输出：function Parent(){} 
```

如果想要`new Child().constructor`指向Child，我们需要显示的修改其`prototype`的`constructor`：
```javascript
function Parent(){}
function Child(){}
Child.prototype = new Parent();
Child.prototype.constructor = Child;
console.log(new Child().constructor);
//输出：function Child(){}
```

##继承方法
###直接继承
这种方式也就是上面的例子了：
```javascript
function Parent(){
    this.parentName = "parent";
}
function Child(){
    this.childName = "child";
}
Child.prototype = new Parent();
Child.prototype.constructor = Child;
var childIst = new Child();
console.log(childIst instanceof Child);
//输出：true
console.log(childIst instanceof Parent);
//输出：true
console.log(childIst.constructor);
//输出：function Child(){}
console.log(childIst);
//输出如下图
```
整个childIst对象如下图所示：

![直接继承时的对象](http://lingyu.wang/img/js_inherit/1.png)

这种方式实现简单，这种方式有如下特点：
1. 所有子类实例共用一个父类实例，节省空间
2. 父类的所有属性都会被暴露给子类
3. 父类的属性子类无法直接修改，只能覆盖
4. 无法实现多继承

###Object.create方式
在ECMAScript5中新增了`Object.create`方法用于实现继承，其大致实现如下（不考虑属性添加）：

```javascript
Object.prototype.create = function (o) {
    function F() {}
    F.prototype = o;
    return new F();
};
```

所以一种可行的继承方式变成如下这样：
```javascript
function Parent(){
    this.parentName = "parent";
}
function Child(){
    this.childName = "child";
}
Child.prototype = Object.create(Parent.prototype);
Child.prototype.constructor = Child;
var childIst = new Child();
console.log(childIst instanceof Child);
//输出：true
console.log(childIst instanceof Parent);
//输出：true
console.log(childIst.constructor);
//输出：function Child(){}
console.log(childIst);
//输出：如下图所示
```

![Object.create继承时的对象](http://lingyu.wang/img/js_inherit/2.png)

没有parentName属性，因为这种方式实现的继承并没有创建父类实例，而是通过一个临时函数复制了父类的`prototype`来创建。这样的话父类不在其`prototype`中的属性不会被复制到临时构造函数中，这些属性对子类是不可见的

这种继承方式的特点是：
1. 父类仅其prototype上的属性对子类可见
2. 同样无法多继承
3. 所有子类实例公用的一个父类实例
4. ES5方法，兼容性，ie9+，不兼容时需要polyfill

这种通过创建一个临时对象的方式可以用在很多地方，只要需要隐藏父类自身属性的场景都可以用到

###复制属性实现继承——共用原型
传统的类继承，子类实例不会共享父类实例，每一个子类实例拥有自己的父类实例。而JS中并没有这样的继承方式，可以通过将父类的所有值拷贝给子类实例的方式来实现继承：

```javascript
function Parent() {
    this.parentName = "parent";
}
Parent.prototype.getName = function(){
    return this.parentName;
};
function Child(){
    Parent.apply(this, arguments);
    this.childName = "child";
}
Child.prototype = Parent.prototype;
var childIst = new Child();
console.log(childIst instanceof Child);
//输出：true
console.log(childIst instanceof Parent);
//输出：true
console.log(childIst.constructor);
//输出：function Child(){}
console.log(childIst);
//输出：见下图
```
子类实例的结构图如下所示：

![复制属性，共用原型时的对象](http://lingyu.wang/img/js_inherit/3.png)

这种方式，通过`Parent.apply(this)`将子类实例传递给父类构造函数，让父类构造函数将其属性写入子类之中，这里只复制了父类`this`上的属性，没有复制原型上的属性。然后再子类构造函数中定义子类属性，若与父类属性同名，将会覆盖父类属性。最后将子类构造函数指向父类构造函数的`prototype`，使得子类实例拥有父类实例的原型链

这种方式继承有如下特点：
1. 子类属性覆盖掉了父类属性，同时每个子类实例可修改其父类属性而不影响到其他对象
2. 可以通过`delete`来对父类不想要暴露的属性进行删除
3. 每个子类实例拥有自己的父类属性
4. 子类与父类同名属性发生覆盖，覆盖后无法再获取覆盖前的父类属性值
5. 由于父类和子类共享`prototype`，若修改子类的`prototype`属性会影响到所有继承于父类的子类，所以不能修改

###复制属性实现继承——不共用原型
可通过修改上述方法实现不共用原型的方式：
```javascript
function Parent() {
    this.parentName = "parent";
}
Parent.prototype.getName = function(){
    return this.parentName;
};
function Child(){
    Parent.apply(this, arguments);
    this.childName = "child";
}
Child.prototype = new Parent();
Child.prototype.constructor = Child;
var childIst = new Child();
console.log(childIst);
//输出：见下图
```
![复制属性，不共用原型时的对象](http://lingyu.wang/img/js_inherit/4.png)

还是通过原型链的方式，这样子类实例就有可修改的父类属性了。但这样会重复调用父类构造函数，导致创建重复属性（比如parentName）浪费内存空间，但这样就去除了上面的共用构造函数`prototype`所带来的问题。


###扁平复制
由于继承的目标就是让子类拥有父类的特性，那么最为简单粗暴的方法，就是把父类的所有属性和方法全部复制到子类上去：

```javascript
function Parent(){
    this.parentName = "parent";
}
Parent.prototype.getName = function(){
    return this.parentName;
}
function Child(){
    var parentIst = new Parent();
    var item;
    for(item in parentIst) {
        this[item] = parentIst[item];
    }
    this.childName = "child";
}
var childIst = new Child();
console.log(childIst instanceof Child);
//输出：true
console.log(childIst instanceof Parent);
//输出：false
console.log(childIst.constructor);
//输出：function Child(){}
console.log(childIst);
//输出：见下图
```

![扁平复制所有属性时的对象](http://lingyu.wang/img/js_inherit/5.png)

这种方式实现的继承比较扁平，由于没有使用原型继承，其原型链层数不会增加，有如下特点：
1. 可以实现多继承
2. 会发生属性覆盖，被覆盖的属性无法获得
3. `instanceof`操作符无法检测父类
4. 子类实例拥有所有父类实例的所有属性，且可修改和删除
5. 父类所有属性均进入到子类中（可能后面会被覆盖，可以通过`Object.create`所提供的方式修改实现）

###隐藏属性的扁平复制——仅复制父类原型属性
考虑到属性隐藏，可以使用Object.create的方式来进行属性隐藏，那么代码就变成下面这样了：
```javascript
function Parent(){
    this.parentName = "parent";
}
Parent.prototype.getName = function(){
    return this.parentName;
}
function Child(){
    var tmpFn = function(){};
    var tmpFnIst;
    var item;
    tmpFn.prototype = Parent.prototype;
    tmpFnIst = new tmpFn();
    for(item in tmpFnIst) {
        this[item] = tmpFnIst[item];
    }
    this.childName = "child";
}
var childIst = new Child();
console.log(childIst);
//输出：见下图
```
![扁平复制父类原型属性时的对象](http://lingyu.wang/img/js_inherit/6.png)

可以看到，通过临时构造函数，将父类中不在其`prototype`中的属性进行了隐藏

###隐藏属性的扁平复制——仅复制父类自身属性
```javascript
function Parent(){
    this.parentName = "parent";
}
Parent.prototype.getName = function(){
    return this.parentName;
}
function Child(){
    Parent.apply(this, arguments);
    this.childName = "child";
}
var childIst = new Child();
console.log(childIst);
//输出：见下图
```
![扁平复制父类自身属性的对象](http://lingyu.wang/img/js_inherit/7.png)

这种方式和上面方式刚好相反，仅仅复制父类自身方法，而不复制其原型链上的方法
