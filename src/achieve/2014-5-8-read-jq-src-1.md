---
layout: art
title: jQuery的核心方法和类型判断
subTitle: 闲来没事读源码系列——jQuery
desc: 这几天闭关读源码，jQuery读了一半了，sizzle，基础方法，promise等等都详细的看了一下，由于东西比较多，先记录第一部分，jQuery的一些核心方法以及jQuery中的类型判断，读的是jQuery-2.1.0
tags: [JavaScript]
categories: [源码阅读]
---

##一些方法的缓存
上来先做了一下commonjs的判断和兼容

之后将一些数组上和对象上的常用方法进行了缓存。另外还缓存了一个class2type对象和support对象，class2type对象将在后面的类型判断处详细介绍。而support用来保存嗅探到的浏览器特性是否支持
```javascript
/*缓存一些常用方法和对象*/
var arr = [];
/*切分数组*/
var slice = arr.slice;
/*数组合并*/
var concat = arr.concat;
/*添加到尾部*/
var push = arr.push;
/*查找位置*/
var indexOf = arr.indexOf;
/*判断变量类型*/
var class2type = {};
/*对象的toString方法，用于判断变量类型*/
var toString = class2type.toString;
/*对象的hasOwnProperty，判断属性是否在对象中*/
var hasOwn = class2type.hasOwnProperty;
/*字符串的trime方法*/
var trim = "".trim;
/*方法支持程度*/
var support = {};
```

之后创建了jQuery方法
```javascript
jQuery = function( selector, context ) {
    return new jQuery.fn.init( selector, context );
}
```
可以看到，其使用`new jQuery.fn.init`创建了一个jq对象并返回了，jq对象的详细实现应该在init方法中

当然还有一些像缓存document，版本号，匹配`-ms-`和`-[\da-z]`这样的正则表达式，还有一个将字符串转大写的方法

```javascript
var
    document = window.document,

    version = "2.1.0",

    jQuery = function( selector, context ) {
        // The jQuery object is actually just the init constructor 'enhanced'
        // Need init if jQuery is called (just allow error to be thrown if not included)
        return new jQuery.fn.init( selector, context );
    },

    rmsPrefix = /^-ms-/,
    rdashAlpha = /-([\da-z])/gi,

    fcamelCase = function( all, letter ) {
        return letter.toUpperCase();
    };
```

##在jQuery对象上扩展方法
紧接着是一系列在jq对象上扩展的方法：
可以看到在jq对象上扩展方法实际上就是在jQuery的prototype上扩展方法
这里定义了一系列在jQuery对象中操作元素集合的方法
####constructor
重新将constructor指向jQuery，防止constructor指向Object
```javascript
constructor: jQuery,
```
####selector
每个jQuery对象都与一个selector字符串，可以用它来检测jQuery对象，默认为空字符串
```javascript
selector: "",
```
####length
jQuery对象其实可以看做一个包含了很多dom元素和一系列扩展方法的类数组对象，其中必然会有一个length属性说明一共有多少dom元素，经常用来判断jq对象是否含有结果集
```javascript
length: 0,
```
####toArray
类数组对象转真正数组的方法，内部和我们将arguments或NodeList等于一样，使用slice实现
```javascript
toArray: function() {
    return slice.call( this );
},
```

####get (num)
从jq对象中获取下标为num的元素，如果num为负数，则获取倒数第num个，也就是下表为`length + num`的元素。如果num不存在，将这个jq对象转换成真数组并返回（同样使用的slice方法）
```javascript
get: function( num ) {
    return num != null ?

        // Return a 'clean' array
        ( num < 0 ? this[ num + this.length ] : this[ num ] ) :

        // Return just the object
        slice.call( this );
},
```
####pushStack (elems)
这是一个很重要的方法，后面很多地方会用到

这个方法实际上是创建一个新的jq对象，其结果集为elems中的dom节点，将现有的jq对象放在新创建对象的prevObject中，这样就能在新jq对象中查找到现有的jq对象了，设定一下context后返回新对象的引用

这种链式创建jq对象的方式可以理解为jq对象的一个链表(栈)，而我们永远拥有表头指针，使用end方法时，表头指针所指向的jq对象就会移除出链表。这也是jQuery那样链式操作的关键所在
```javascript
pushStack: function( elems ) {

    /*创建一个新jq对象用来保存结果集*/
    var ret = jQuery.merge( this.constructor(), elems );

    /*将之前的jq对象压栈*/
    ret.prevObject = this;
    /*context相同*/
    ret.context = this.context;

    /*返回新创建的jq对象的引用*/
    return ret;
},
```

####each (callback, args)
这个方法相信使用过jq的人都很熟悉了，对当前jq对象中的每个元素调用callback方法，并可选的为callback传入args参数。内部有一个很强大的兼容各种参数的each方法，后续会有介绍，这里直接使用它了
```javascript
each: function( callback, args ) {
    return jQuery.each( this, callback, args );
},
```

####map (callback)
这个方法和上面类似，不过是map方法，所以会生成一组结果，这一组结果会使用pushStack方法在jq链上创建一个新jq对象来包裹

####slice
其实内部就是直接调用了`[].slice`切分jq对象获得dom节点数组，不同的是，这个获得的dom节点数组会使用pushStack方法在jq链上创建一个新jq对象来包裹
```javascript
map: function( callback ) {
    return this.pushStack( jQuery.map(this, function( elem, i ) {
        return callback.call( elem, i, elem );
    }));
},
```
####first和last
这俩比较简单，获取jq对象的dom节点集中的第一个和最后一个，均使用eq方法实现
```javascript
first: function() {
    return this.eq( 0 );
},

last: function() {
    return this.eq( -1 );
},
```
####eq (i)
获取jq对象dom节点集的第i个元素，需要注意的是处理正数和负数的情况，正数为第i个，负数为倒数第i个，也就是第`length+i`个

这个方法也会将生成的结果用pushStack方法在jq链上创建新的jq对象来包裹
```javascript
eq: function( i ) {
    var len = this.length,
        j = +i + ( i < 0 ? len : 0 );
    return this.pushStack( j >= 0 && j < len ? [ this[j] ] : [] );
},
```
####end
操作jq链，获得之前的jq对象。这里有个判定，如果之前没有对象了，新建一个空的jq对象并返回。把jq链看做一个栈的话，实际上就是弾栈操作
```javascript
end: function() {
    return this.prevObject || this.constructor(null);
},
```
####push、sort、splice
这些方法仅作内部使用，直接使用数组的方法
```javascript
push: push,
sort: arr.sort,
splice: arr.splice
```

##对象扩展方法jQuery.extend
编写jq插件的开发者肯定不会对这个方法陌生

jq使用这个方法实现的混入模式，思想还是将遍历一个对象中的所有值，复制到一个已有的对象中

另外jq这个函数实现了深拷贝，其实也就是递归调用extend方法，这里用了很多的jQuery自己实现的类型判断

深拷贝需要注意数组和原生对象的情况，他们创建的容器是不相同的（`[]`和`{}`）

另外它使用了一个options来进行缓存，防止出现循环引用导致的无限递归情况

```javascript
jQuery.extend = jQuery.fn.extend = function() {
    var options, name, src, copy, copyIsArray, clone,
        target = arguments[0] || {},
        i = 1,
        length = arguments.length,
        deep = false;

    /*做接口的重载*/
    // Handle a deep copy situation
    if ( typeof target === "boolean" ) {
        deep = target;

        // skip the boolean and the target
        target = arguments[ i ] || {};
        i++;
    }

    // Handle case when target is a string or something (possible in deep copy)
    if ( typeof target !== "object" && !jQuery.isFunction(target) ) {
        target = {};
    }

    // extend jQuery itself if only one argument is passed
    if ( i === length ) {
        target = this;
        i--;
    }

    for ( ; i < length; i++ ) {
        // Only deal with non-null/undefined values
        if ( (options = arguments[ i ]) != null ) {
            // Extend the base object
            for ( name in options ) {
                src = target[ name ];
                copy = options[ name ];

                // Prevent never-ending loop
                /*看copy中是否已经存在需要复制的对象，防止死循环*/
                if ( target === copy ) {
                    continue;
                }
                /*如果深拷贝，将递归复制*/
                // Recurse if we're merging plain objects or arrays
                if ( deep && copy && ( jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy)) ) ) {
                    /*数组和对象分开判断，容器不一样*/
                    if ( copyIsArray ) {
                        copyIsArray = false;
                        clone = src && jQuery.isArray(src) ? src : [];

                    } else {
                        clone = src && jQuery.isPlainObject(src) ? src : {};
                    }

                    // Never move original objects, clone them
                    /*递归拷贝*/
                    target[ name ] = jQuery.extend( deep, clone, copy );

                // Don't bring in undefined values
                } else if ( copy !== undefined ) {
                    target[ name ] = copy;
                }
            }
        }
    }

    // Return the modified object
    return target;
};
```

##在jQuery上扩展的一些内部方法和静态方法
有了`jQuery.extend`，我们就可以使用它在jQuery对象上申明一些静态方法或属性了，基本上每个模块都会通过这种方式申明一些内部方法和静态方法

####expando
用于随机生成一个jq的版本号
```javascript
expando: "jQuery" + ( version + Math.random() ).replace( /\D/g, "" ),
```
####isReady
假设jQuery已经准备好了，当然我们有一个$().ready方法，判断dom是否加载完成，这些后面promise那块会说

####error
没啥好说的，甩个异常
```javascript
error: function( msg ) {
    throw new Error( msg );
},
```

####noop
一个空函数，不知道干啥用的
```javascript
noop: function() {},
```

####isFunction (obj)
判断参数是否是函数，使用了jQuery.type进行判断，内部实际上用的是`typeof obj === 'function'`
```javascript
isFunction: function( obj ) {
    return jQuery.type(obj) === "function";
},
```
####isArray (obj)
判断参数是否是数组，由于是2.1.0版本，不兼容ie6-7，所以直接使用了`Array.isArray`
```javascript
isArray: Array.isArray,
```
####isWindow (obj)
判断是否是window对象，这个使用window对象的`window.window === window`进行判断，但司徒正美说这种方式还是有缺陷的
```javascript
isWindow: function( obj ) {
    return obj != null && obj === obj.window;
},
```
####isNumberic (obj)
这个是判断参数能否转换为数字，先通过parseFloat对参数进行转换，然后判断，很巧妙

这里用到了parseFloat返回NaN、任何数与NaN计算都是NaN、NaN和0比返回false
```javascript
isNumeric: function( obj ) {
    // parseFloat NaNs numeric-cast false positives (null|true|false|"")
    // ...but misinterprets leading-number strings, particularly hex literals ("0x...")
    // subtraction forces infinities to NaN
    return obj - parseFloat( obj ) >= 0;
},
```

####isPlainObject (obj)
判断是否是原生对象。如果不是对象，或者是DOM对象，或者是window直接排除。看它原型上是否有isPrototypeOf方法，如果有，则是原生对象，否则不是。需要注意一点的是，在ff20-时查看constructor会报错，所以用了try catch包裹
```javascript
isPlainObject: function( obj ) {
    // Not plain objects:
    // - Any object or value whose internal [[Class]] property is not "[object Object]"
    // - DOM nodes
    // - window
    if ( jQuery.type( obj ) !== "object" || obj.nodeType || jQuery.isWindow( obj ) ) {
        return false;
    }

    // Support: Firefox <20
    // The try/catch suppresses exceptions thrown when attempting to access
    // the "constructor" property of certain host objects, ie. |window.location|
    // https://bugzilla.mozilla.org/show_bug.cgi?id=814622
    try {
        if ( obj.constructor &&
                !hasOwn.call( obj.constructor.prototype, "isPrototypeOf" ) ) {
            return false;
        }
    } catch ( e ) {
        return false;
    }

    // If the function hasn't returned already, we're confident that
    // |obj| is a plain object, created by {} or constructed with new Object
    return true;
},
```

####isEmptyObject (obj)
是否是空对象，判断方法是遍历这个对象，只要有能遍历到的键值对，返回false
```javascript
isEmptyObject: function( obj ) {
    var name;
    for ( name in obj ) {
        return false;
    }
    return true;
},
```

####type (obj)
确定元素类型的方法，这个方法使用了class2type中存储的累心结果进行判断

首先判断`obj==null`，obj如果是undefined和null，都会在这里被拦截，直接转成字符串返回就可以了

然后判断如果obj是对象，那就需要通过class2type来判断了，class2type中汇总了一些常用的对象映射。如果class2type中没有找到，返回object。如果是函数，直接返回函数就行了

后面会有如何创建这个class2type缓存

```javascript
type: function( obj ) {
    if ( obj == null ) {
        return obj + "";
    }
    // Support: Android < 4.0, iOS < 6 (functionish RegExp)
    return typeof obj === "object" || typeof obj === "function" ?
        class2type[ toString.call(obj) ] || "object" :
        typeof obj;
},
```

####globalEval (code)
执行code中的代码，首先通过indexOf查找代码中是否有`use strict`，如果有，那么使用在document中创建script节点的方法执行代码，否则直接用js本身的eval
```javascript
globalEval: function( code ) {
    var script,
        indirect = eval;

    code = jQuery.trim( code );

    if ( code ) {
        // If the code includes a valid, prologue position
        // strict mode pragma, execute code by injecting a
        // script tag into the document.
        if ( code.indexOf("use strict") === 1 ) {
            script = document.createElement("script");
            script.text = code;
            document.head.appendChild( script ).parentNode.removeChild( script );
        } else {
        // Otherwise, avoid the DOM node creation, insertion
        // and removal by using an indirect global eval
            indirect( code );
        }
    }
},
```

####camelCase 
将一个带连字符的字符串转驼峰形式
```javascript
camelCase: function( string ) {
    return string.replace( rmsPrefix, "ms-" ).replace( rdashAlpha, fcamelCase );
},
```
####nodeName
判断一个元素的标签名是否和传入的参数匹配，如果没有传入参数，返回元素的标签名...直接用元素的nodeName属性获得标签名，比较时注意一下全转成小写
```javascript
nodeName: function( elem, name ) {
    return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();
},
```

####each
来了，用于遍历的each方法，其有一个有参数的情况

在遍历时需要判断对象是类数组（注意是类数组）还是对象，类数组的话直接使用for循环，而对象使用for in。剩下就是在有无参数时候的不同调用方法了，有参数使用apply传入相应参数，如果没有使用call，传入下标和具体的值

```javascript
each: function( obj, callback, args ) {
    var value,
        i = 0,
        length = obj.length,
        isArray = isArraylike( obj );
    /*有参数的情况下*/
    if ( args ) {
        /*数组或类数组对象*/
        if ( isArray ) {
            for ( ; i < length; i++ ) {
                value = callback.apply( obj[ i ], args );

                if ( value === false ) {
                    break;
                }
            }
        /*普通对象*/
        } else {
            for ( i in obj ) {
                value = callback.apply( obj[ i ], args );

                if ( value === false ) {
                    break;
                }
            }
        }
    /*无参数的情况下，把当前元素和下标（键）当做参数传递*/
    // A special, fast, case for the most common use of each
    } else {
        if ( isArray ) {
            for ( ; i < length; i++ ) {
                value = callback.call( obj[ i ], i, obj[ i ] );

                if ( value === false ) {
                    break;
                }
            }
        } else {
            for ( i in obj ) {
                value = callback.call( obj[ i ], i, obj[ i ] );

                if ( value === false ) {
                    break;
                }
            }
        }
    }

    return obj;
},
```

####trim
去掉字符串的首尾空白，由于不兼容老版本IE，直接用字符串的trim了，没有用正则
```javascript
trim: function( text ) {
    return text == null ? "" : trim.call( text );
},
```

####makeArray
讲一个类数组转化为数组，如果是数组直接push，如果不是真数组，使用merge，后面会介绍merge方法
```javascript
makeArray: function( arr, results ) {
    var ret = results || [];

    if ( arr != null ) {
        if ( isArraylike( Object(arr) ) ) {
            jQuery.merge( ret,
                typeof arr === "string" ?
                [ arr ] : arr
            );
        } else {
            push.call( ret, arr );
        }
    }

    return ret;
},
```

####inArray 
使用indexOf判断元素是否在数组内部
```javascript
inArray: function( elem, arr, i ) {
    return arr == null ? -1 : indexOf.call( arr, elem, i );
},
```

####merge
通过遍历的方式将两个类数组合并
```javascript
merge: function( first, second ) {
    var len = +second.length,
        j = 0,
        i = first.length;

    for ( ; j < len; j++ ) {
        first[ i++ ] = second[ j ];
    }

    first.length = i;

    return first;
},
```

####grep (elems, callback, invert)
将元素丢到callback中判断是否符合条件，返回所有符合条件的元素。invert为true时，返回所有不符合条件的元素


```javscript
grep: function( elems, callback, invert ) {
    var callbackInverse,
        matches = [],
        i = 0,
        length = elems.length,
        callbackExpect = !invert;

    // Go through the array, only saving the items
    // that pass the validator function
    for ( ; i < length; i++ ) {
        callbackInverse = !callback( elems[ i ], i );
        if ( callbackInverse !== callbackExpect ) {
            matches.push( elems[ i ] );
        }
    }

    return matches;
},
```

####map (elems, callback, arg)
jq自己实现的map操作，由于jq自身是个类数组，于是乎模拟数组实现了一系列操作，map就是其中一个

对数组、类数组、对象进行遍历map操作，结果放在一个数组中并返回
```javascript
map: function( elems, callback, arg ) {
    var value,
        i = 0,
        length = elems.length,
        isArray = isArraylike( elems ),
        ret = [];

    // Go through the array, translating each of the items to their new values
    /*数组或类数组*/
    if ( isArray ) {
        for ( ; i < length; i++ ) {
            value = callback( elems[ i ], i, arg );

            if ( value != null ) {
                ret.push( value );
            }
        }

    // Go through every key on the object,
    /*对象*/
    } else {
        for ( i in elems ) {
            value = callback( elems[ i ], i, arg );

            if ( value != null ) {
                ret.push( value );
            }
        }
    }

    // Flatten any nested arrays
    return concat.apply( [], ret );
},
```

####guid
一个全局的guid，用于生成独立id，每次被使用后自增

####proxy
使用闭包的方式将对象绑定到函数的作用域链顶端，curry化的实现

```javascript
proxy: function( fn, context ) {
    var tmp, args, proxy;

    if ( typeof context === "string" ) {
        tmp = fn[ context ];
        context = fn;
        fn = tmp;
    }

    // Quick check to determine if target is callable, in the spec
    // this throws a TypeError, but we will just return undefined.
    /*必须是函数*/
    if ( !jQuery.isFunction( fn ) ) {
        return undefined;
    }

    // Simulated bind
    /*提取出参数*/
    args = slice.call( arguments, 2 );
    /*创建闭包，这个闭包使用了当前作用域的这些对象*/
    proxy = function() {
        return fn.apply( context || this, args.concat( slice.call( arguments ) ) );
    };

    // Set the guid of unique handler to the same of original handler, so it can be removed
    /*给代理增加一个自增的guid*/
    proxy.guid = fn.guid = fn.guid || jQuery.guid++;
    /*返回代理*/
    return proxy;
},
```

####其他
没啥好说的，看名字就知道了
```javascript
now: Date.now,

support: support
```

##类型判断
####生成class2type
首先是生成class2type，使用了比较巧妙的方法，对一个字符串进行切分，然后使用`jQuery.each`方法来建立class2type

```javascript
jQuery.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function(i, name) {
    class2type[ "[object " + name + "]" ] = name.toLowerCase();
});
```

####判断类数组
判断是否是类数组对象，主要是根据是否含有大于等于0的length属性判断，含有length属性也可能是function，表明参数个数，也可能是window，需要排除

```javascript
function isArraylike( obj ) {
    var length = obj.length,
        type = jQuery.type( obj );

    if ( type === "function" || jQuery.isWindow( obj ) ) {
        return false;
    }

    if ( obj.nodeType === 1 && length ) {
        return true;
    }

    return type === "array" || length === 0 ||
        typeof length === "number" && length > 0 && ( length - 1 ) in obj;
}
```

##总结
这一部分主要是申明了extend方法和一些在jq对象上的核心函数，以及相当多的类型判断相关


