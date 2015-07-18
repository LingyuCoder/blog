layout: art
title: RisingStack的Node.js风格指南
subtitle: A mostly reasonable approach to JavaScript - how we write Node.js at RisingStack
tags: 
- NodeJs
categories: 
- 翻译
date: 2014/11/24
---

本文翻译自[RisingStack/node-style-guide](https://github.com/RisingStack/node-style-guide)

<!-- more -->

## [RisingStack](http://risingstack.com) 的Node.js 风格指南() {

### 文章的大部分内容来自 [Airbnb stlyeguide](https://github.com/airbnb/javascript)



以下风格指南对此指南有很大影响:
- @caolan's [Node.js stlyeguide](http://caolanmcmahon.com/posts/nodejs_style_and_structure)
- @felixge's [Node.js stlyeguide](https://github.com/felixge/node-style-guide)

## 类型

  - **原生类型**: 当访问一个原生类型时直接对其值进行操作

    + `string`
    + `number`
    + `boolean`
    + `null`
    + `undefined`

    ```javascript
    var foo = 1;
    var bar = foo;

    bar = 9;

    console.log(foo, bar); // => 1, 9
    ```
  - **复杂类型**: 当访问一个复杂类型时，将对其值的引用上进行操作

    + `object`
    + `array`
    + `function`

    ```javascript
    var foo = [1, 2];
    var bar = foo;

    bar[0] = 9;

    console.log(foo[0], bar[0]); // => 9, 9
    ```

## 对象

  - 使用字面量创建对象。

    ```javascript
    // 不推荐
    var item = new Object();

    // 推荐
    var item = {};
    ```

  - 用可读的同义单词来代替JavaScript的保留字

    ```javascript
    // 不推荐，class是保留字
    var superman = {
      class: 'alien'
    };

    // 不推荐，klass不具备可读性
    var superman = {
      klass: 'alien'
    };

    // 推荐
    var superman = {
      type: 'alien'
    };
    ```


## 数组

  - 使用字面量创建数组

    ```javascript
    // 不推荐
    var items = new Array();

    // 推荐
    var items = [];
    ```

  - 如果不知道数组的长度，使用Array#push方法

    ```javascript
    var someStack = [];


    // 不推荐
    someStack[someStack.length] = 'abracadabra';

    // 推荐
    someStack.push('abracadabra');
    ```

  - 使用Array#slice来拷贝数组，这样性能较好，详见[jsPerf](http://jsperf.com/converting-arguments-to-an-array/7)

    ```javascript
    var len = items.length;
    var itemsCopy = [];
    var i;

    // 不推荐，遍历性能较低
    for (i = 0; i < len; i++) {
      itemsCopy[i] = items[i];
    }

    // 推荐
    itemsCopy = items.slice();
    ```

  - 将类数组对象转变为数组时，使用Array#slice方法

    ```javascript
    function trigger() {
      var args = Array.prototype.slice.call(arguments);
      ...
    }
    ```

## Strings

  - 对字符串使用单引号`''`包裹

    ```javascript
    // 不推荐
    var name = "Bob Parr";

    // 推荐
    var name = 'Bob Parr';

    // 不推荐
    var fullName = "Bob " + this.lastName;

    // 推荐
    var fullName = 'Bob ' + this.lastName;
    ```

  - 字符串长度超过80个字符时，应当将字符串写成多行并通过加号进行拼接
  - 注意：如果过度使用长字符串拼接方式将影响性能，详见[jsPerf](http://jsperf.com/ya-string-concat) & [Discussion](https://github.com/airbnb/javascript/issues/40)

    ```javascript
    // 不推荐
    var errorMessage = 'This is a super long error that was thrown because of Batman. When you stop to think about how Batman had anything to do with this, you would get nowhere fast.';

    // 不推荐
    var errorMessage = 'This is a super long error that was thrown because \
    of Batman. When you stop to think about how Batman had anything to do \
    with this, you would get nowhere \
    fast.';

    // 推荐
    var errorMessage = 'This is a super long error that was thrown because ' +
      'of Batman. When you stop to think about how Batman had anything to do ' +
      'with this, you would get nowhere fast.';
    ```

  - 当以编码的方式构建一个字符串时，使用Array#join方法，而不要拼接字符串

    ```javascript
    var items;
    var messages;
    var length;
    var i;

    messages = [{
      state: 'success',
      message: 'This one worked.'
    }, {
      state: 'success',
      message: 'This one worked as well.'
    }, {
      state: 'error',
      message: 'This one did not work.'
    }];

    length = messages.length;

    // 不推荐
    function inbox(messages) {
      items = '<ul>';

      for (i = 0; i < length; i++) {
        items += '<li>' + messages[i].message + '</li>';
      }

      return items + '</ul>';
    }

    // 推荐
    function inbox(messages) {
      items = [];

      for (i = 0; i < length; i++) {
        items[i] = messages[i].message;
      }

      return '<ul><li>' + items.join('</li><li>') + '</li></ul>';
    }
    ```

## 函数

  - 函数表达式:

    ```javascript
    // 匿名函数表达式
    var anonymous = function() {
      return true;
    };

    // 命名函数表达式
    var named = function named() {
      return true;
    };

    // 立即执行函数 (immediately-invoked function expression, IIFE)
    (function() {
      console.log('Welcome to the Internet. Please follow me.');
    })();
    ```

  - 不要在非函数块（if、while等代码块）中声明函数，这种情况下应当将函数赋值给变量

    ```javascript
    // 不推荐
    if (currentUser) {
      function test() {
        console.log('Nope.');
      }
    }

    // 推荐
    var test;
    if (currentUser) {
      test = function test() {
        console.log('Yup.');
      };
    }
    ```

  - 不要声明`arguments`变量，这样将覆盖函数作用域的`arguments`对象（夺取了优先权，导致无法访问函数作用域的`arguments`）

    ```javascript
    // 不推荐
    function nope(name, options, arguments) {
      // ...stuff...
    }

    // 推荐
    function yup(name, options, args) {
      // ...stuff...
    }
    ```

## 属性

  - 使用符号`.`来访问属性

    ```javascript
    var luke = {
      jedi: true,
      age: 28
    };

    // 不推荐
    var isJedi = luke['jedi'];

    // 推荐
    var isJedi = luke.jedi;
    ```

  - 在需要通过变量访问属性时使用中括号`[]`

    ```javascript
    var luke = {
      jedi: true,
      age: 28
    };

    function getProp(prop) {
      return luke[prop];
    }

    var isJedi = getProp('jedi');
    ```

## 变量

  - 使用`var`来声明变量，这样能避免意外声明全局变量、污染全局命名空间。

    ```javascript
    // 不推荐
    superPower = new SuperPower();

    // 推荐
    var superPower = new SuperPower();
    ```

  - 每个变量声明新启一行，并在每个声明前面加上`var`

    ```javascript
    // 不推荐
     var items = getItems(),
          goSportsTeam = true,
          dragonball = 'z';

    // 推荐
     var items = getItems();
     var goSportsTeam = true;
     var dragonball = 'z';
    ```

  - 先声明需要赋值的变量，后声明不需要赋值的变量。这样后声明的变量能够依靠前面生成变量来生成自己的值。

    ```javascript
    // 不推荐
    var i;
    var items = getItems(),
    var dragonball,
    var goSportsTeam = true,
    var len;

    // 推荐
    var items = getItems(),
    var goSportsTeam = true,
    var dragonball,
    var length,
    var i;
    ```

  - 在作用域的顶部声明所有变量，这样有助于避免变量提升导致的相关问题

    ```javascript
    // 不推荐
    function() {
      test();
      console.log('doing stuff..');

      //..other stuff..

      var name = getName();

      if (name === 'test') {
        return false;
      }

      return name;
    }

    // 推荐
    function() {
      var name = getName();

      test();
      console.log('doing stuff..');

      //..other stuff..

      if (name === 'test') {
        return false;
      }

      return name;
    }

    // 不推荐
    function() {
      var name = getName();

      if (!arguments.length) {
        return false;
      }

      return true;
    }

    // 推荐
    function() {
      if (!arguments.length) {
        return false;
      }

      var name = getName();

      return true;
    }
    ```

## 模块引用

  - 按照如下顺序引用模块
      - 核心模块
      - npm上的工具模块
      - 其他模块
      
    ```javascript
    // 不推荐
    var Car = require('./models/Car');
    var async = require('async');
    var http = require('http');

    // 推荐
    var http = require('http');
    var fs = require('fs');

    var async = require('async');
    var mongoose = require('mongoose');

    var Car = require('./models/Car');
    ```

  - 在模块引用时不要加上`.js`

  ```javascript
    // 不推荐
    var Batmobil = require('./models/Car.js');

    // 推荐
    var Batmobil = require('./models/Car');

  ```


## 回调函数

  - 总是在回调函数中检查是否出现错误

  ```javascript
  //不推荐
  database.get('pokemons', function (err, pokemons) {
    console.log(pokemons);
  });

  //推荐
  database.get('drabonballs', function (err, drabonballs) {
    if (err) {
      // 通过某种方式处理错误，或者通过一个回调函数返回
      return console.log(err);
    }
    console.log(drabonballs);
  });
  ```

  - 回调函数也需要返回
  ```javascript
  //不推荐
  database.get('drabonballs', function (err, drabonballs) {
    if (err) {
      // 如果不在这里返回
      console.log(err);
    }
    // 这一样依旧会执行
    console.log(drabonballs);
  });

  //推荐
  database.get('drabonballs', function (err, drabonballs) {
    if (err) {
      // 通过某种方式处理错误，或者通过一个回调函数返回
      return console.log(err);
    }
    console.log(drabonballs);
  });
  ```

## 异常捕获（Try-catch）

- 只在同步函数中使用Try-catch
  
  Try-catch代码块不能用来包裹异步的代码。Try-catch代码块将冒泡到最顶层，并记录整个冒泡的路径。

  ```javascript
  //不推荐
  function readPackageJson (callback) {
    fs.readFile('package.json', function (err, file) {
      if (err) {
        throw err;
      }
      ...
    });
  }
  //推荐
  function readPackageJson (callback) {
    fs.readFile('package.json', function (err, file) {
      if (err) {
        return  callback(err);
      }
      ...
    });
  }
  ```

- 在同步调用中使用Try-catch捕获异常

  ```javascript
  //不推荐
  var data = JSON.parse(jsonAsAString);

  //推荐
  var data;
  try {
    data = JSON.parse(jsonAsAString);
  } catch (e) {
    // 处理错误 —— 最好不只是用console.log输出
    console.log(e);
  }
  ```

## 提升

  - 变量声明会提升到作用域顶端，但对这些变量的赋值是不会提升的

    ```javascript
    // 如我们所知，这不起作用 （没有同名的全局变量情况下）
    function example() {
      console.log(notDefined); // => 抛出一个引用错误
    }
    
    // 在引用一个变量之后创建一个变量声明一样能够正常工作
    // 这是由于变量会提升。注意：这里赋值`true`并没有被提升
    function example() {
      console.log(declaredButNotAssigned); // => undefined
      var declaredButNotAssigned = true;
    }

    // 解释器会将变量声明提升到作用域的顶部
    // 这也就意味着上例可以写成如下方式
    function example() {
      var declaredButNotAssigned;
      console.log(declaredButNotAssigned); // => undefined
      declaredButNotAssigned = true;
    }
    ```

  - 匿名函数表达式只会提升变量定义，函数赋值语句不会提升

    ```javascript
    function example() {
      console.log(anonymous); // => undefined

      anonymous(); // => TypeError anonymous 不是函数

      var anonymous = function() {
        console.log('anonymous function expression');
      };
    }
    ```

  - 命名函数表达式同样提升变量定义，而不会提升函数名称和函数体
  - Named function expressions hoist the variable name, not the function name or the function body.

    ```javascript
    function example() {
      console.log(named); // => undefined

      named(); // => TypeError named 不是一个函数

      superPower(); // => ReferenceError superPower 未定义

      var named = function superPower() {
        console.log('Flying');
      };
    }
    
    // 就算函数名称和变量名称相同，也是一样的
    function example() {
      console.log(named); // => undefined

      named(); // => TypeError named 不是一个函数

      var named = function named() {
        console.log('named');
      }
    }
    ```

  - 函数声明会提升名称和函数体

    ```javascript
    function example() {
      superPower(); // => Flying

      function superPower() {
        console.log('Flying');
      }
    }
    ```

  - 更多信息可以查看 [JavaScript Scoping & Hoisting](http://www.adequatelygood.com/2010/2/JavaScript-Scoping-and-Hoisting) ，作者为 [Ben Cherry](http://www.adequatelygood.com/)


## 条件表达式和相等判断

  - 使用 `===` 和 `!==` ，不要用 `==` 和 `!=`
  - 条件表达式计算时会强迫使用`ToBoolean`方法，并遵循如下规则：
  
    + **Objects** 判定为 **true**
    + **Undefined** 判定为 **false**
    + **Null** 判定为 **false**
    + **Booleans** 判定为 **the value of the boolean**
    + **Numbers** 如果为 **+0, -0, or NaN** 判定为 **false**，否则为 **true**
    + **Strings** 如果为 空字符串 `''` 判定为 **false** 否则为 **true**

    ```javascript
    if ([0]) {
      // true
      // 数组也是对象，对象都判定为true
    }
    ```

  - 善于简写

    ```javascript
    // 不推荐
    if (name !== '') {
      // ...stuff...
    }

    // 推荐
    if (name) {
      // ...stuff...
    }

    // 不推荐
    if (collection.length > 0) {
      // ...stuff...
    }

    // 推荐
    if (collection.length) {
      // ...stuff...
    }
    ```

  - 更多信息请查看Angus Croll所著的 [Truth Equality and JavaScript](http://javascriptweblog.wordpress.com/2011/02/07/truth-equality-and-javascript/#more-2108) 


## 代码块

  - 在所有多行代码块时都是用大括号
  - Use braces with all multi-line blocks.

    ```javascript
    // 不推荐
    if (test)
      return false;

    // 不推荐
    if (test) return false;

    // 推荐
    if (test) {
      return false;
    }

    // 不推荐
    function() { return false; }

    // 推荐
    function() {
      return false;
    }
    ```

## 注释

  - 使用`/**....*/`包裹多行注释，这种注释包括描述、参数及返回值的类型和值

    ```javascript
    // 不推荐
    // make() returns a new element
    // based on the passed in tag name
    //
    // @param <String> tag
    // @return <Element> element
    function make(tag) {

      // ...stuff...

      return element;
    }

    // 推荐
    /**
     * make() returns a new element
     * based on the passed in tag name
     *
     * @param <String> tag
     * @return <Element> element
     */
    function make(tag) {

      // ...stuff...

      return element;
    }
    ```

  - 单行注释时使用`//`。每一个单行注释在需要注释的位置上面新启一行。并在注释前加一个空行

    ```javascript
    // 不推荐
    var active = true;  // is current tab

    // 推荐
    // is current tab
    var active = true;

    // 不推荐
    function getType() {
      console.log('fetching type...');
      // 设定默认值为'no type'
      var type = this._type || 'no type';

      return type;
    }

    // 推荐
    function getType() {
      console.log('fetching type...');

      // 设定默认值为'no type'
      var type = this._type || 'no type';

      return type;
    }
    ```

  - 在注释前增加`FIXME`或`TODO`来帮助其他开发者快速理解这里出现了一个问题或是需要提供实现。这种注释和常规的注释不同，它是可操作的。这些操作为`FIXME -- 需要弄清楚`或是`TODO -- 需要添加实现`

  - 使用 `// FIXME:` 来标注问题

    ```javascript
    function Calculator() {

      // FIXME: 这里不应该有全局变量
      total = 0;

      return this;
    }
    ```

  - 使用 `// TODO:` 来标注问题的解法

    ```javascript
    function Calculator() {

      // TODO: total应该通过参数来配置
      this.total = 0;

      return this;
    }
  ```

## 空格

  - 将TAB设置成两个空格

    ```javascript
    // 不推荐
    function() {
    ∙∙∙∙var name;
    }

    // 不推荐
    function() {
    ∙var name;
    }

    // 推荐
    function() {
    ∙∙var name;
    }
    ```

  - 在大括号前加个空格

    ```javascript
    // 不推荐
    function test(){
      console.log('test');
    }

    // 推荐
    function test() {
      console.log('test');
    }

    // 不推荐
    dog.set('attr',{
      age: '1 year',
      breed: 'Bernese Mountain Dog'
    });

    // 推荐
    dog.set('attr', {
      age: '1 year',
      breed: 'Bernese Mountain Dog'
    });
    ```

  - 在操作符旁边加上空格

    ```javascript
    // 不推荐
    var x=y+5;

    // 推荐
    var x = y + 5;
    ```

  - 以一个换行符结束文件

    ```javascript
    // 不推荐
    (function(global) {
      // ...stuff...
    })(this);
    ```

    ```javascript
    // 不推荐
    (function(global) {
      // ...stuff...
    })(this);↵
    ↵
    ```

    ```javascript
    // 推荐
    (function(global) {
      // ...stuff...
    })(this);↵
    ```

  - 
  - 为长的链式方法调用增加缩进

    ```javascript
    // 不推荐
    $('#items').find('.selected').highlight().end().find('.open').updateCount();

    // 推荐
    $('#items')
      .find('.selected')
        .highlight()
        .end()
      .find('.open')
        .updateCount();

    // 不推荐
    var leds = stage.selectAll('.led').data(data).enter().append('svg:svg').class('led', true)
        .attr('width',  (radius + margin) * 2).append('svg:g')
        .attr('transform', 'translate(' + (radius + margin) + ',' + (radius + margin) + ')')
        .call(tron.led);

    // 推荐
    var leds = stage.selectAll('.led')
        .data(data)
      .enter().append('svg:svg')
        .class('led', true)
        .attr('width',  (radius + margin) * 2)
      .append('svg:g')
        .attr('transform', 'translate(' + (radius + margin) + ',' + (radius + margin) + ')')
        .call(tron.led);
    ```

## 逗号

  - 以逗号启始: **不**

    ```javascript
    // 不推荐
    var hero = {
        firstName: 'Bob'
      , lastName: 'Parr'
      , heroName: 'Mr. Incredible'
      , superPower: 'strength'
    };

    // 推荐
    var hero = {
      firstName: 'Bob',
      lastName: 'Parr',
      heroName: 'Mr. Incredible',
      superPower: 'strength'
    };
    ```

  - 在结尾加上逗号：*不*。这将在IE6/7和IE9的怪异模式中引发一些问题。而且，如果在数组中这么做，在一些ES3的实现中会增加数组的长度。这在ES5中做了修正([source](http://es5.github.io/#D))：

  > Edition 5 clarifies the fact that a trailing comma at the end of an ArrayInitialiser does not add to the length of the array. This is not a semantic change from Edition 3 but some implementations may have previously misinterpreted this.

    ```javascript
    // 不推荐
    var hero = {
      firstName: 'Kevin',
      lastName: 'Flynn',
    };

    var heroes = [
      'Batman',
      'Superman',
    ];

    // 推荐
    var hero = {
      firstName: 'Kevin',
      lastName: 'Flynn'
    };

    var heroes = [
      'Batman',
      'Superman'
    ];
    ```


## 分号

  - 永远使用分号

    ```javascript
    // 不推荐
    (function() {
      var name = 'Skywalker'
      return name
    })()

    // 推荐
    (function() {
      var name = 'Skywalker';
      return name;
    })();

    // 推荐
    ;(function() {
      var name = 'Skywalker';
      return name;
    })();
    ```


## 类型转换和强制类型转换

  - 在声明开头进行强制类型转换
  - 字符串:

    ```javascript
    //  => this.reviewScore = 9;

    // 不推荐
    var totalScore = this.reviewScore + '';

    // 推荐
    var totalScore = '' + this.reviewScore;

    // 不推荐
    var totalScore = '' + this.reviewScore + ' total score';

    // 推荐
    var totalScore = this.reviewScore + ' total score';
    ```

  - 使用 `parseInt` 转换成数字并总是加上进制数

    ```javascript
    var inputValue = '4';

    // 不推荐
    var val = new Number(inputValue);

    // 不推荐
    var val = +inputValue;

    // 不推荐
    var val = inputValue >> 0;

    // 不推荐
    var val = parseInt(inputValue);

    // 推荐
    var val = Number(inputValue);

    // 推荐
    var val = parseInt(inputValue, 10);
    ```

  - 如果你出于某种原因做一些非常规的需求且`parseInt`是你性能的瓶颈，必须用位操作[提升性能](http://jsperf.com/coercion-vs-casting/3)时，添加注释来解释为什么这么做、到底做了什么。

    ```javascript
    // 推荐
    /**
     * parseInt是性能不佳的原因
     * 位操作强制将一个String转换为Number要快得多
     */
    var val = inputValue >> 0;
    ```

  - **注意:** 使用位操作时需要注意。所有的数字都是[64位浮点型](http://es5.github.io/#x4.3.19)，但位操作经常返回32位整型（[请看](http://es5.github.io/#x11.7)）。位操作会在值大于32位时发生一些问题。[这里有一些关于此的讨论](https://github.com/airbnb/javascript/issues/109)。最大的有符号整型是 2,147,483,647

    ```javascript
    2147483647 >> 0 //=> 2147483647
    2147483648 >> 0 //=> -2147483648
    2147483649 >> 0 //=> -2147483647
    ```

  - 布尔类型:

    ```javascript
    var age = 0;

    // 不推荐
    var hasAge = new Boolean(age);

    // 推荐
    var hasAge = Boolean(age);

    // 推荐
    var hasAge = !!age;
    ```

## 命名约定

  - 避免单字母的命名。命名应该能够自解释

    ```javascript
    // 不推荐
    function q() {
      // ...stuff...
    }

    // 推荐
    function query() {
      // ..stuff..
    }
    ```

  - 在命名对象、函数和实例的时候使用驼峰命名法

    ```javascript
    // 不推荐
    var OBJEcttsssss = {};
    var this_is_my_object = {};
    function c() {}
    var u = new user({
      name: 'Bob Parr'
    });

    // 推荐
    var thisIsMyObject = {};
    function thisIsMyFunction() {}
    var user = new User({
      name: 'Bob Parr'
    });
    ```

  - 在命名构造函数和类时使用帕斯卡构造法

    ```javascript
    // 不推荐
    function user(options) {
      this.name = options.name;
    }

    var bad = new user({
      name: 'nope'
    });

    // 推荐
    function User(options) {
      this.name = options.name;
    }

    var good = new User({
      name: 'yup'
    });
    ```

  - 命名私有属性时添加`_`前缀

    ```javascript
    // 不推荐
    this.__firstName__ = 'Panda';
    this.firstName_ = 'Panda';

    // 推荐
    this._firstName = 'Panda';
    ```

  - 当需要保存一个`this`的引用时，使用`_this`

    ```javascript
    // 不推荐
    function() {
      var self = this;
      return function() {
        console.log(self);
      };
    }

    // 不推荐
    function() {
      var that = this;
      return function() {
        console.log(that);
      };
    }

    // 推荐
    function() {
      var _this = this;
      return function() {
        console.log(_this);
      };
    }
    ```

  - 总是为函数命名，这样有助于栈的追踪

    ```javascript
    // 不推荐
    var log = function(msg) {
      console.log(msg);
    };

    // 推荐
    var log = function log(msg) {
      console.log(msg);
    };
    ```

## 访问器

  - 一般不需要属性的访问器函数
  - 如果要创造属性的访问器函数，使用 getVal() 和 setVal('hello')

    ```javascript
    // 不推荐
    dragon.age();

    // 推荐
    dragon.getAge();

    // 不推荐
    dragon.age(25);

    // 推荐
    dragon.setAge(25);
    ```

  - 如果属性时布尔类型，使用 isVal() 或 hasVal()

    ```javascript
    // 不推荐
    if (!dragon.age()) {
      return false;
    }

    // 推荐
    if (!dragon.hasAge()) {
      return false;
    }
    ```

  - 可以创建 get() 和 set() 方法，但必须一致
  - It's okay to create get() and set() functions, but be consistent.

    ```javascript
    function Jedi(options) {
      options || (options = {});
      var lightsaber = options.lightsaber || 'blue';
      this.set('lightsaber', lightsaber);
    }

    Jedi.prototype.set = function(key, val) {
      this[key] = val;
    };

    Jedi.prototype.get = function(key) {
      return this[key];
    };
    ```

## 构造函数

  - 给构造函数的prototype对象增加新方法，不要直接给prototype重写一个新的对象。重写prototype对象会导致无法继承：重写prototype将覆盖掉基类。

    ```javascript
    function Jedi() {
      console.log('new jedi');
    }

    // 不推荐
    Jedi.prototype = {
      fight: function fight() {
        console.log('fighting');
      },

      block: function block() {
        console.log('blocking');
      }
    };

    // 推荐
    Jedi.prototype.fight = function fight() {
      console.log('fighting');
    };

    Jedi.prototype.block = function block() {
      console.log('blocking');
    };
    ```

  - 可以为方法返回`this`方便链式调用

    ```javascript
    // 不推荐
    Jedi.prototype.jump = function() {
      this.jumping = true;
      return true;
    };

    Jedi.prototype.setHeight = function(height) {
      this.height = height;
    };

    var luke = new Jedi();
    luke.jump(); // => true
    luke.setHeight(20) // => undefined

    // 推荐
    Jedi.prototype.jump = function() {
      this.jumping = true;
      return this;
    };

    Jedi.prototype.setHeight = function(height) {
      this.height = height;
      return this;
    };

    var luke = new Jedi();

    luke.jump()
      .setHeight(20);
    ```


  - 可以重写toString()方法，只要它能正常工作且不会有副作用就行

    ```javascript
    function Jedi(options) {
      options || (options = {});
      this.name = options.name || 'no name';
    }

    Jedi.prototype.getName = function getName() {
      return this.name;
    };

    Jedi.prototype.toString = function toString() {
      return 'Jedi - ' + this.getName();
    };
    ```

**推荐的书籍**

  - [JavaScript语言精粹](http://www.amazon.com/JavaScript-Good-Parts-Douglas-Crockford/dp/0596517742) - Douglas Crockford
  - [JavaScript模式](http://www.amazon.com/JavaScript-Patterns-Stoyan-Stefanov/dp/0596806752) - Stoyan Stefanov
  - [JavaScript设计模式](http://www.amazon.com/JavaScript-Design-Patterns-Recipes-Problem-Solution/dp/159059908X)  - Ross Harmes and Dustin Diaz
  - [高性能网站建设指南](http://www.amazon.com/High-Performance-Web-Sites-Essential/dp/0596529309) - Steve Souders
  - [编写可维护的JavaScript](http://www.amazon.com/Maintainable-JavaScript-Nicholas-C-Zakas/dp/1449327680) - Nicholas C. Zakas
  - [JavaScript Web 富应用开发](http://www.amazon.com/JavaScript-Web-Applications-Alex-MacCaw/dp/144930351X) - Alex MacCaw
  - [Pro JavaScript Techniques](http://www.amazon.com/Pro-JavaScript-Techniques-John-Resig/dp/1590597273) - John Resig
  - [Smashing Node.js: JavaScript Everywhere](http://www.amazon.com/Smashing-Node-js-JavaScript-Everywhere-Magazine/dp/1119962595) - Guillermo Rauch
  - [Secrets of the JavaScript Ninja](http://www.amazon.com/Secrets-JavaScript-Ninja-John-Resig/dp/193398869X) - John Resig and Bear Bibeault
  - [Human JavaScript](http://humanjavascript.com/) - Henrik Joreteg
  - [Superhero.js](http://superherojs.com/) - Kim Joar Bekkelund, Mads Mobæk, & Olav Bjorkoy
  - [JSBooks](http://jsbooks.revolunet.com/)
  - [Third Party JavaScript](http://manning.com/vinegar/) - Ben Vinegar and Anton Kovalyov

**推荐的博客**

  - [DailyJS](http://dailyjs.com/)
  - [JavaScript Weekly](http://javascriptweekly.com/)
  - [JavaScript, JavaScript...](http://javascriptweblog.wordpress.com/)
  - [Bocoup Weblog](http://weblog.bocoup.com/)
  - [Adequately Good](http://www.adequatelygood.com/)
  - [NCZOnline](http://www.nczonline.net/)
  - [Perfection Kills](http://perfectionkills.com/)
  - [Ben Alman](http://benalman.com/)
  - [Dmitry Baranovskiy](http://dmitry.baranovskiy.com/)
  - [Dustin Diaz](http://dustindiaz.com/)
  - [nettuts](http://net.tutsplus.com/?s=javascript)

## JavaScript风格指南

  - [查看](https://github.com/airbnb/javascript/wiki/The-JavaScript-Style-Guide-Guide)

## 项目贡献者

  - [查看贡献者](https://github.com/airbnb/javascript/graphs/contributors)


## License
MIT

# };