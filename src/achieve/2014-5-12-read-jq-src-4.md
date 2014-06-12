---
layout: art
title: jQuery的事件机制——事件对象、兼容、接口
subTitle: 闲来没事读源码系列——jQuery
desc: 这篇主要介绍了jQuery中事件管理器的事件对象、兼容实现以及在jQuery对象上暴露的接口
tags: [JavaScript]
categories: [源码阅读]
---

{% raw %}
接上一篇 [jQuery的事件机制——核心篇](http://skyinlayer.com/#/art/blog/2014/05/12/read-jq-src-3)

##事件对象
jq中使用自己创立的对象传递给回调函数，这里解析一下这个事件对象：
###构造函数
jq的事件对象的构造函数如下：
```javascript
jQuery.Event = function( src, props ) {
    //内部的代码
};
```
接下来接下下内部代码：

```javascript
/*兼容不使用new的情况*/
if ( !(this instanceof jQuery.Event) ) {
    return new jQuery.Event( src, props );
}
```
用于防止出现没有使用new直接调用构造函数的情况

```javascript
if ( src && src.type ) {
    this.originalEvent = src;
    this.type = src.type;

    // Events bubbling up the document may have been marked as prevented
    // by a handler lower down the tree; reflect the correct value.
    this.isDefaultPrevented = src.defaultPrevented ||
            // Support: Android < 4.0
            src.defaultPrevented === undefined &&
            src.getPreventDefault && src.getPreventDefault() ?
        returnTrue :
        returnFalse;

// Event type
} else {
    this.type = src;
}
```
这里根据传入的是事件对象还是事件名称分别进行处理，当传入原生事件对象时，使用originalEvent指向原生事件对象，并获取它的事件名称。另外还要判断事件是否已经屏蔽默认行为了。如果传入的是字符串，直接写入到事件名称中

```javascript
/*通过extend添加额外属性*/
if ( props ) {
    jQuery.extend( this, props );
}
```
事件对象可以添加一些其他属性，这里添加的属性通过props传入，直接extend就好

```javascript
/*创建时间*/
this.timeStamp = src && src.timeStamp || jQuery.now();

/*jq事件对象标记*/
this[ jQuery.expando ] = true;
```
一个创建时的时间戳，不知道干嘛用的，至于版本号标记，主要是用来判断对象是原生事件对象还是jq自己的事件对象

###原型上的方法
事件对象实际上是jq新建的对象，对原生事件对象进行了一层包裹，那么应该提供一些方法操作原生事件对象。我们操作原生事件对象无外乎preventDefault和stopPropagation，这里就是做了一层封装

```javascript
isDefaultPrevented: returnFalse,
isPropagationStopped: returnFalse,
isImmediatePropagationStopped: returnFalse,
```
默认情况下，不会阻止默认行为，事件不会被终止。这里ImmediatePropagtaionStop其实和PropagationStop没什么区别

```javascript
preventDefault: function() {
    var e = this.originalEvent;

    this.isDefaultPrevented = returnTrue;

    if ( e && e.preventDefault ) {
        e.preventDefault();
    }
},
```
阻止默认行为，先在jq的事件对象上做个标记，然后调用原生事件的preventDefault方法

```javascript
stopPropagation: function() {
    var e = this.originalEvent;

    this.isPropagationStopped = returnTrue;

    if ( e && e.stopPropagation ) {
        e.stopPropagation();
    }
},
stopImmediatePropagation: function() {
    this.isImmediatePropagationStopped = returnTrue;
    this.stopPropagation();
}
```
终止事件执行，同样是先在事件对象上做个标记，然后调用原生事件的pstopPropagation方法，可以看到，两个方法没什么区别

##事件对象在事件机制中的使用
jq不嫌麻烦自己弄了个事件对象进行包装，就是为了屏蔽浏览器之间事件对象上的差异。这里jq事件对象需要根据事件的类型，来构建兼容的事件对象，同样是使用钩子的形式，调用这些钩子的地方，在事件管理器的fix方法

###fix方法
fix方法就是将原生事件对象加工为jq自己的事件对象，内部都是用钩子来加对不同类型的事件进行加工

```javascript
if ( event[ jQuery.expando ] ) {
    return event;
}
```
jq事件对象上有jq版本标记，如果标记已存在，说明是jq时间爱你对象，没必要加工了

```javascript
var i, prop, copy,
    /*获取事件的名称*/
    type = event.type,
    /*将原生事件对象缓存*/
    originalEvent = event,
    /*获取事件对象对应的钩子*/
    fixHook = this.fixHooks[ type ];

/*如果没有钩子，需要判断这个对象类型是鼠标事件还是键盘事件*/
if ( !fixHook ) {
    this.fixHooks[ type ] = fixHook =
        rmouseEvent.test( type ) ? this.mouseHooks :
        rkeyEvent.test( type ) ? this.keyHooks :
        {};
}
```
这里会获取特殊事件的钩子，如果没有钩子，那需要判断事件是鼠标事件还是按键事件，这俩都需要特别处理。另外也会做缓存，获取到钩子后写入到fixHooks中，下次同样类型的事件就能直接获取钩子了

```javascript
/*获取鼠标事件或键盘事件应当拷贝的相关属性的列表*/
copy = fixHook.props ? this.props.concat( fixHook.props ) : this.props;

/*新建一个包装了原生事件对象的jq事件对象*/
event = new jQuery.Event( originalEvent );
/*将这些需要拷贝的属性全部拷贝到jq事件对象中*/
i = copy.length;
while ( i-- ) {
    prop = copy[ i ];
    event[ prop ] = originalEvent[ prop ];
}
```
鼠标类型事件和按键类型时间都有自己的一些属性，当然还有些公有属性，这里需要获取事件应当从原生事件中拷贝值名称的列表。获取到列表后新建一个jq事件对象进行拷贝。

```javascript
if ( !event.target ) {
    event.target = document;
}
if ( event.target.nodeType === 3 ) {
    event.target = event.target.parentNode;
}
```
这里修复了一些事件target不正确的问题

```javascript
return fixHook.filter ? fixHook.filter( event, originalEvent ) : event;
```
最后再通过filter钩子做一下最后的加工处理。处理完成之后，返回jq的事件对象

###鼠标事件和键盘事件的处理
fix中都是调用钩子来获得元素列表和filter最后处理，在事件管理器中定义了鼠标事件和键盘事件需要的属性

####公有属性
```javascript
props: "altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),
```
这些是鼠标和键盘事件公有的属性

####键盘事件
```javascript
keyHooks: {
    props: "char charCode key keyCode".split(" "),
    filter: function( event, original ) {

        // Add which for key events
        if ( event.which == null ) {
            event.which = original.charCode != null ? original.charCode : original.keyCode;
        }

        return event;
    }
},
```
这里是键盘钩子，定义了键盘事件特有属性以及其filter，filter主要是将如charCode、keyCode等进行统一，创建出符合W3C标准的which

####鼠标事件
```javascript
mouseHooks: {
    props: "button buttons clientX clientY offsetX offsetY pageX pageY screenX screenY toElement".split(" "),
    filter: function( event, original ) {
        var eventDoc, doc, body,
            button = original.button;
        if ( event.pageX == null && original.clientX != null ) {
            eventDoc = event.target.ownerDocument || document;
            doc = eventDoc.documentElement;
            body = eventDoc.body;
            event.pageX = original.clientX + ( doc && doc.scrollLeft || body && body.scrollLeft || 0 ) - ( doc && doc.clientLeft || body && body.clientLeft || 0 );
            event.pageY = original.clientY + ( doc && doc.scrollTop  || body && body.scrollTop  || 0 ) - ( doc && doc.clientTop  || body && body.clientTop  || 0 );
        }
        if ( !event.which && button !== undefined ) {
            event.which = ( button & 1 ? 1 : ( button & 2 ? 3 : ( button & 4 ? 2 : 0 ) ) );
        }
        return event;
    }
},
```
同样的方式，定义了鼠标事件特有的属性，另外做了一个兼容，做出了pageX、pageY、which等属性

##特殊事件
上一篇讲了jq事件核心，可以看到针对特殊事件，基本上每个地方都需要通过钩子特殊处理，那么有哪些特殊事件呢？这些在事件管理器的special里都有：

###load
```javascript
load: {
    // Prevent triggered image.load events from bubbling to window.load
    noBubble: true
},
```
load事件不冒泡，需要注意
###focus和blur
```javascript
focus: {
    // Fire native event if possible so blur/focus sequence is correct
    trigger: function() {
        if ( this !== safeActiveElement() && this.focus ) {
            this.focus();
            return false;
        }
    },
    delegateType: "focusin"
},
blur: {
    trigger: function() {
        if ( this === safeActiveElement() && this.blur ) {
            this.blur();
            return false;
        }
    },
    delegateType: "focusout"
},
```
focus和blur事件，这俩有自己的trigger钩子，另外其使用代理时名称也不同。事实上focus和blur除了trigger钩子，还有在事件注册和事件删除时的setup和teardown钩子，可以看到代码如下
```javascript
if ( !support.focusinBubbles ) {
    jQuery.each({ focus: "focusin", blur: "focusout" }, function( orig, fix ) {
        // Attach a single capturing handler on the document while someone wants focusin/focusout
        var handler = function( event ) {
                jQuery.event.simulate( fix, event.target, jQuery.event.fix( event ), true );
            };
        jQuery.event.special[ fix ] = {
            setup: function() {
                var doc = this.ownerDocument || this,
                    attaches = data_priv.access( doc, fix );
                if ( !attaches ) {
                    doc.addEventListener( orig, handler, true );
                }
                data_priv.access( doc, fix, ( attaches || 0 ) + 1 );
            },
            teardown: function() {
                var doc = this.ownerDocument || this,
                    attaches = data_priv.access( doc, fix ) - 1;

                if ( !attaches ) {
                    doc.removeEventListener( orig, handler, true );
                    data_priv.remove( doc, fix );

                } else {
                    data_priv.access( doc, fix, attaches );
                }
            }
        };
    });
}
```
###click
```javascript
click: {
    // For checkbox, fire native event so checked state will be right
    trigger: function() {
        if ( this.type === "checkbox" && this.click && jQuery.nodeName( this, "input" ) ) {
            this.click();
            return false;
        }
    },
    /*浏览器兼容，如果元素是a标签，那么不触发原生click事件*/
    // For cross-browser consistency, don't fire native .click() on links
    _default: function( event ) {
        return jQuery.nodeName( event.target, "a" );
    }
},
```
点击时间爱你，在checkbox上有钩子，调用其原生api。另外，当元素为a标签时，不触发原生click事件
###beforeunload
```javascript
beforeunload: {
    postDispatch: function( event ) {

        // Support: Firefox 20+
        // Firefox doesn't alert if the returnValue field is not set.
        if ( event.result !== undefined ) {
            event.originalEvent.returnValue = event.result;
        }
    }
}
```
beforeunlaod事件在ff中最后结果可能不同，需要做兼容
###mouseenter和mouseleave
mouseover和mouseout的问题在于，他们只监听最外层的大容器，而大容器中是由很多子元素的。如果鼠标在子元素上，而离开了大容器，mouseout事件也会触发。

比如一个列式菜单，最上层菜单上有一些选项，鼠标悬停在选项上，右侧会出现该选项下的子选项。如果在菜单上使用mouseover和mouseout来绑定事件，当鼠标移动到子选项时，实际上移出了容器，会触发mouseout事件，菜单就被隐藏了...

jq通过新建两个事件mouseenter和mouseleave来防止这种情况发生

```javascript
jQuery.each({
    mouseenter: "mouseover",
    mouseleave: "mouseout"
}, function( orig, fix ) {
    jQuery.event.special[ orig ] = {
        delegateType: fix,
        bindType: fix,

        handle: function( event ) {
            var ret,
                target = this,
                related = event.relatedTarget,
                handleObj = event.handleObj;

            // For mousenter/leave call the handler if related is outside the target.
            // NB: No relatedTarget if the mouse left/entered the browser window
            if ( !related || (related !== target && !jQuery.contains( target, related )) ) {
                event.type = handleObj.origType;
                ret = handleObj.handler.apply( this, arguments );
                event.type = fix;
            }
            return ret;
        }
    };
});
```
可以看到，这里可以看到，使用contains判断当前元素是否被包含在容器中，如果包含将不会执行回调函数

##jQuery对象上的方法
我们需要一系列的方法将事件用于jQuery对象之上，依旧是在fn上扩展，有如下一些方法：
1. on： 绑定事件添加回调
2. one：绑定知识性一次的事件
3. off：移除事件
4. trigger：对每一个元素触发事件
5. triggerHandler：对jq对象中的第一个元素触发事件

###on (types, selector, data, fn, /\*内部使用\*/one)
jq使用on方法在元素时行绑定事件，这里types可以是一个`event1 event2`这样的字符串，同时绑定多个事件公用相同的回调函数fn。另外，当types为对象时，键为事件名称，值为回调函数，也可以一次绑定多个事件。这是一个多接口方法，需要根据传入的参数判断如何处理

```javascript
if ( typeof types === "object" ) {
    // ( types-Object, selector, data )
    if ( typeof selector !== "string" ) {
        // ( types-Object, data )
        data = data || selector;
        selector = undefined;
    }
    /*一次绑定多个事件*/
    for ( type in types ) {
        this.on( type, selector, data, types[ type ], one );
    }
    return this;
}
```
可以看到，这里就是处理types为对象的情况，这里实际上根据types中的每个键值对，递归调用了on方法进行单个绑定

```javascript
/*可以不提供数据*/
if ( data == null && fn == null ) {
    // ( types, fn )
    //情况1
    fn = selector;
    data = selector = undefined;
} else if ( fn == null ) {
    if ( typeof selector === "string" ) {
        // ( types, selector, fn )
        //情况2
        fn = data;
        data = undefined;
    } else {
        // ( types, data, fn )
        //情况3
        fn = data;
        data = selector;
        selector = undefined;
    }
}
if ( fn === false ) {
    fn = returnFalse;
} else if ( !fn ) {
    return this;
}
```
这里处理了三种情况：
1. 只有事件名称和回调函数
2. 有事件名称，代理选择器和回调函数
3. 有事件名称，事件数据和回调函数

如果没有回调函数，需要给与一个默认的回调函数，这个默认回调函数直接`return false`

```javascript
if ( one === 1 ) {
    origFn = fn;
    fn = function( event ) {
        // Can use an empty set, since event contains the info
        jQuery().off( event );
        return origFn.apply( this, arguments );
    };
    // Use same guid so caller can remove using origFn
    fn.guid = origFn.guid || ( origFn.guid = jQuery.guid++ );
}
```
我们可以绑定一次性事件，实现骑士很简单，通过闭包对事件回调函数做一个包装，在其被运行之前，调用off移除掉事件就行了

```javascript
return this.each( function() {
    jQuery.event.add( this, types, fn, data, selector );
});
```
最后，确定好了配置，最后在jq对象中的每个元素上调用通过事件管理器的add方法添加事件回调函数

###one ( types, selector, data, fn )
绑定一次性事件，上面的on已经做了实现，这里只不过是调用一下接口

```javascript
one: function( types, selector, data, fn ) {
    return this.on( types, selector, data, fn, 1 );
},
```

###off ( types, selector, fn )
同样是个多接口函数，在只有事件名称时，直接删除整个事件。如果有确定回调函数，那么删除对应时间的对应回调函数。需要注意代理的情况

```javascript
if ( types && types.preventDefault && types.handleObj ) {
    // ( event )  dispatched jQuery.Event
    handleObj = types.handleObj;
    jQuery( types.delegateTarget ).off(
        handleObj.namespace ? handleObj.origType + "." + handleObj.namespace : handleObj.origType,
        handleObj.selector,
        handleObj.handler
    );
    return this;
}
```
这里处理的是参数是事件对象的情况，这种情况会在使用one绑定事件回调执行后自动删除时发生。获取事件对象其中的属性，递归调用off删除

```javascript
if ( typeof types === "object" ) {
    // ( types-object [, selector] )
    for ( type in types ) {
        this.off( type, selector, types[ type ] );
    }
    return this;
}
```
如果typs是事件名称到回调函数的键值对，那么对其中的每个键和值，分别进行删除，递归调用off删除

```javascript
if ( selector === false || typeof selector === "function" ) {
    // ( types [, fn] )
    fn = selector;
    selector = undefined;
}
if ( fn === false ) {
    fn = returnFalse;
}
```
这里处理了只有事件名称和回调函数的接口情况

```javascript
return this.each(function() {
    jQuery.event.remove( this, types, fn, selector );
});
```
最后，对jq对象中的每个元素移除事件中的回调函数就好

###trigger (type, data) 和 triggerHandler (type, data)
没啥说的，都是直接用的事件管理器的trigger方法。只不过前者对每个元素调用一次，后者只对第一个元素调用

```javascript
/*对jq对象中的每个元素触发事件*/
trigger: function( type, data ) {
    return this.each(function() {
        jQuery.event.trigger( type, data, this );
    });
},
/*对jq对象中的第一个元素触发事件*/
triggerHandler: function( type, data ) {
    var elem = this[0];
    if ( elem ) {
        return jQuery.event.trigger( type, data, elem, true );
    }
}
```

##总结
这一篇直接看的话，肯定会不知所云...最好能结合上一篇一起看，上一篇介绍了事件机制的核心方法，这一篇主要是jq事件对象和一些兼容性问题的解决方法（主要是钩子）。jq的钩子方式很不错，在写框架对付兼容性问题时可以多多使用
{% endraw %}