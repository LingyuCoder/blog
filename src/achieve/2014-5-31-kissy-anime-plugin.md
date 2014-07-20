---
layout: art
title: 如何写一个KISSY动画插件
subTitle: 一个小作业
desc: 最近写东西写的比较少，并不代表我一直在划水。之前阿里的前辈布置了三个作业，其中一个就是基于KISSY写一个动画插件
categories: [前端技术]
tags: [HTML, CSS, JavaScript, Kissy, 动画]
---
{% raw %}
最近写东西写的比较少，并不代表我一直在划水。之前阿里的前辈布置了三个作业，其中一个就是基于KISSY写一个动画插件。事实上，KISSY已经有自己的动画模块，叫做[anim](http://docs.kissyui.com/1.4/docs/html/api/anim/index.html)，这里前辈的意思就是让我再造一个轮子，[DEMO页面](http://lingyucoder.github.io/kissy-anime-plugin/)，[Github页面](https://github.com/LingyuCoder/kissy-anime-plugin)

目前已经有很多比较优秀的JavaScript动画实现了，比如[Tween.js](https://github.com/sole/tween.js/)，jQuery中的animate就是在Tween的基础上做了一层封装（2.0版本是Tween，老版本的jQuery则是自己实现的动画）。这里多多少少参照了优秀动画模块的思想和内容（比如缓动函数）。

##CSS与JavaScript动画对比
首先需要确定为什么要开发JavaScript的动画模块，毕竟现在已经有CSS3动画了。这里先对比一下CSS动画和JavaScript动画的区别，并从中提炼出我们需要的信息

###CSS动画
####animation
CSS3新增了一个`animation`属性，可以定义动画，相关的属性如下：
1. animation-name：动画的名称，也就是定义的keyframes关键帧的名称
2. animation-duration：一次动画的时长
3. animation-timing-funciton：缓动函数，这个后面会有详细介绍
4. animation-delay：动画延迟时间
5. animation-iteration-count：动画的播放次数
6. animation-direction：动画时正向播放还是倒着播放
7. animation-play-state：动画的状态，暂停还是播放
8. animation-fill-mode：动画播放时间之外的状态，是否重回动画初始
9. animation：复合属性，上面属性合在一起的写法

可以看到，这里定义了一个动画的整体属性，但并没有定义具体的样式改变。这个任务交给了`keyframes`去做。也即是说，`animation`不会单独存在，它总是通过`animation-name`关联到某个`keyframes`，这是一个多对一的关系。在`keyframes`中，具体定义了这个动画哪些样式需要改变，改变多少。

####transition
另外，还有一个`transition`属性，可以定义过渡效果，相关属性如下：
1. transition-property：需要参与过渡的属性
2. transition-duration 过渡的时长
3. transition-timing-function：过渡的缓动函数
4. transition-delay：过渡的延时

`transtion`定义的是过渡效果，所谓过渡，就是当某个样式改变时，浏览器不会立即赋予这个改变后的值，而是从初始值逐渐改变，平滑的转变成改变后的值。这样也能形成很优秀的动画效果。同时不需要与`keyframes`结合，可以自己独立存在。

####优缺点
先来说说优点，CSS3的动画的效率要比JavaScript要高，这不是通过优化JavaScript代码就能逆转的。由于CSS3动画作为浏览器渲染引擎实现的一部分，相对于JavaScript动画而言，省去了JavaScript部分，直接由底层语言实现，并且其内部可由浏览器做一系列相关的优化。比如webkit，它可以专门为动画元素创建一个图层，然后将这个元素的样式转变在主线程之外运行。

但是，CSS3动画缺乏足够的控制能力，同时，如果我们动画改变的不是CSS属性（比如滚动，这也是视差滚动必须通过JavaScript实现的原因），CSS3的动画就没辙了。另外，其浏览器的兼容性也是很大问题。毕竟IE从9开始才逐渐开始实现CSS3，如果要在IE6~8中做动画效果，就得另寻他法了

另外，[这里](http://lingyu.wang/#/item)有我曾经写过的一些CSS3动画效果

###JavaScript动画
JavaScript的动画，说白了就是每隔一小段时间修改元素的CSS样式。这个间隔时间一般是1000/60ms，也就是说，每秒钟该60次，达到一秒60帧的效果。每次修改，大致需要经过如下流程：
1. 计算当前元素样式
2. 修改元素样式
3. 重绘元素

前两部都是通过JavaScript完成，这也意味着，它不精确。如我们所知，JavaScript的定时函数`setTimeout`和`setInterval`本来就不是很精确（现在可以使用requestAnimationFrame，但老版本IE不兼容），而JavaScript运行在主线程——UI线程上，上面运行的其他任务（样式计算、布局、绘制、其他JavaScript代码等）都可能造成线程的阻塞。这也是JavaScript动画的最大弊病。

但JavaScript本身，拥有强大的控制能力，它可以随心所欲的控制动画，开始、暂停、倒放、中止、回放、单帧等等，这些JavaScript都能搞定。而像CSS动画无法做的滚动效果，JavaScript也可以轻松实现。而且，我们可以将动画扩展到IE 6~8上（当然transform还是不兼容）。

##需求分析
###动画属性
通过参考CSS动画实现，我们也可以很容易的确定，通过实现JavaScript实现动画时，动画应该具备的属性：
1. 涉及的元素（elems）
2. 需要改变的样式（styles）
3. 时长（duration）
4. 缓动函数（easing-function）
5. 播放次数（times）

###动画控制
而控制上，我们应该实现的功能：
1. 开始（run）
2. 暂停（pause）
3. 暂停恢复（resume）
4. 中止（stop）
5. 倒放（reverse）
6. 单帧（go）

###动画能够改变的内容
需要能够改变的内容有：
1. CSS样式
2. 滚动


##动画对象
如之前所说，JavaScript动画，实际上就是每隔一小段时间改变元素的样式。我们可以把动画看做一个对象，其内部有这个动画相关的元素、动画的属性，并提供一系列的接口控制这个动画

所以，动画的对象大致上是这样：
```javascript
function Anime(){}
Anime.prototype.run = function(){};
Anime.prototype.pause = function(){};
Anime.prototype.resume = function(){};
Anime.prototype.stop = function(){};
Anime.prototype.go = function(){};
```

而倒放是事先定义好的，我们可以作为动画属性传入

动画最终要的，就是参与动画的元素，和需要被改变的样式及其目标值。这两者，我们是没办法通过给默认值的形式来省略的。其他的，我们可以通过给一些默认值来简化API，所以将接口设计成如下：

```javascript
function Anime(elems, styles, config){}
```
conifg是一个对象，剩下的可选属性都在其中定义，通过mixin的方式加入到动画对象中，还可以提供一些默认值：
```javascript
var defaultConfig = {
    callback: noop,
    duration: 1500,
    reverse: false,
    easing: "linear",
    times: 1,
    spend: 0,
    state: "running"
};
```

这里还加了一些其他属性，比如spend和state，spend实际上就是当前动画运行了多长时间，state则是动画对象当前的状态，是播放中（running），还是暂停（paused），还是结束（ended）。state结合控制来做的话，就是一个状态机：
* running为初始状态，可以通过pause方法，转到paused状态，也可以通过stop方法，转到ended状态
* paused为暂停状态，通过resume方法，转到running状态，也可以通过stop转到ended状态
* ended为终止状态，可以通过run放法进行重放，转到running状态

##动画队列
光有动画对象是不够的，我们需要对所有的动画对象进行处理，获取其中running状态的对象，每隔一小段时间，修改其状态，并绘制到页面上。这里就需要一个动画队列了，实际上也就是一个数组，里面的每个元素都是状态为running的动画对象。每隔1000/60ms就遍历一遍这个数组，更新每一个动画对象的状态，并进行绘制。

需要注意的地方是，队列中只有running状态的对象，也就是说，如果队列中没有元素，那么就不需要每隔一段时间去遍历了。另外，如果有动画运行结束，变成不是running状态，那么需要从动画队列中移除

所以，队列首先得实现相关的添加删除操作，注意去重：
```javascript
var animeQueue = [];

function addAnime(anime) {
    if (S.indexOf(anime, animeQueue) === -1) {
        animeQueue.push(anime);
        checkRunning();
    }
}

function deleteAnime(anime) {
    var index = S.indexOf(anime, animeQueue);
    if (index >= 0) {
        animeQueue.splice(index, 1);
        checkRunning();
    }
}
```

然后，还有一个心跳函数，用于每隔一段时间遍历动画队列：
```javascript
function pulse() {
    var deleteIndex = [],
        i, m, tmp;
    if (running) {
        S.each(animeQueue, function(anime, index) {
            if (anime.state === "running") {
                anime.go();
            } else {
                deleteIndex.push(index);
            }
        });
        for (i = deleteIndex.length; i--;) {
            animeQueue.splice(deleteIndex[i], 1);
        }
        dealing = false;
        checkRunning();
    }
}
```
checkRunning函数，来决定下一帧，是否需要运行，如果队列中没有动画对象了，自然不需要运行了，否则就要继续遍历动画队列：
```javascript
function checkRunning() {
    if (animeQueue.length > 0) {
        running = true;
        if (!dealing) {
            dealing = true;
            requestAnimationFrame(pulse);
        }
    } else {
        running = false;
        dealing = false;
    }
}
```

##缓动函数
缓动函数的说明和教程网上还是比较多的，说白了就是一个进度的映射。一般都是使用一些现有的缓动函数，我直接从Tween中把它的缓动函数扒了出来...

##样式处理
动画可以理解为三个问题，从什么地方开始，经过什么样的过程，到什么地方去。我们可以通过构建动画对象时传入的styles来确定需要修改的样式，以及样式动画最终的目标值。这个目标值可以是绝对的，比如`width: 400px`，就是要修改宽度到400像素，但也可以相对的，比如`width: +=200px`，在原有基础上增大200像素的宽度。我们需要确定元素样式的起始值、绝对的目标值，才能算出某个时间点的中间值，并将中间值赋予给元素。所以，样式的处理应该包括四个部分：
1. 从元素获取样式的起始值（从什么地方开始）
2. 获取样式的绝对目标值，如果传入的是相对值，那么需要通过起始值来计算的处绝对目标值（到什么地方去）
3. 计算当前时间点的中间值（经过怎样的过程）
4. 向元素赋予计算出来的中间值（经过怎样的过程）

后两个一个是计算，一个是展示，都属于过程内容。可以把这四个部分抽象成四个方法，分别是获取、解析、计算、赋值：
```javascript
function getCSS(elem, style) {
    var val;
    if (hooks[style] && hooks[style].get) {
        val = hooks[style].get(elem, style);
    } else {
        val = hooks._default.get(elem, style);
    }
    return parseCSS(val, style);
}

function parseCSS(val, style, from) {
    if (hooks[style] && hooks[style].parse) {
        return hooks[style].parse(val, from);
    }
    return hooks._default.parse(val, from);
}

function computeCSS(style, from, to, pos) {
    if (hooks[style] && hooks[style].compute) {
        return hooks[style].compute(from, to, pos);
    }
    return hooks._default.compute(from, to, pos);

}

function assignCSS(elem, style, val) {
    if (hooks[style] && hooks[style].assign) {
        return hooks[style].assign(elem, style, val);
    }
    return hooks._default.assign(elem, style, val);
}
```

这里，可以看到很多hooks，阅读过jQuery源码的不会对这种方式陌生。钩子是为特别样式提供特别处理，如果不需要通过钩子进行处理，直接使用\_default提供的默认处理方式就行了


##特殊处理
一般的属性，可以通过`Dom.css`很轻松的获取起始值并计算出绝对目标值，但有一些则不然，这里列三个特例
###颜色属性
如color、background等，这些我们应该为其提供渐变，但无论是用户传入的目标值，还是获取到的值，都有好几个形式：
1. HEX：`#fff`或`#f0f0f0`
2. RGB：`rgb(245, 28, 33)`
3. RGBA：`rgba(245, 28, 33, .6)`
4. 直接名称：`red`、`white`等等
5. HSL和HSLA，这里不做实现

####获取
获取和一般CSS属性没差， 直接使用默认方式了


####解析
一般，是统一将其解析成RGBA的形式来做，如果不支持RGBA的浏览器，解析成RGB。这样我们就拥有了两个三个元素（RGB）或四个元素的数组（RGBA），一个数组为起始值，一个数组为目标值

```javascript
function parseColor(val) {
    val = val.replace(rClearSpace, "").toLowerCase();
    if (normalColors[val]) {
        return normalColors[val];
    }
    var color = [];
    var tmp;
    var i;
    if (rHexColor.test(val)) {
        tmp = [];
        if (val.length === 4) {
            for (i = 3; i--;) {
                tmp[i] = val.charAt(i + 1);
                tmp[i] += tmp[i];
            }
        } else if (val.length === 7) {
            for (i = 3; i--;) {
                tmp[i] = val.substr(1 + i * 2, 2);
            }
        }
        for (i = 3; i--;) {
            color[i] = parseInt(tmp[i], 16);
        }
        color[3] = 1;
    } else if (!S.isNull(tmp = val.match(rRGB))) {
        for (i = 3; i--;) {
            color[i] = parseInt(tmp[i + 1], 10);
        }
        color[3] = 1;
    } else if (!S.isNull(tmp = val.match(rRGBA))) {
        for (i = 4; i--;) {
            color[i] = Number(tmp[i + 1]);
        }
    }
    return color;
}
```

####计算
计算中间值的过程则是对颜色数组中的每一个元素（R或G或B或A）计算一下中间值就行了
```javascript
function computeColor(from, to, pos) {
    var _default = hooks._default,
        result = [],
        i;
    for (i = 0; i <= 2; i++) {
        result.push(parseInt(_default.compute(from[i], to[i], pos), 10));
    }
    result.push(_default.compute(from[3], to[3], pos));
    return result;
}
```

####赋值
赋值的时候，我们需要将数组恢复成CSS中的方式，也就是恢复成RGB或RGBA的方式
```javascript
function assignColor(elem, style, val) {
    if(KISSY.Features.isIELessThan(9)){
        Dom.css(elem, style, "rgb(" + val.slice(0, 3).join(",") + ")");
    } else {
        Dom.css(elem, style, "rgba(" + val.join(",") + ")");
    }
}
```

###滚动
####获取
滚动并不属于CSS属性，但我们经常会使用，比如滚动到页首。KISSY本身提供了包装，可以获取当前滚动的高度

####解析
通过KISSY获取的滚动属性值无需解析，可以使用默认解析

####计算
计算过程也是，使用默认计算即可

####赋值
赋值过程就和一般的CSS属性不一样了，使用KISSY提供的接口进行赋值

```javascript
S.each("scrollTop scrollLeft".split(" "), function(type) {
    var _default = hooks._default;
    hooks[type] = {
        assign: function(elem, style, val) {
            Dom[type](elem, val);
        },
        get: function(elem, style) {
            return Dom[type](elem);
        }
    };
});
```


###transform
**这里只处理了2D的transform**

transform的值也有很多不同的形式：
1. matrix
2. rotate
3. translate、translateX、translateY
4. scale、scaleX、scaleY
5. skew、skewX、skewY

####获取
获取的过程和一般CSS元素获取的过程没有差别，使用默认的方式就好

####解析
这里就比较麻烦了，需要处理所有的情况，我们将所有的情况转变成如下的结构：
```javascript
var result = {
    translateX: 0,
    translateY: 0,
    rotate: 0,
    skewX: 0,
    skewY: 0,
    scaleX: 1,
    scaleY: 1
};
```

代码较长

```javascript
function decomposeMatrix(matrix) {
    var scaleX, scaleY, skew,
        A = matrix[0],
        B = matrix[1],
        C = matrix[2],
        D = matrix[3];

    // Make sure matrix is not singular
    if (A * D - B * C) {
        scaleX = Math.sqrt(A * A + B * B);
        skew = (A * C + B * D) / (A * D - C * B);
        scaleY = (A * D - B * C) / scaleX;
        // step (6)
        if (A * D < B * C) {
            skew = -skew;
            scaleX = -scaleX;
        }
        // matrix is singular and cannot be interpolated
    } else {
        // In this case the elem shouldn't be rendered, hence scale == 0
        scaleX = scaleY = skew = 0;
    }

    // The recomposition order is very important
    // see http://hg.mozilla.org/mozilla-central/file/7cb3e9795d04/layout/style/nsStyleAnimation.cpp#l971
    return {
        translateX: myParse(matrix[4]),
        translateY: myParse(matrix[5]),
        rotate: myParse(Math.atan2(B, A) * 180 / Math.PI),
        skewX: myParse(Math.atan(skew) * 180 / Math.PI),
        skewY: 0,
        scaleX: myParse(scaleX),
        scaleY: myParse(scaleY)
    };
}

function valueStringToArray(val) {
    var result = val.split(",");
    result = S.map(result, function(value) {
        return myParse(value);
    });
    return result;
}

function parseTransform(val) {
    var result = {
        translateX: 0,
        translateY: 0,
        rotate: 0,
        skewX: 0,
        skewY: 0,
        scaleX: 1,
        scaleY: 1
    };
    var value;
    var regResult;
    var i, j, m;
    var name;
    var strs;
    strs = val.replace(rClearSpace, "").split(")");
    for (i = 0, m = strs.length; i < m; i++) {
        if (!strs[i] || strs[i] === "none") continue;
        regResult = strs[i].split("(");
        name = regResult[0];
        value = valueStringToArray(regResult[1]);
        switch (name) {
            case "matrix":
                result = decomposeMatrix(value);
                break;
            case "translate":
            case "skew":
                result[name + "X"] = value[0] || 0;
                result[name + "Y"] = value[1] || 0;
                break;
            case "scale":
                result[name + "X"] = value[0] || 0;
                result[name + "Y"] = value[1] || result[name + "X"];
                break;
            case "translateX":
            case "translateY":
            case "scaleX":
            case "scaleY":
            case "skewX":
            case "skewY":
            case "rotate":
                result[name] = value[0] || 0;
                break;
            default:
                continue;
        }
    }
    return result;
}
```
这其中decomposeMatrix函数来自KISSY，将matrix转换成变换属性的形式。


####计算
获取到上面的结构后，只需要对其中的每一项计算中间值就可以了

```javascript
function computeTransform(from, to, pos) {
    var _default = hooks._default;
    var result = {};
    S.each(to, function(value, key) {
        result[key] = _default.compute(from[key], to[key], pos);
    });
    return result;
}
```

###赋值
赋值也是一样，将上面的结构一一提取合并，组成一个字符串，另外需要注意添加上相应的单位：
```javascript
function assignTransform(elem, style, val) {
    var valueArray = [];
    S.each(val, function(value, key) {
        if ((key.indexOf("scale") > -1 && value === 1) || (key.indexOf("scale") === -1 && value === 0)) {
            return;
        }
        if (key === "rotate" || key.indexOf("skew") > -1) {
            value += "deg";
        } else if (key.indexOf("translate") > -1) {
            value += "px";
        }
        valueArray.push(key + "(" + value + ")");
    });
    Dom.css(elem, style, valueArray.join(" "));
}
```

##总结
这是一次造轮子实验，效果还是出来了，基本的动画都能完成，且兼容IE 6，transform部分兼容到IE 9，虽然不可能直接替代KISSY的anim模块，但用起来也不算差，毕竟兼容问题都让KISSY去做了。毕竟这只是个作业，中间搞搞停停弄了3天，之后就是写DEMO之类的。后面打算优化一下代码

{% endraw %}