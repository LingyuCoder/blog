layout: art
title: jQuery的异步控制
subtitle: 闲来没事读源码系列——jQuery
tags:
- JavaScript
categories:
- JS技术
date: 2014/5/17
---

jQuery中使用Deferred进行异步控制，其亦提供promise方法获取Promise对象，但实现上和其他的Promise的实现并不相同。Deferred/Promise对象的核心实现为三个回调函数队列，分别保存正确（done）、错误（fail）、进行中（progress）三个回调函数列表，它们都是`jQuery.Callbacks`实例

<!-- more -->

##简介
jQuery中使用Deferred进行异步控制，其亦提供promise方法获取Promise对象，但实现上和其他的Promise的实现并不相同。Deferred/Promise对象的核心实现为三个回调函数队列，分别保存正确（done）、错误（fail）、进行中（progress）三个回调函数列表，它们都是`jQuery.Callbacks`实例

##jQuery.Callbacks
这是回调函数列表的构造器，内部使用一个数组来保存回调函数列表，并提供一系列的方法来维护这个列表。另外这个列表还有一些状态
###配置选项
创建一个回调函数列表可能会用到如下参数：
1. options：一个选项类表，确定了回调函数列表如何工作，以及一些常见配置
2. once：默认情况下回调函数列表的执行时没有次数限制的，但如果设置了once，将设置回调函数列表只会被执行一次
3. memory：决定了在回调函数列表在执行过程中，是否会保留上一个函数执行的结果
4. unique：决定了回调函数列表中的函数能否重复
5. stopOnFalse：决定了在一个回调函数返回false后，后面的回调函数将不会被执行

接下来看看构造函数：

```javascript
options = typeof options === "string" ?
    ( optionsCache[ options ] || createOptions( options ) ) :
    jQuery.extend( {}, options );
```

options可以是字符串，如`"once memory"`，如果是字符串，就先进行解析并缓存。如果options是对象，那么直接options就是这个对象

###私有变量
```javascript
var // Last fire value (for non-forgettable lists)
    /*用于存放运行结果*/
    memory,
    /*标志所有回调函数列表是否被触发过*/
    fired,
    /*标志当前正在执行回调函数列表中的函数*/
    firing,
    /*第一个被执行的回调函数*/
    firingStart,
    /*回调函数列表的长度*/
    firingLength,
    /*当前执行的回调函数在回调函数列表中的下标，如果移除了回调函数，将会对其进行修改*/
    firingIndex,
    /*保存回调函数的列表*/
    list = [],
    /*如果回调函数列表时多次执行的，那么在运行回调函数列表的过程中，可能会再次触发，这时候就需要一个队列进行等待了*/
    stack = !options.once && [],
```

这里面都是一些私有变量，没啥太多好说的，官方代码里也对每个变量都写了注释

###触发函数fire
```javascript
fire = function( data ) {
    /*如果使用了memory配置，data会先被保存在memory中*/
    memory = options.memory && data;
    /*表明这个回调函数列表已经被触发过了*/
    fired = true;
    /*确定当前执行的回调函数在回调函数列表中的位置*/
    firingIndex = firingStart || 0;
    /*将起始设为0*/
    firingStart = 0;
    /*获取回调函数列表的总长度*/
    firingLength = list.length;
    /*修改状态为正在执行*/
    firing = true;
    /*依次执行回调函数*/
    for ( ; list && firingIndex < firingLength; firingIndex++ ) {
        /*如果回调函数返回值是false且设定了stopOnFalse，那么执行结束，memory清空*/
        if ( list[ firingIndex ].apply( data[ 0 ], data[ 1 ] ) === false && options.stopOnFalse ) {
            memory = false; // To prevent further calls using add
            break;
        }
    }
    /*修改正在执行状态为false*/
    firing = false;

    /*如果等待队列中有数据，那么需要获取等待队列中的数据，再次执行回调函数列表*/
    if ( list ) {
        /*多次执行的话，stack是个数组*/
        if ( stack ) {
            /*从等待队列中弹出数据再次执行*/
            if ( stack.length ) {
                fire( stack.shift() );
            }
        /*如果是单次执行，且所有函数正常执行完成，缓存了最终结果，清空回调函数列表*/
        } else if ( memory ) {
            list = [];
        /*否则说明函数没有正常执行完成，将回调函数列表设为无效*/
        } else {
            self.disable();
        }
    }
},
```
这里可以看到触发回调函数列表的逻辑。触发后，会依次执行列表中的回调函数，这里执行时有一个stopOnFalse设置，如果函数返回false，那么就终止执行。另外在执行过程中，如果又有新的执行请求到来，需要将执行请求放入等待队列之中，等待当前执行中的所有回调函数完成之后再重新执行。当然这个设定对once类型的回调函数列表不起作用

###实例
接下来创建了一个self对象，并进行了返回，这是个一个构造函数，说明self是真正返回的实例。看看实例中有哪些方法：

####add
```javascript
add: function() {
    if ( list ) {
        //首先保存当前列表长度
        var start = list.length;
        /*使用jQuery.each方法遍历深度遍历arguments：
        1. 如果键值对中值为函数，那么直接添加，需要注意的是如果有unique选项，在添加前需要判重
        2. 如果值为对象那么遍历这个对象进行添加 */
        (function add( args ) {
            jQuery.each( args, function( _, arg ) {
                var type = jQuery.type( arg );
                if ( type === "function" ) {
                    if ( !options.unique || !self.has( arg ) ) {
                    list.push( arg );
                    }
                } else if ( arg && arg.length && type !== "string" ) {
                    // Inspect recursively
                    add( arg );
                }
            });
        })( arguments );
        /*如果正在执行回调函数列表，那么需要维护一下长度*/
        if ( firing ) {
            firingLength = list.length;
        /*如果memory中已经有值，执行所有新增加的回调函数*/
        } else if ( memory ) {
            firingStart = start;
            fire( memory );
        }
    }
    /*返回this方便链式操作*/
    return this;
},
```
这个方法往回调函数列表中添加新函数，jQuery会非常智能的使用each对参数进行深度遍历来添加所有函数。需要注意的是，如果回调函数列表正在执行，添加之后需要维护长度。另外如果memory中有数据，我们就应该立即执行新添加的回调函数

####remove
```javascript
remove: function() {
    if ( list ) {
        /*遍历arguments，对每个函数分执行删除操作*/
        jQuery.each( arguments, function( _, arg ) {
            var index;
            /*通过jQuery.inArray获取函数在回调函数列表中的位置*/
            while ( ( index = jQuery.inArray( arg, list, index ) ) > -1 ) {
                /*删除掉这个函数*/
                list.splice( index, 1 );
                /*如果正在执行回调函数，需要维护长度和当前正在执行的回调函数的下标*/
                if ( firing ) {
                    if ( index <= firingLength ) {
                        firingLength--;
                    }
                    if ( index <= firingIndex ) {
                        firingIndex--;
                    }
                }
            }
        });
    }
    /*返回this方便链式操作*/
    return this;
},
```
这里同样使用`jQuery.each`遍历所有参数，获取其中的函数，通过inArray判定，然后通过splice移除。这里需要注意的是，在回调函数列表正在执行时，删除操作同样需要维护长度，另外还可能需要维护当前正在运行的函数的下标

####has (fn)
```javascript
has: function( fn ) {
    return fn ? jQuery.inArray( fn, list ) > -1 : !!( list && list.length );
},
```
判断一个函数是否在回调函数列表中，分判断函数和判断列表两种情况：
1. 若有fn，直接用inArray判定
2. 若无fn，直接判断列表是否有长度不为0的list列表

####empty
```javascript
empty: function() {
    list = [];
    firingLength = 0;
    return this;
},
```
清空回调函数列表，没啥好说的...list社为空数组，长度设为0

####disable和disabled
```javascript
disabled: function() {
    list = stack = memory = undefined;
    return this;
},
disabled: function() {
    return !list;
},
```
将回调函数列表设定为无效，实际上就是将list，stack，memory设成undefined，检测无效也很简单，直接通过list判断，没设定无效情况下，list都是数组，其必然是真值

####lock和locked
```javascript
lock: function() {
    stack = undefined;
    if ( !memory ) {
        self.disable();
    }
    return this;
},
locked: function() {
    return !stack;
},
```
lock和locked故名思意就是将回调函数列表锁住，其判定方式是stack是否存在，在once设置下，stack本来就不存在，直接就是locked。而非once情况下，lock函数会设定stack为undefined，这样就无法在回调函数运行时进行fire了，就算锁住了。另外，如果没有memory，说明回调函数执行失败了，直接disbale掉就好

####fireWith和fire
```javascript
fireWith: function( context, args ) {
    /*如果回调函数列表还有效，没触发过或者可以多次触发，那么就满足触发条件了*/
    if ( list && ( !fired || stack ) ) {
        args = args || [];
        args = [ context, args.slice ? args.slice() : args ];
        /*如果正在出发，就放到等待队列中*/
        /*如果once且触发过或正在触发，可以从私有方法fire中看到，fired是在方法一开始被设置的，所以无法通过上面的fired条件，能到这里必然是没有触发或多次触发的情况。而没有触发不存在firing状态，也就不需要检测stack了*/
        if ( firing ) {
            stack.push( args );
        /*否则直接触发*/
        } else {
            fire( args );
        }
    }
    return this;
},
fire: function() {
    self.fireWith( this, arguments );
    return this;
},
fired: function() {
    return !!fired;
}
```
这里fire实际上使用fireWith实现的，我们只需要看fireWith就好。这里fireWith将触发回调函数列表的执行，触发条件是：当前回调函数列表有效，且没触发过或可以多次触发（stack存在就是可以多次触发），需要注意的是，如果正在触发，也就是firing状态时，触发请求将会被放入stack中等待

fired没啥好说的，判断回调函数列表是否被触发过

###小结
这个`jQuery.Callbacks`本质上就是维护一个数组，这个数组中都是函数。一个特点就是可以通过fire方式去挨个执行这些函数，并提供了一些配置来确定执行的过程以及执行的次数。每个Deferred对象将拥有三个Callbacks实例

##Deferred
jQuery的异步控制使用Deferred/Promise，每一个Deferred对象对应一个Promise对象，首先来看看其构造函数

###构造函数
####三个状态，三个操作，三个列表
Deferred有三个状态：
1. pending
2. resolved
3. rejected

pending状态是最初状态，它等待resolve操作或reject操作，使用resolve操作表示成功，将跳转到resolved状态，而使用reject将跳转到rejected状态，这两个转变是不可逆的。另外在pending状态下可以无限次调用notify操作

事实上，每个操作对应着一系列的回调函数，看一下定义：
```javascript
var tuples = [
    [ "resolve", "done", jQuery.Callbacks("once memory"), "resolved" ],
    [ "reject", "fail", jQuery.Callbacks("once memory"), "rejected" ],
    [ "notify", "progress", jQuery.Callbacks("memory") ]
],
```
可以看到，这里为resolve、reject、notify这三个操作分别创建了Callbakcs的实例。这里为三个操作的具体定义如下：
1. resolve方法，对应的添加回调函数的方法是done，回调函数列表类型是once和memory，运行后状态转变到resolved
2. reject方法，对应的添加回调函数的方法是fail，回调函数列表类型是once和memory，运行后状态转变到rejected
3. notify方法，对应的添加回调函数的方法为progress，回调函数列表类型是memory，说明可执行多次，执行后不会转变状态

构造函数下面，会为每一个操作在Promise对象和Deferred对象上生成对应的函数（Promise上是：done、fail、progress。Deferred上是：resolve、reject、notify）：
```javascript
/*针对三个操作分别进行加工*/
jQuery.each( tuples, function( i, tuple ) {
    /*获取操作的回调函数列表*/
    var list = tuple[ 2 ],
        /*获取操作执行后的状态*/
        stateString = tuple[ 3 ];

    // promise[ done | fail | progress ] = list.add
    /*为promise对象分别生成done、fail、progress方法，直接映射到对应的回调函数列表对象的add添加方法*/
    promise[ tuple[1] ] = list.add;

    // Handle state
    /*
    如果状态会改变，说明是resolve方法或reject方法，
    由于状态转变不可逆，所以需要在回调函数列表最后添加三个函数，
    分别用于状态修改、使回调函数列表无效、将回调函数列表锁住
    */
    if ( stateString ) {
        list.add(function() {
            // state = [ resolved | rejected ]
            state = stateString;

        // [ reject_list | resolve_list ].disable; progress_list.lock
        }, tuples[ i ^ 1 ][ 2 ].disable, tuples[ 2 ][ 2 ].lock );
    }

    // deferred[ resolve | reject | notify ]
    /*在deferred上添加resolve、reject、notify方法，分别映射到其回调函数列表的fireWith上*/
    deferred[ tuple[0] ] = function() {
        deferred[ tuple[0] + "With" ]( this === deferred ? promise : this, arguments );
        return this;
    };
    /*为deferred对象添加resolveWith，rejectWith，notifyWith，对应的回调函数列表的fireWith*/
    deferred[ tuple[0] + "With" ] = list.fireWith;
});
```
上面的三种操作，只是定义了名称，这里才是真正生成对应函数的地方。jq会为每个Deferred对象生成6个方法：
1. resolve
2. reject
3. notify
4. resolveWith
5. rejectWith
6. notifyWith

上面三个实际上是直接调用下面三个，只不过加了个默认的参数。下面三个实际上就是对应回调函数列表的fireWith方法。

同时，这里还会为promise增加三个方法：
1. done
2. fail
3. progress

这三个方法就是为对应的回调函数列表添加新函数的方法，直接映射到对应回调函数列表的add方法就行了

另外需要注意一下resolve和reject方法的一次性，实际上也就是在回调函数列表最后加上disable和lock方法

###promise对象
上面反复说了Promise对象，来看看Promise对象的真正面貌：

```javascript
promise = {
    /*获得当前状态的方法*/
    state: function() {
        return state;
    },
    /*无论执行成功与否，都执行参数中的回调*/
    always: function() {
        deferred.done( arguments ).fail( arguments );
        return this;
    },
    /*顺序声明三个函数，分别在成功，失败，执行中时进行调用，返回一个promise对象*/
    then: function( /* fnDone, fnFail, fnProgress */ ) {
        /*then的代码*/
    },
    // Get a promise for this deferred
    // If obj is provided, the promise aspect is added to the object
    /*获取promise对象*/
    promise: function( obj ) {
        return obj != null ? jQuery.extend( obj, promise ) : promise;
    }
},
deferred = {};
/*pipe方法，实际上就是then，为了符合标准罢了*/
promise.pipe = promise.then;
/*这里为Promise添加了done、fail、progress方法*/
/*这里为Deferred添加了resolve、resolveWith、reject、rejectWith、notify、notifyWith方法*/
jQuery.each( tuples, function( i, tuple ) {
    /*上面的代码*/
});
/*将Promise对象的所有方法拷贝给Deferred对象*/
promise.promise( deferred );
```

这里可以看到，promise对象提供了几个接口：
1. state：获取当前Deferred对象的状态
2. always：欧诺更是使用done和fail，使得参数中的方法在deferred成功和失败时都执行
3. then：使用done、fail、progress分别绑定函数，代码较多，后面再讲
4. promise：如果对象存在，向一个对象添加promise对象中的接口，否则直接返回promise对象
5. pipe：就是then，别名而已
6. done，fail，progress：上面介绍过，不赘述了

####Promise和Deferred的区别
这里在申明了promise对象之后，在Deferred对象中添加了promise所有的方法。另外Deferred对象拥有之前说的resolve等6个方法，Deferred对象和Promise对象的区别就很明显了：Promise实际上就是没有resolve、resolveWith、reject、rejectWith、notify、notifyWith这六个方法，其他和Deferred对象一样

####then和pipe
上面略过了then方法，这里单独拉出来说一下：

```javascript
then: function( /* fnDone, fnFail, fnProgress */ ) {
    var fns = arguments;
    /*
    这里新建了一个Deferred对象，并返回其Promise对象，以构成一个Deferred对象链
    由于这里返回的是Promise对象，没有resolve等方法，所以触发必须在整个Deferred对象链的头上触发
    链上的每个Deferred对象的三个回调函数列表的最后，都会有一个函数，
    用于触发链的下一个Deferred对象的相对应的回调函数列表
    */
    return jQuery.Deferred(function( newDefer ) {
        /*对于上面三种，分别将函数加入到对应的回调函数列表中*/
        jQuery.each( tuples, function( i, tuple ) {
            var fn = jQuery.isFunction( fns[ i ] ) && fns[ i ];
            /*向当前Deferred最后添加一个函数，用于触发链的下一个Deferred对象的相关回调函数列表*/
            deferred[ tuple[1] ](function() {
                var returned = fn && fn.apply( this, arguments );
                /*如果返回值是Deferred对象，获取其Promise对象，并为其绑定相关触发操作*/
                if ( returned && jQuery.isFunction( returned.promise ) ) {
                    returned.promise()
                        .done( newDefer.resolve )
                        .fail( newDefer.reject )
                        .progress( newDefer.notify );
                /*如果不是Deferred对象，直接在新建的deferred对象上添加相关触发操作*/
                } else {
                    newDefer[ tuple[ 0 ] + "With" ]( this === promise ? newDefer.promise() : this, fn ? [ returned ] : arguments );
                }
            });
        });
        fns = null;
    }).promise();
},
```
这个函数是Deferred的一个非常重要的函数，它实现了一个Deferred链。这个Deferred链的特点是，只有链的头节点是Deferred对象，后面都是Promise对象，这也意味着，只能在头节点触发resolve、reject、notify操作。触发了操作之后，对应的操作会顺着链传递下去，触发了一个节点resolve，执行完毕后，会自动触发下一个节点的resolve，reject和notify同理。

这里传入的三个函数会分别在当前的Deferred相关操作被触发时执行，如果执行返回的是一个Deferred/Promise对象，获取其Promise对象，新建的Deferred对象将会被链在这个返回的Deferred对象之后。如果返回其他的值，新建的Deferred对象的resolveWith、rejectWith、notifyWith方法会被直接触发，达到链式的效果。

###小结
这就是jQuery的Deferred/Promise的全貌了。Promise对象实际上是Deferred对象的除去resolve等6个方法的子集。done、fail、progress分别对应一个回调函数列表，这三个方法实际上就是往对应的回调函数列表中插入函数。但then和pipe不相同，它们会新建一个Deferred对象，并构造一个Deferred对象链。这也让jQuery的Deferred/Promise显得不论不类。

##when
when方法提供了将多个Deferred对象聚集的能力，在when方法中传入一些Deferred对象，返回一个Deferred对象。在参数中的所有Deferred对象都被resolve之后，会resolve这个返回的Deferred对象，如果参数中的Deferred有一个被reject了，那么这个返回的Deferred也会被reject。另外，在参数中的Deferred对象resolve时，返沪ideDeferred也会被notify。

```javascript
when: function( subordinate /* , ..., subordinateN */ ) {
    var i = 0,
        /*切分参数到数组*/
        resolveValues = slice.call( arguments ),
        /*数组长度*/
        length = resolveValues.length,

        /* 未完成的需要监听的Deferred对象的个数 */
        remaining = length !== 1 || ( subordinate && jQuery.isFunction( subordinate.promise ) ) ? length : 0,
        /*新建一个Deferred对象用于管理所有的Deferred对象结果，
        不妨就叫管理Deferred吧，如果参数只有一个Deferred，就不需要新建了，直接用它就行了
        deferred = remaining === 1 ? subordinate : jQuery.Deferred(),
        */

        /*
        使用一个计数器来计算的，计数器就是remaining，初始为需要执行的Deferred对象的个数，
        每有一个Deferred被resolve，就减一，减到0时，所有的Deferred都被resolve了，
        就触发新建的Deferred的resolve。
        如果有Deferred被resolve，但remaining没有到0，就触发管理Deferred的notify
        */
        updateFunc = function( i, contexts, values ) {
            return function( value ) {
                contexts[ i ] = this;
                values[ i ] = arguments.length > 1 ? slice.call( arguments ) : value;
                if ( values === progressValues ) {
                    deferred.notifyWith( contexts, values );
                } else if ( !( --remaining ) ) {
                    deferred.resolveWith( contexts, values );
                }
            };
        },

        progressValues, progressContexts, resolveContexts;

    /*为每个Deferred对象增加我们的更新函数，如果有reject，那么也触发管理Deferred的reject*/
    if ( length > 1 ) {
        progressValues = new Array( length );
        progressContexts = new Array( length );
        resolveContexts = new Array( length );
        for ( ; i < length; i++ ) {
            /*这里只处理Deferred/Promise，其他不考虑*/
            if ( resolveValues[ i ] && jQuery.isFunction( resolveValues[ i ].promise ) ) {
                resolveValues[ i ].promise()
                    .done( updateFunc( i, resolveContexts, resolveValues ) )
                    .fail( deferred.reject )
                    .progress( updateFunc( i, progressContexts, progressValues ) );
            } else {
                --remaining;
            }
        }
    }

    /*如果传入的参数都没有Deferred，直接resolve管理Deferred就好*/
    if ( !remaining ) {
        deferred.resolveWith( resolveContexts, resolveValues );
    }
    /*将这个管理Deferred对象返回*/
    return deferred.promise();
}
```

从上面可以看到主要的实现思路就是，新建一个管理Deferred对象，它期望在参数中所有的Deferred被resolve后，执行自己的resolve操作。内部使用了一个计数器remaining，用于表明还有多少个Deferred尚未resolve。当这个计数器变成0时，所有的Deferred都被resolve了，那么这个管理Deferred也可以被resolve了。

为了维护这个计数器，在每个Deferred的done回调函数列表最后，绑定一个updateFunc函数，这个函数内部会修改remaining，以及判断是应该执行管理Deferred对象的resolve还是notify

而由于任何一个Deferred被reject的话，管理Deferred都会被reject，所以直接在每一个Deferred的fail回调函数列表上添加管理Deferred的reject方法就行了

另外需要注意一下参数中只有一个或没有Deferred的情况，前者可以省去创建管理Deferred对象，直接使用参数中的Deferred对象作为管理对象就行了。后者则可以直接执行resolve方法


##总结
jQuery中使用Deferred/Promise对象进行异步管理，其内部维护了三个Callbacks回调函数列表，这与常规的Promise的链式实现并不一致。在稍早的版本中，then方法其实也是和done、fail、progress一样往回调函数列表里添加方法，并不会形成Deferred链，后来Resig估计也发现了自己理解错了标准，于是乎通过pipe和then生成Deferred链，但这种Callbacks和Deferred链同时存在的方式，显得不伦不类，不过普通的需求基本上都能满足。jQuery的ready、ajax等都是使用Deferred/Promise来进行异步控制的
