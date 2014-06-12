---
layout: art
title: jQuery的事件机制——核心篇
subTitle: 闲来没事读源码系列——jQuery
desc: 这篇主要介绍了jQuery中事件管理器的一些核心方法，涉及事件代理、自定事件模拟的冒泡、特殊函数的处理，命名空间的处理等等
tags: [JavaScript]
categories: [源码阅读]
---

{% raw %}

jQuery源码——事件机制
===
jQuery提供了一套完善的事件管理机制，这一整套事件管理机制构建在jQuery的data之上，使用元素的私有数据域来保存事件的相关配置和回调函数列表。jQuery提供了自定义事件的处理，并模拟了事件的冒泡机制。通过冒泡机制，提供了一套事件代理接口

##事件管理器
jQuery提供一个`jQuery.event`的辅助类，它提供了一系列管理事件的方法。主题思想来自Dean Edwards的库。事实上，事件亦无外乎CRUD操作，只不过多了个触发操作（实际上属于R操作的一种），这个辅助类提供了add、remove、trigger、dispatch几个核心方法用添加、删除、触发事件、执行回调函数等功能，另外还提供了一些钩子和辅助函数用于兼容一些特殊事件

###global
存放事件是否存在

###add (elem, types, handler, data, selector)
这个函数用于绑定对应的事件，整体思路大致是：确定事件在元素的私有数据空间中是否存在，如果不存在就创建，创建时为事件绑定一个回调函数，里面使用dispatch执行事件的回调函数列表

所以代码大致流程如下：
####事件创建逻辑
在元素么有绑定过这个事件，或者压根没有绑定过事件时，需要创建事件的对应存储空间以及事件的统一回调函数

```javascript
var handleObjIn, eventHandle, tmp,
    events, t, handleObj,
    special, handlers, type, namespaces, origType,
    elemData = data_priv.get( elem );
    
if ( !elemData ) {
    return;
}
```
获取元素的私有数据空间，如果无法获得私有数据空间，说明是文本节点或注释节点，那么也无法绑定时间了，直接返回

```javascript
if ( handler.handler ) {
    handleObjIn = handler;
    handler = handleObjIn.handler;
    selector = handleObjIn.selector;
}
```
接着确定配置中的回调函数，如果存在事件代理，需要确定需要被代理的元素的选择器

```javascript
if ( !handler.guid ) {
    handler.guid = jQuery.guid++;
}
```
为回调函数创建一个唯一的id来提供优化，实际上还是通过jQuery的guid得到

```javascript
if ( !(events = elemData.events) ) {
    events = elemData.events = {};
}
if ( !(eventHandle = elemData.handle) ) {
    eventHandle = elemData.handle = function( e ) {
        return typeof jQuery !== strundefined && jQuery.event.triggered !== e.type ?
            jQuery.event.dispatch.apply( elem, arguments ) : undefined;
    };
}
```
从元素的私有数据空间中获取存放事件的对象，如果不存在就新建一个。然后从元素的私有数据中获取事件处理函数，如果没有，就新建一个函数。每一个事件对应一个回调函数，这个回调函数使用dispatch方法来执行事件的回调函数列表中的所有函数

####事件绑定逻辑
在创建完事件的存储空间，或者获取到已有的存储空间之后，就需要把往事件的回调函数列表中添加事件了。这里需要处理的问题包括：
1. type字符串中可以通过`event1 event2 event3`这样的方式包含多个事件
2. 有可能存在命名空间如`event.namespace`的情况
3. 特殊事件需要进行名称转换，以及钩子调用
4. 如果是事件代理也需要注意代理逻辑

```javascript
types = ( types || "" ).match( rnotwhite ) || [ "" ];
t = types.length;
while ( t-- ) {
    //后面的代码
}
```
处理情况1，通过切分将多个事件名称切分出来，分别进行处理

```javascript
tmp = rtypenamespace.exec( types[t] ) || [];
type = origType = tmp[1];
namespaces = ( tmp[2] || "" ).split( "." ).sort();

if ( !type ) {
    continue;
}
```
处理情况2，同样是使用正则获取到命名空间和事件名称，如果获取不到事件名称，那么直接continue略过

```javascript
special = jQuery.event.special[ type ] || {};

type = ( selector ? special.delegateType : special.bindType ) || type;

special = jQuery.event.special[ type ] || {};
```
情况3下，如果事件是特殊事件，需要获取特殊事件需要被映射的事件名称

```javascript
handleObj = jQuery.extend({
    type: type,
    origType: origType,
    data: data,
    handler: handler,
    guid: handler.guid,
    selector: selector,
    needsContext: selector && jQuery.expr.match.needsContext.test( selector ),
    namespace: namespaces.join(".")
}, handleObjIn );
```
这里将回调函数封装成带有配置的回调对象，方便后续的删除、查找等操作。这里记录了很多信息：
1. type：事件的映射后的名称
2. origType：事件的原始名称
3. data：事件的默认数据
4. handler：回调函数
5. guid：回调函数的id
6. selector：启用事件代理时，被代理的节点的选择器
7. needsContext：如果是事件代理模式，通过Sizzle判断元素是否需要上下文
8. namespace：重组后的命名空间

```javascript
if ( !(handlers = events[ type ]) ) {
    handlers = events[ type ] = [];
    handlers.delegateCount = 0;

    if ( !special.setup || special.setup.call( elem, data, namespaces, eventHandle ) === false ) {
        if ( elem.addEventListener ) {
            elem.addEventListener( type, eventHandle, false );
        }
    }
}
```
如果这个事件刚注册，给它一个回调对象列表，并设定代理数为0。在情况3下，需要处理setup钩子

```javascript
if ( special.add ) {
    special.add.call( elem, handleObj );

    if ( !handleObj.handler.guid ) {
        handleObj.handler.guid = handler.guid;
    }
}
```
这里同样是情况3下的钩子处理，上面setup是事件注册钩子，而这里则是方法添加的钩子

```javascript
if ( selector ) {
    handlers.splice( handlers.delegateCount++, 0, handleObj );
} else {
    handlers.push( handleObj );
}
```
好了，该玩的钩子都玩完了，将回调对象加入到回调对象列表中吧，这里需要处理情况4，如果是事件代理的话，元素的代理数增加，如果是代理情况，代理的回调对象加载列表前头

```javascript
jQuery.event.global[ type ] = true;
```
最后再全局中标记一下事件已存在就行了

###remove (elem, types, handler, selector, mappedTypes)
删除逻辑也一样，从一个节点的事件存储中删除一个或个事件的一个回调或所有回调，这里同样需要考虑几个地方：
1. type字符串中可以通过`event1 event2 event3`这样的方式包含多个事件
2. 有可能存在命名空间如`event.namespace`的情况
3. 特殊事件需要进行名称转换，以及钩子调用
4. 如果是事件代理也需要注意代理逻辑
5. 在移除了一个事件的所有回调对象后，可以移除这个事件
6. 在移除了一个元素的所有事件后，可以释放这个元素的事件存储空间了

```javascript
var j, origCount, tmp,
    events, t, handleObj,
    special, handlers, type, namespaces, origType,
    elemData = data_priv.hasData( elem ) && data_priv.get( elem );
if ( !elemData || !(events = elemData.events) ) {
    return;
}
```
获取元素的私有数据空间以及其事件存储空间，如果没有，那没必要删除了

```javascript
types = ( types || "" ).match( rnotwhite ) || [ "" ];
t = types.length;
while ( t-- ) {
    //后面的代码
}
```
处理情况1，和上面的add一样

```javascript
tmp = rtypenamespace.exec( types[t] ) || [];
type = origType = tmp[1];

namespaces = ( tmp[2] || "" ).split( "." ).sort();
```
获取事件的命名空间，和add方法一样

```javascript
if ( !type ) {
    for ( type in events ) {
        jQuery.event.remove( elem, type + types[ t ], handler, selector, true );
    }
    continue;
}
```
如果没有获取到事件名称，就得遍历事件存储空间中所有的事件删除handler对应的方法了，这里直接递归了

```javascript
special = jQuery.event.special[ type ] || {};
type = ( selector ? special.delegateType : special.bindType ) || type;
handlers = events[ type ] || [];
origCount = j = handlers.length;
while ( j-- ) {
    //详细删除代码
}
```
这里处理了情况3和4，和add中一样，获取了事件需要被映射的名称，然后通过这个名称获取了事件回调对象列表。然后我们可以遍历回调函谁对象列表，进行删除操作了

```javascript
handleObj = handlers[ j ];
if ( ( mappedTypes || origType === handleObj.origType ) &&
    ( !handler || handler.guid === handleObj.guid ) &&
    ( !tmp || tmp.test( handleObj.namespace ) ) &&
    ( !selector || selector === handleObj.selector || selector === "**" && handleObj.selector ) ) {
    handlers.splice( j, 1 );

    if ( handleObj.selector ) {
        handlers.delegateCount--;
    }
    if ( special.remove ) {
        special.remove.call( elem, handleObj );
    }
}
```
这里就是删除的真正代码了，需要判断代理，判断命名空间，判断方法的guid，如果有map映射，判断名称。所有判断都通过之后，使用数组的splice进行删除。另外在删除之后，如果有代理，代理个数自然要减一，而如果是特殊事件，需要弟阿勇remove钩子了

```javascript
if ( origCount && !handlers.length ) {
    if ( !special.teardown || special.teardown.call( elem, namespaces, elemData.handle ) === false ) {
        jQuery.removeEvent( elem, type, elemData.handle );
    }
    delete events[ type ];
}
```
这里处理情况5，如果事件的回调函数列表为空，那么可以delete掉这个事件了。特殊事件依旧有钩子，调用teardown

```javascript
if ( jQuery.isEmptyObject( events ) ) {
    delete elemData.handle;
    data_priv.remove( elem, "events" );
}
```
如果节点中没有任何事件了，直接释放掉事件存储空间

###trigger (event, data, elem, onlyHandlers)
触发事件的方法，这里模拟了事件的冒泡机制，并且兼容了onXXX绑定的事件回调函数，另外还处理了preventDefault的情况

```javascript
var i, cur, tmp, bubbleType, ontype, handle, special,
    eventPath = [ elem || document ],
    type = hasOwn.call( event, "type" ) ? event.type : event,
    namespaces = hasOwn.call( event, "namespace" ) ? event.namespace.split(".") : [];

cur = tmp = elem = elem || document;

if ( elem.nodeType === 3 || elem.nodeType === 8 ) {
    return;
}
```
做了一些准备工作，获取了事件的命名空间，初始化了冒泡的路径，如果没有提供trigger的元素则默认document，另外文本和注释节点无法触发事件

```javascript
if ( rfocusMorph.test( type + jQuery.event.triggered ) ) {
    return;
}
```
检测是否有focus和blur事件，它们不会在这里被触发

```javascript
if ( type.indexOf(".") >= 0 ) {
    namespaces = type.split(".");
    type = namespaces.shift();
    namespaces.sort();
}
ontype = type.indexOf(":") < 0 && "on" + type;
```
获取事件的名称和命名空间，另外还需要生成一个带on开头的事件名称，方便在兼容onXXX时使用

```javascript
event = event[ jQuery.expando ] ?
    event :
    new jQuery.Event( type, typeof event === "object" && event );

event.isTrigger = onlyHandlers ? 2 : 3;
event.namespace = namespaces.join(".");
event.namespace_re = event.namespace ?
    new RegExp( "(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)" ) :
    null;

event.result = undefined;
if ( !event.target ) {
    event.target = elem;
}
```
常使用事件的都会使用event这个事件对象，jq模拟的事件机制也是一样，不过它自己新建了一个事件对象。这个事件对象包裹了浏览器原生的事件对象，并添加了很多其他的属性:
1. isTrigger: 判断是否需要出发浏览器本身的事件回调
2. namespace: 事件的命名空间
3. namespace_re: 一个用于匹配当前命名空间的正则
4. result: 事件运行的结果
5. target：触发事件的元素，需要注意的是事件代理情况下，target是被代理的元素

事件对象的具体实现，后面会说

```javascript
data = data == null ?
    [ event ] :
    jQuery.makeArray( data, [ event ] );

special = jQuery.event.special[ type ] || {};
if ( !onlyHandlers && special.trigger && special.trigger.apply( elem, data ) === false ) {
    return;
}
```
将event和data进行包裹，装成一个数组方便后面apply调用。这里处理了一下特殊事件，调用了其trigger钩子

```javascript
if ( !onlyHandlers && !special.noBubble && !jQuery.isWindow( elem ) ) {
    /*如果是特殊事件，需要找到对应的真实名称*/
    bubbleType = special.delegateType || type;
    if ( !rfocusMorph.test( bubbleType + type ) ) {
        cur = cur.parentNode;
    }
    for ( ; cur; cur = cur.parentNode ) {
        eventPath.push( cur );
        tmp = cur;
    }

    // Only add window if we got to document (e.g., not plain obj or detached DOM)
    if ( tmp === (elem.ownerDocument || document) ) {
        eventPath.push( tmp.defaultView || tmp.parentWindow || window );
    }
}
```
jq为除了不需要冒泡的特殊事件或者本身就在window上触发的事件以外的情况都模拟了冒泡机制。这里就是不断通过`elem.parentNode`来获取元素到window的路径

```javascript
i = 0;
while ( (cur = eventPath[i++]) && !event.isPropagationStopped() ) {
    event.type = i > 1 ?
        bubbleType :
        special.bindType || type;

    handle = ( data_priv.get( cur, "events" ) || {} )[ event.type ] && data_priv.get( cur, "handle" );
    if ( handle ) {
        handle.apply( cur, data );
    }

    handle = ontype && cur[ ontype ];
    if ( handle && handle.apply && jQuery.acceptData( cur ) ) {
        event.result = handle.apply( cur, data );
        if ( event.result === false ) {
            event.preventDefault();
        }
    }
}
event.type = type;
```
顺着上面生成的冒泡路径依次执行事件绑定的统一回调函数（实际上就是dispatch）。这里首先需要从私有数据空间中获取到需要执行的具体方法，然后使用apply调用。另外，如果元素有通过onXXX绑定方法，也需要执行。另外如果执行的结果为false，调用事件对象的preventDefault

```javascript
if ( !onlyHandlers && !event.isDefaultPrevented() ) {
    if ( (!special._default || special._default.apply( eventPath.pop(), data ) === false) &&
        jQuery.acceptData( elem ) ) {
        if ( ontype && jQuery.isFunction( elem[ type ] ) && !jQuery.isWindow( elem ) ) {
            tmp = elem[ ontype ];
            if ( tmp ) {
                elem[ ontype ] = null;
            }
            jQuery.event.triggered = type;
            elem[ type ]();
            jQuery.event.triggered = undefined;
            if ( tmp ) {
                elem[ ontype ] = tmp;
            }
        }
    }
}
```
onlyHandlers参数为true或事件被调用preventDefault方法，不需要执行事件在浏览器上的默认行为。不符合上述情况时，就需要检测浏览器默认行为来执行了。这里通过检测元素的onXXX属性来获得方法，在执行前需要标记事件已被执行，并在执行后恢复，防止多次触发

```javascript
return event.result;
```
运行完了，返回事件运行的结果

###dispatch (event)
可以看到trigger内部并没有遍历回调对象列表来挨个执行回调函数的逻辑，其内部只是运行一个在add中创建的统一回调函数。从add中我们可以看到，统一回调函数中的逻辑实际上就是调用dispatch方法。dispatch方法同样需要注意几个问题：
1. 事件代理的情况
2. 特殊事件
3. 回调终止（stopPropagation）
4. 事件的命名空间


```javascript
event = jQuery.event.fix( event );

var i, j, ret, matched, handleObj,
    handlerQueue = [],
    args = slice.call( arguments ),
    handlers = ( data_priv.get( this, "events" ) || {} )[ event.type ] || [],
    special = jQuery.event.special[ event.type ] || {};

args[0] = event;
event.delegateTarget = this;
```
这里首先通过后面的fix工具方法，加工了一下事件对象。从私有数据空间中获得了回调对象列表。另外这里处理了事件代理的情况，可以看到delegateTarget指向触发事件的元素

```javascript
if ( special.preDispatch && special.preDispatch.call( this, event ) === false ) {
    return;
}
```
钩子你好，钩子再见...这次是preDispatch钩子...

```javascript
handlerQueue = jQuery.event.handlers.call( this, event, handlers );
```
将回调对象列表进行加工，将在后面的handlers方法中详细介绍，主要是处理事件代理时的情况。

```javascript
i = 0;
while ( (matched = handlerQueue[ i++ ]) && !event.isPropagationStopped() ) {
    event.currentTarget = matched.elem;
    j = 0;
    while ( (handleObj = matched.handlers[ j++ ]) && !event.isImmediatePropagationStopped() ) {
        if ( !event.namespace_re || event.namespace_re.test( handleObj.namespace ) ) {
            event.handleObj = handleObj;
            event.data = handleObj.data;
            ret = ( (jQuery.event.special[ handleObj.origType ] || {}).handle || handleObj.handler )
                    .apply( matched.elem, args );
            if ( ret !== undefined ) {
                if ( (event.result = ret) === false ) {
                    event.preventDefault();
                    event.stopPropagation();
                }
            }
        }
    }
}
```
遍历执行handlers方法处理过的回调对象列表，这里需要考虑回调执行被终止的情况。如果上一方法已经运行了stopPropagation方法终止回调执行，直接循环就可以结束了。另外如果命名空间不符合，也不会执行。

执行时其实就是将事件对象拿出来apply一下，然后判断返回值，如果为false，终止回调执行，也不执行浏览器默认行为

```javascript
if ( special.postDispatch ) {
    special.postDispatch.call( this, event );
}
return event.result;
```
钩子你又来了，这次是postDispatch钩子。全部运行完就可以返回了

###handlers (event, handlers)
上面dispatch有提到过使用handlers回调对象列表的加工来处理事件代理的情况。jq的事件代理的观念是使用上和一般事件没有差别。这里依旧需要模拟事件的冒泡机制。这里的冒泡和trigger中的冒泡不同，trigger中的冒泡是从代理的元素（父元素）从上冒泡，而如果使用代理的话，被代理的元素（子元素）到代理元素（父元素）这一段将没有冒泡。这里的冒泡实现就是解决这个问题，只处理了被代理的元素到代理元素的冒泡。handlers最后会将冒泡的元素和回调对象组合成一个新的对象列表进行返回

```javascript
var i, matches, sel, handleObj,
    handlerQueue = [],
    delegateCount = handlers.delegateCount,
    cur = event.target;
```
获取当前事件的目标和代理个数

```javascript
//如果存在代理
if ( delegateCount && cur.nodeType && (!event.button || event.type !== "click") ) {
    //从被代理元素冒泡到代理元素
    for ( ; cur !== this; cur = cur.parentNode || this ) {
        //屏蔽disable元素的点击事件
        if ( cur.disabled !== true || event.type !== "click" ) {
            //cur元素需要执行的回调对象列表
            matches = [];
            //获取回调对象列表中的所有代理回调对象,挨个判断是否需要执行
            for ( i = 0; i < delegateCount; i++ ) {
                handleObj = handlers[ i ];
                sel = handleObj.selector + " ";
                //判断元素是否符合选择器,这里还进行了缓存防止重复判断
                if ( matches[ sel ] === undefined ) {
                    matches[ sel ] = handleObj.needsContext ?
                        jQuery( sel, this ).index( cur ) >= 0 :
                        jQuery.find( sel, this, null, [ cur ] ).length;
                }
                //如果符合,说明cur元素需要执行这个回调,加到列表中
                if ( matches[ sel ] ) {
                    matches.push( handleObj );
                }
            }
            //如果cur元素有需要执行的回调,进行包装,加到包装后的回调对象列表中
            if ( matches.length ) {
                handlerQueue.push({ elem: cur, handlers: matches });
            }
        }
    }
}
```
真正模拟冒泡的方法，这里过滤掉了disable元素的click事件

看for循环的终止条件中，看到cur是冒泡到的当前元素，而this中存放的是触发事件的真正元素（代理元素），这里用`cur !== this`判断循环终止，说明冒泡只从被代理的元素运行到代理元素

首先我们要知道，在add时，如果使用了代理的方式，会将代理的回调函数放在回调对象列表（这里是handlers）的前面而不是后面，具体的个数会使用delegateCount记录。这里对回调对象列表中的每个回调对象，会判断元素是否符合selector选择器，如果符合，就添加回调对象到matches中。这里还用了一点小技巧缓存了判断结果。

对于冒泡路径上的每个元素，都会确定其需要执行的回调对象的列表。将元素和其需要执行的回调对象列表进行封装，成为一个新的对象，其中有elem表示冒泡的当前元素，以及handlers表明回调函数对象列表。将这些新对象组织成一个经过加工的回调对象列表。

```javascript
if ( delegateCount < handlers.length ) {
    handlerQueue.push({ elem: this, handlers: handlers.slice( delegateCount ) });
}
return handlerQueue;
```
对于不使用事件代理的情况，直接将它们按照同样的格式生成新对象后，push到经过加工的回调对象列表后面，就可以得到完整的回调函数列表了

##总结
事件管理器这块基本上包含了jq的事件机制的所有核心思想，事件代理、自定事件模拟的冒泡、特殊函数的处理，命名空间的处理等等。事件代理的冒泡机制和trigger中的冒泡需要注意理解，而特殊函数的钩子模式可以说贯穿jQuery始终。由于篇幅太长，这里并没有介绍jq的事件对象，以及一些像fix方法，这些将在下一篇进行介绍

{% endraw %}