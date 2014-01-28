---
layout: art
title: 使用jQuery监听DOM元素大小变化
subTitle: 使用jQuery实现
desc: 今天写页面的时候突然有这么个需求，由于父元素（一个DIV）的height是由javascript计算出来的固定的值，而在其中增加了一个多说插件，在用户评论后，子元素（DIV）的height属性增加，导致子元素溢出。但是又不知道如何为多说的评论按钮增加回调函数，于是乎就想到了根据子元素的大小变化来重新计算父元素的height。
tags: [jQuery]
categories: [前端技术]
---

###起因
今天写页面的时候突然有这么个需求，由于父元素（一个DIV）的height是由javascript计算出来的固定的值，而在其中增加了一个多说插件，在用户评论后，子元素（DIV）的height属性增加，导致子元素溢出。但是又不知道如何为多说的评论按钮增加回调函数，于是乎就想到了根据子元素的大小变化来重新计算父元素的height。

###onresize?
平常，都是在整个浏览器窗口变化时触发一个修改布局的回调函数。使用的是window对象的resize事件，利用：
```javascript
window.onresize = callback;
```
来绑定。但根据resize事件的target是```defaultView (window)```，这里详见[MDN的resize文档](https://developer.mozilla.org/en-US/docs/Web/Reference/Events/resize)，也就是说只有window对象有resize事件，于是乎就想到使用jQuery自己的事件机制来模拟一个普通元素上的resize事件

###使用jQuery事件的实现思路
可以想到一种比较简单的方式：
1. 在元素绑定resize对象时，记录元素的width和height
2. 使用requestAnimationFrame、setTimeout、setInterval，每隔一段时间查询其width和height，如果和记录的width和height不一样，运行回调函数并更新记录中的width为height

###jQuery插件
这个功能Ben Alman编写了一个jQuery插件，[这是传送门](http://benalman.com/projects/jquery-resize-plugin/)
该插件的代码（核心部分），详细代码请查看[Ben Alman博客](https://raw.github.com/cowboy/jquery-resize/v1.1/jquery.ba-resize.js)的内容：

```javascript
(function($, window, undefined) {
  var elems = $([]),
    jq_resize = $.resize = $.extend($.resize, {}),
    timeout_id,
    str_setTimeout = 'setTimeout',
    str_resize = 'resize',
    str_data = str_resize + '-special-event',
    str_delay = 'delay',
    str_throttle = 'throttleWindow';
  jq_resize[str_delay] = 250;
  jq_resize[str_throttle] = true;
  $.event.special[str_resize] = {
    setup: function() {
      if (!jq_resize[str_throttle] && this[str_setTimeout]) {
        return false;
      }
      var elem = $(this);
      elems = elems.add(elem);
      $.data(this, str_data, {
        w: elem.width(),
        h: elem.height()
      });
      if (elems.length === 1) {
        loopy();
      }
    },
    teardown: function() {
      if (!jq_resize[str_throttle] && this[str_setTimeout]) {
        return false;
      }
      var elem = $(this);
      elems = elems.not(elem);
      elem.removeData(str_data);
      if (!elems.length) {
        clearTimeout(timeout_id);
      }
    },
    add: function(handleObj) {
      if (!jq_resize[str_throttle] && this[str_setTimeout]) {
        return false;
      }
      var old_handler;
      function new_handler(e, w, h) {
        var elem = $(this),
          data = $.data(this, str_data);
        data.w = w !== undefined ? w : elem.width();
        data.h = h !== undefined ? h : elem.height();
        old_handler.apply(this, arguments);
      }
      if ($.isFunction(handleObj)) {
        old_handler = handleObj;
        return new_handler;
      } else {
        old_handler = handleObj.handler;
        handleObj.handler = new_handler;
      }
    }
  };

  function loopy() {
    timeout_id = window[str_setTimeout](function() {
      elems.each(function() {
        var elem = $(this),
          width = elem.width(),
          height = elem.height(),
          data = $.data(this, str_data);
        if (width !== data.w || height !== data.h) {
          elem.trigger(str_resize, [data.w = width, data.h = height]);
        }
      });
      loopy();
    }, jq_resize[str_delay]);
  }
})(jQuery, this);
```
jQuery为jQuery插件的开发者提供了添加自定义事件的接口，详细可以参考[jQuery官方文档](http://learn.jquery.com/events/event-extensions/)，这里就是典型的jQuery自定义事件添加方式，其中有三个钩子：
1. setup：```The setup hook is called the first time an event of a particular type is attached to an element.```首次绑定时执行，如果返回 false，使用默认方式绑定事件
2. teardown：```The teardown hook is called when the final event of a particular type is removed from an element.```若指定该方法，其在移除事件处理程序(removeEventListener)前执行，如果返回 false，移除默认绑定事件
3. add：```Each time an event handler is added to an element through an API such as .on(), jQuery calls this hook.```每一次给元素绑定事件，都会执行这个方法

setup、teardown和add三个钩子，每个钩子最先做的事都是检测是否该对象为window对象，然后根据window对象特殊处理，因为window对象本身有resize事件

从setup钩子可以看到，在初始化整个事件处理时，创建一个元素队列，队列中的每隔元素都把width和height放在data中，然后每隔250ms启动loopy函数，在loopy函数中判断是否变化，如果有变，触发回调函数并更新data中的width和height

从teardown钩子可以看到，在元素移除事件时，只需要将元素从元素队列移除，并清除元素中的data数据。如果是元素队列中的最后一个元素，则不再继续执行loopy

add钩子中，对回调函数进行了包装

由此可以看到一个简单的jQuery自定义函数的实现机制