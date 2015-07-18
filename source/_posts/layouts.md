layout: art
title: 网页布局实例
subtitle: 一些常见页面布局之我见
categories: 
- CSS
tags: 
- HTML
- CSS
date: 2014/3/5
---

最近看前端相关面试题，看到很多关于CSS布局的面试题。于是乎自己实现了几个常用的布局，这里记录一下实现。所有的布局均已上传到github

<!-- more -->

##前面的话
最近看前端相关面试题，看到很多关于CSS布局的面试题。于是乎自己实现了几个常用的布局，这里记录一下实现。所有的布局均已上传到github，命名为[sky_layouts项目](https://github.com/LingyuCoder/sky_layouts)

所有的页面都引入了一段CSS reset的代码，用于屏蔽不同浏览器之间的差异
```css
/* Style reset 消除浏览器默认样式 */
body,div,dl,dt,dd,ul,ol,li,h1,h2,h3,h4,h5,h6,pre,code,form,fieldset,legend,input,button,textarea,blockquote,th,td,p{margin:0;padding:0}input,button,select,textarea{outline:none}li{list-style:none}img{border:none}textarea{resize:none}body{color:#666;background:#fff;word-break:break-all;word-wrap:break-word;text-align:center}body,input,textarea{font-size:12px;font-family:\5b8b\4f53,Verdana,Arial}a{color:#305999;text-decoration:none;outline:none}a:hover{color:#090}.wrap{width:1000px;margin:0 auto;text-align:left;position:relative}/*clearfix*/.clearfix:after,.wrap:after{content:".";display:block;height:0;clear:both;visibility:hidden}.clearfix,.wrap{*+height:1%}
```

另外这里所有的header区、footer区的高度都为100px，侧边栏都是300px

##单栏水平居中布局（首尾全屏）
这种布局很常见，比如新浪微博的布局就是这样，header宽度为全屏，内容区宽度固定

这种布局有三部分构成:
* header区，g-hd
* main区，g-mn
* footer区，g-ft

###HTML结构
```html
<div class="g-hd">
</div>
<div class="g-mn">
</div>
<div class="g-ft">
</div>
```

###CSS样式
```css
.g-hd, .g-ft {
    height: 100px;
}
.g-mn {
    max-width: 1000px;
    margin: 0 auto
}
```
###说明
这里技巧不多，使用了一个很常见的水平居中样式```margin: 0 auto```。需要注意的是```max-width: 1000px```这个属性，这个属性时为了自适应。当浏览器窗口宽度大于1000px时，main区将以1000px的宽度居中显示。如果浏览器窗口宽度小于等于1000px时，页面的宽度将是浏览器窗口宽度
###效果
[jsfiddle地址](http://jsfiddle.net/skyinlayer/24rT2/)

<iframe width="100%" height="600" src="http://jsfiddle.net/skyinlayer/24rT2/embedded/result,html,css" allowfullscreen="allowfullscreen" frameborder="0">&nbsp;</iframe>

###浏览器兼容性
兼容ie8+和所有现代浏览器，如果设定为固定宽度，则兼容ie6

##单栏水平居中布局（全部居中）
实现思路和上面类似，不过这次把header区，main区，footer区全部放在一个容器中，然后把这个容器设定居中（记得设定max-width）

###HTML结构
```html
<div class="g-ctn">
    <div class="g-hd">
    </div>
    <div class="g-mn">
    </div>
    <div class="g-ft">
    </div>
</div>
```

###CSS样式
```css
.g-ctn { margin: 0 auto; max-width: 1000px;}
.g-hd, .g-ft {height: 100px }
```

###预览效果
[jsfiddle地址](http://jsfiddle.net/skyinlayer/24rT2/1/)

<iframe width="100%" height="600" src="http://jsfiddle.net/skyinlayer/24rT2/1/embedded/result,html,css" allowfullscreen="allowfullscreen" frameborder="0">&nbsp;</iframe>

###浏览器兼容性
兼容ie8+和所有现代浏览器，如果设定为固定宽度，则兼容ie6

##全屏两栏自适应布局
这一类布局分为4个部分：
* header区 g-hd
* footer区 g-ft
* aside区 g-sd
* main区 g-mn

这种布局一般用于应用类的页面，所有区块全部在一个屏幕中固定显示，内容溢出时使用滚动条浏览

###HTML结构
```html
<div class="g-hd">
</div>
<div class="g-sd">
</div>
<div class="g-mn">
</div>
<div class="g-ft">
</div>
```
###CSS样式
```css
html, body {height: 100%; width: 100%; }
.g-hd, .g-ft {position: absolute; width: 100%; height: 100px;  }
.g-hd {top: 0; }
.g-ft {bottom: 0; }
.g-sd, .g-mn {position: absolute; top: 100px; bottom: 100px; overflow: auto; }
.g-sd {width: 300px; }
.g-mn {left: 300px; right: 0px; }
```
###说明
这里首先需要注意```html, body {height: 100%; width: 100%; }```，这一句是常用的将页面的宽度、高度定义为浏览器窗口的大小一致。然后将四个区块全都设置为```position: absolute```绝对定位，通过设定每个区块相对于根元素的位置，来拉开区块。比如main区，相对上下都有100px的空隙，左侧300px的空隙(这里侧边栏设定为300px)，所以其css样式为```.g-mn {position: absolute; top: 100px; bottom: 100px;left: 300px;}```其他也是一样的方式。需要注意给侧边栏和内容区增加```overflow:auto```，这样在其内容溢出时，显示滚动条

###预览效果
[jsfiddle地址](http://jsfiddle.net/skyinlayer/24rT2/2/)

<iframe width="100%" height="600" src="http://jsfiddle.net/skyinlayer/24rT2/2/embedded/result,html,css" allowfullscreen="allowfullscreen" frameborder="0">&nbsp;</iframe>

###浏览器兼容性
兼容所有ie8+和现代浏览器

##全屏三栏自适应布局
这一类布局有5个部分：
* header区 g-hd
* footer区 g-ft
* main区 g-mn
* 左侧边栏 g-lsd
* 右测边栏 g-rsd

###HTML结构
```html
<div class="g-hd"></div>
<div class="g-lsd"></div>
<div class="g-mn"></div>
<div class="g-rsd"></div>
<div class="g-ft"></div>
```
###CSS样式
```css
html, body {width: 100%; height: 100%; }
.g-hd, .g-ft {height: 100px; width: 100%;}
.g-hd, .g-ft, .g-lsd, .g-rsd, .g-mn {position: absolute;} 
.g-lsd, .g-rsd, .g-mn {top: 100px;bottom: 100px;overflow: auto;}
.g-lsd, .g-rsd {width: 300px;}
.g-mn {right: 300px;left: 300px;}
.g-rsd {right: 0 }
.g-ft {bottom: 0; }
```
###说明
和上面全屏两栏自适应布局一样，首先使用```html, body {width: 100%; height: 100%; }```设定整个页面的大小为浏览器窗口大小，然后通过上例同样的方式将所有元素设定为绝对位置，通过偏移拉长区块。同时左侧边栏、内容区、右侧边栏都需要设定```overflow: auto```使得内容溢出时显示滚动条

###预览效果
[jsfiddle地址](http://jsfiddle.net/skyinlayer/24rT2/3/)

<iframe width="100%" height="600" src="http://jsfiddle.net/skyinlayer/24rT2/3/embedded/result,html,css" allowfullscreen="allowfullscreen" frameborder="0">&nbsp;</iframe>

###浏览器兼容性
兼容所有ie8+和现代浏览器

##两栏自适应布局（左侧固定，右侧自适应）
这个分四块：
* header区 g-hd
* aside区 g-sd
* main区 g-mn
* footer区 g-ft

###HTML结构
```html
<div class="g-hd"></div>
<div class="g-sd"></div>
<div class="g-mn"></div>
<div class="g-ft"></div>
```
###CSS样式
```css
.g-hd, .g-ft {height: 100px;}
.g-ft {clear: both;}
.g-sd {float: left; width: 300px; }
.g-mn {*zoom: 1; overflow: hidden; }
```
###说明
常见情况，侧边栏宽度固定，右侧内容区自适应布局。这里使BFC，设定aside区为浮动，在main区触发BFC，使得不与aside区重叠。同时由于有浮动出现，所以在footer区加上```clear:both```来清除浮动。在老式的ie中使用```zoom:1```来达到BFC的效果
###效果预览
[jsfiddle地址](http://jsfiddle.net/skyinlayer/24rT2/4/)

<iframe width="100%" height="600" src="http://jsfiddle.net/skyinlayer/24rT2/4/embedded/result,html,css" allowfullscreen="allowfullscreen" frameborder="0">&nbsp;</iframe>

###浏览器兼容
兼容ie6+及所有现代浏览器

##两栏底部自适应布局
这个分4个区块：
* header区 g-hd
* footer区 g-ft
* main区 g-mn
* aside区 g-sd

这个需求比较有意思，主要是需要footer在内容aside区、main区内容都比较少时（不满一个屏幕），显示在页面底部，而当aisde区、main区内容增多时，footer区显示在这两个区下面（高度较高的元素下面）

###HTML结构
```html
<div class="g-hd">
</div>
<div class="g-ctn">
    <div class="g-ct">
        <div class="g-sd">
        </div>
        <div class="g-mn">
        </div>
    </div>
</div>
<div class="g-ft">
</div>
```
###CSS样式
```css
html, body {width: 100%; height: 100%; }
.g-ctn {position: relative; min-height: 100%; }
    .g-ctn .g-ct {padding-top: 100px; padding-bottom: 100px; overflow: hidden; }
        .g-ctn .g-ct .g-sd {float: left; height: 600px; width: 300px; }
        .g-ctn .g-ct .g-mn {height: 600px; overflow: hidden; zoom:1; }
.g-hd {height: 100px; margin-bottom: -100px; }
.g-ft {height:100px; margin-top: -100px; }
```
###说明
首先需要设定html的高度为一个页面以方便将一个div（g-ctn）设定为最小大小为浏览器窗口大小。然后针对这个g-ctn，header区（g-hd）和footer区（g-ft），利用负margin来将他们定位到g-ctn里面，这样g-ctn的大小就是整个页面了。然后在g-ctn中顶一个一个div（g-ct），为其设定```padding-top```和```padding-bottom```来防止内容区和header区与footer区重叠。然后在这个区块触发BFC，来清除子元素浮动，清除aside区（g-sd）的浮动。在里面放入aside区和main区，将aside区设为```float: left```，在main区上触发BFC，防止其余aside区重叠。这样布局就完成了
###预览效果
[jsfiddle地址](http://jsfiddle.net/skyinlayer/24rT2/5/)

<iframe width="100%" height="600" src="http://jsfiddle.net/skyinlayer/24rT2/5/embedded/result,html,css" allowfullscreen="allowfullscreen" frameborder="0">&nbsp;</iframe>

###浏览器兼容性
兼容ie6+和所有现代浏览器

##三栏底部自适应布局
这个布局分5块：
* header区 g-hd
* footer区 g-ft
* main区 g-mn
* 左边栏区 g-lsd
* 右边栏区 g-rsd

###HTML结构
```html
<div class="g-hd"></div>
<div class="g-ctn">
    <div class="g-ct">
        <div class="g-lsd">
        </div>
        <div class="g-rsd">
        </div>
        <div class="g-mn">
        </div>
    </div>
</div>
<div class="g-ft"></div>
```

###CSS样式
```css
html, body {width: 100%; height: 100%; }
.g-hd {margin-bottom: -100px; height: 100px; }
.g-ft {margin-top: -100px; height: 100px; }
.g-ctn {position: relative; min-height: 100%; }
    .g-ctn .g-ct {padding: 100px 0; overflow: hidden; *zoom: 1; }
        .g-ctn .g-ct .g-lsd {width: 300px; float: left; }
        .g-ctn .g-ct .g-rsd {width: 300px; float: right; }
        .g-ctn .g-ct .g-mn {overflow: hidden; *zoom: 1; }
```

###说明
和上面底部两栏自适应几乎一样，不过这一次分为左边栏和右边栏，所以需要注意一下，把两个侧边栏写在前面，后面写main区，否则会出现main区直接把右边栏挤开的情况

###预览效果
[jsfiddle地址](http://jsfiddle.net/skyinlayer/24rT2/6/)

<iframe width="100%" height="600" src="http://jsfiddle.net/skyinlayer/24rT2/6/embedded/result,html,css" allowfullscreen="allowfullscreen" frameborder="0">&nbsp;</iframe>

##总结
还有很多很多的布局没有实现，有时间实现一些其他的布局，布局前端面试还是问的很多的，手动实现了一下发现，还是需要动手的，否则直接问真心不一定能答上来



