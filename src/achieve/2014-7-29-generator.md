---
layout: art
title: 细说Generator
subTitle: 剖析Generator的本质
desc: 好久没写东西了，今天看了下ES6的Generator的相关知识，在这里记录一下。主要内容翻译自规范，并加入了自己的理解和总结
categories: [前端技术]
tags: [JavaScript, ES6, Generator, NodeJs]
---
{% raw %}

文章中有很多关于运行时上下文（Execution Context，以下简称EC）的操作，关于EC，作用域链的基础知识请移步[JavaScript一些基础知识简介](http://lingyu.wang/#/art/blog/2014/03/28/js-basis)

Generator函数
===
generator函数执行的时候，会进行如下动作：

1. 创建一个VO，与当前EC（Execution Context，以下简称EC）的作用域链组成新的作用域链
2. 创建一个generator对象，其有如下值：
    * Scope：新建的作用域链
    * Code：generator function内部的代码
    * ExecutionContext：EC，目前值为null
    * State："newborn"
    * Handler：默认的generator的处理器

这里可以看到，Generator函数的执行，函数体内部的代码是不会动的，而是创建一个generator对象，将代码存入其中，并给予相关的上下文

yield的行为
===
当执行到`yield e`时：

1. 计算出表达式e的值
2. 获取当前的EC，并从中获取currentGenerator，也就是yield所在的generator对象
3. 使这个generator对象的ExecutionContext指向当前EC，并将其state修改为suspended
4. 从EC栈弹出当前的EC
5. 返回(normal, 1中的结果值, null)

可以看到，yield本身会先获得表达式的值后，将EC从栈顶弹出，交予generator对象。最后会返回一个结构，其含有三个属性，分别为运行结果、计算的结果值和null，Resume在检测到这个结构后，将停止代码的运行

这里yield之后将会返回到当前函数之外，作用域将发生改变，EC栈中的栈顶也会随之改变。而我们在generator function的函数体内部的这个EC，在下一次回来继续执行时依旧需要使用，所以这里就要交给generator对象代为管理一下，等下次回来，将重新压入EC栈的栈顶

return行为
===
当执行到`return e`时：

1. 计算出表达式e的值
2. 获取当前EC，并从中获取currentGenerator，也就是return所在的generator对象
3. 将这个generator对象的状态修改为closed
4. 创建一个class为StopIteration的新对象，并使其value属性为1中计算的结果值
5. throw这个对象

return也是一样，它同样需要先计算出表达式的值。但之后它获得了generator对象并不是为了做EC栈的维护，而是为了修改generator对象的状态

Generator对象的私有属性
===

* prototype：Object.prototype
* code：generator函数的函数体
* ExecutionContext：内部代码运行使用的EC
* Scope：作用域链
* Handler：标准的generator句柄
* State：newborn、executing、suspended、closed
* Send：看内部方法部分
* Throw：看内部方法部分
* Close：看内部方法部分

外部接口
===
next
---

1. 如果this指向的不是generator对象，抛异常
2. 调用this.send，传入一个undefined
3. 返回结果

调用私有send方法

send
---
send方法允许指定一个值，作为上一次yield的返回值

1. 如果this指向的不是generator对象，抛异常
2. 调用this.send，传入当前第一个参数
3. 返回结果

同样是调用私有send方法，不过传入了参数

throw
---

1. 如果this指向的不是generator对象，抛异常
2. 调用this.throw，传入当前第一个参数
3. 返回结果

close
---
调用close方法可以直接以当前的value作为Generator的返回值

1. 如果this指向的不是generator对象，抛异常
2. 调用this.close，不传入任何参数
3. 返回结果

iterate
---
由于每个generator对象都是一个iterator对象，直接`return this`就可以了

小结
---
接口都是内部方法的一层封装，可以看到next和send实际上都是send内部方法的包装


状态定义
===

* newborn：Code不为null，EC为null
* executing：Code为null，EC不为null，且generator对象的EC为当前EC
* suspended：Code为null，EC不为null，且generator对象的EC不为当前EC
* closed：Code为null，EC为null

调用了generator function后，生成的generator对象状态即为newborn。也就表明当前generator对象刚刚新建，还没有运行里面的任何代码。同时可以看到EC为null，说明内部运行时的EC并不存在

调用了send方法后，状态会修改为executing，send方法会使用Resume去执行代码，直到遇到yield或者return。遇到yield后，代码停止继续执行，状态修改为suspended，等待下次send。遇到return后，状态将被修改为closed，说明执行完毕。

当然也可以通过close方法，手动修改状态为closed


内部方法
===
send方法
---

1. 判断generator对象的state，如果是executing或者closed，就报错。已经在运行了不能重复运行，已经关闭的自然不能运行
2. 如果state为newborn
    1. 将判断传入的参数是否为undefined（外部接口next传入undefined，send则传入给的参数）。这里如果不是undefined，就报错。也就是说刚创建的generator对象不能调用**含有参数的send**外部接口。
    2. 创建一个新的EC，这个新的EC的currentGenerator执行这个generator对象，其作用域链为这个generator对象的作用域链
    3. 将这个EC压入EC栈中
    4. 执行generator中的代码，并返回或得到的结果
3. 能到这，说明state只能是suspended。将state修改为executing，通过Resume(generator的ExecutionContext, normal, 传入的参数)获取结果并返回

generator对象的next和send方法的真正实现，其只处理newborn和suspended状态

在newborn状态下，这个generator内部的代码还没有被执行，其内部代码执行时的EC也没有被创建。所以需要创建一个EC并压入EC栈中

而state为suspended就没有这个EC初始化的过程了，内部代码执行时的EC已经在generator的ExecutionContext上了，所以只要修改状态为executing，然后使用Resume执行代码就好

throw
---

1. 获取generator对象的state，如果为executing或者closed，无法抛异常，报错
2. 如果state为newborn，那么state修改为closed，code修改为null，返回一个包含传入参数的异常
3. 到这里说明state为suspended，修改state为executing，然后通过Resume(generator.ExectionContext, throw, 传入的参数)获得结果，并返回

这里如果是suspended，那么需要通过Resume，且completionType为throw来进行抛错

close
---

1. 获取generator对象的state，如果state为executing，那说明代码正在运行，为了防止出现错误，禁止close。
2. 如果state已经是closed了，那直接return就好
3. 如果state为newborn，state修改为closed，code修改为null，然后返回(normal, undefined, null)
4. 如果state为suspended，将其修改为executing，通过Resume(generator.ExecutionContext, return, undefined)获得结果，然后修改状态为closed，返回Resume获得的结果

调用close方法可以直接以当前的value作为Generator的返回值，当为newborn时，还没有value，自然是undeinfed。而如果是suspended，就有value了，那么就需要通过Resume，且completionType为return来立即返回

Resume(EC, completionType, V)
---

1. 将这个传入的EC（generator的ExecutionContext）压入到EC栈中
2. 从EC通过currentGenerator获取单签generator对象
3. 设置当前作用域链为当前generator对象的作用域链
4. 继续执行代码，并根据completionType做相应的处理


NodeJs上的不同
===
目前，NodeJs的generator对象上还没有close方法和send方法，但NodeJs中如果next方法传入了参数，行为将和send一样

##资料
[harmony generators ES Wiki](http://wiki.ecmascript.org/doku.php?id=harmony:generators)

{% endraw %}