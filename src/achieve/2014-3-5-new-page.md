---
layout: art
title: 博客换页面了
subTitle: 记录一下重写博客页面的过程
desc: 上一篇文章是2月28日，今天这篇3月5日才写。中间隔了这么久，两天一篇的计划又被抛弃了。得加紧赶上了。这段时间还是做了点事的，不过没有记录上。
categories: [前端技术]
tags: [HTML, CSS]
---
{% raw %}
上一篇文章是2月28日，今天这篇3月5日才写。中间隔了这么久，两天一篇的计划又被抛弃了。得加紧赶上了。这段时间还是做了点事的，不过没有记录上。

##起因
如果之前看过这个博客的人一定会发现，整个页面焕然一新了。之前用的是html5up-striped的模板。虽然浏览器兼容性很好，但无论是背景纹理的图片大小还是为了那兼容性所使用的响应式库的大小都让这个搭载在github上的博客肝颤（背景纹理两张分别为60k+，skelton的js有41k+还有50k+的CSS以及好几百K的字体...）。加载速度简直让我这种强迫症患者有种砸电脑的感觉。同时使用别人的代码，自己也不好修改，不好扩展，不好发挥。于是乎就决定自己写一个响应式的页面出来。这个页面就出来了。

##参考
这个页面是参考了[CSS禅意花园的220号作品](http://www.csszengarden.com/220//)。不过CSS文件并不是照搬他的，都是自己重写的（压缩后的大小8KB）。不过用了它的两个图片（都很小，2.79K+1.77K）。之前也是使用了禅意花园上的那种“文字配合mask-image”的形式，后来发现除了Chrome都不兼容（我勒个血槽，连FF都不兼容）于是乎就转而去网上寻找纹理。在一个非常不错的纹理网站[Subtle Patterns](http://subtlepatterns.com/) 上找到了两个纹理，分别作为博客中的背景以及文章中代码块的背景（一个113B，一个128B，注意是B不是KB），简直爽歪歪。瞬间感觉之前的60K的背景纹理就是渣渣啊。于是乎就剩jQuery比较大了，但是jQuery可以放在CDN上，这里使用的是百度提供的CDN（速度杠杠的，400ms）。如果后续有时间，我会抛弃jQuery，重写博客中的JS部分，这样就更快了（其实压根就没有几行js代码）

##设计
这个页面的设计也是[响应式设计](http://lingyu.wang#/art/blog/2014/02/14/responsive-web-design/)的[移动先行策略](http://lingyu.wang#/art/blog/2014/02/25/design-strategies/)的产物。贯彻其从小到大的方针。
###小视口出发
从小型视口出发（这里我定义的小型视口是宽度小于768px的视口，准确来说是48em，font-size为初始的16px，为什么呢，因为我的ipad mini竖屏分辨率是768...）。定义了一套布局，最上面是header，里面有主要导航条，下面是内容，再下面是一些其他链接（以后成为侧边栏），再下面是footer

于是乎格式就变成了html文档大概就会变成这个样子：
```html
<body>
    <div class="wrapper">
        <header class="header">
            <div class="banner"></div>
            <nav></nav>
        </article>
        </header>
        <div class="content">
            <article class="post">
                <header></header>
                <div class="main"></div>
                <a class="to-detail" href="#"></a>
                <div class="tags"></div>
            </article>
        </div>
        <aside class="aside">
            <section class="recent">
                <h3></h3>
                <div class="inner"></div>
            </section>
        </aside>
        <footer class="footer">
        </footer>
    </div>
</body>
```
这里先用了几个语义化元素，header、nav、section、footer、article还有aside。另外我喜欢用一个wrapper包裹所有内容，方便以后有需要的时候布局

其中article的内容从上到下排布就好，所以我这里设定了```<a class="to-detail" href="#"></a>```为```display:block```，其他在结构上基本上保持了原样

小视口设备上的绝大部分内容都是很直观的显示的，也不用谈太多的布局，把一些基础的展现效果的css加进去就好，主要就是控制h1~h6的文字大小（上下margin），文字颜色，背景颜色等等

大致上达到的效果：

###中视口的扩展
中视口设备基本上和小视口设备差不多，我这里只不过在aside里面的内容作了一些变化，同时在主页上拉出一个侧边栏用于显示“查看详细”按钮

这样就需要添加一些布局进去了，这里都采用了很简单的布局，基本上就是float+BFC，保证浮动元素与非浮动元素不重叠

于是乎简单的布局代码如下
```css
@media screen and (min-width: 48em) {
    .content .post .to-detail {width: 18%; overflow: hidden}
    .content .post .main {float:left;width: 80%; }
    .content .post .tags {clear:both}
    
    .aside section h3 {float:left; width: 30%;}
    .aside section .inner {overflow: hidden;}
    .aside section:after {content: ""; display: block; height: 0; visibility: hidden; clear: both; }
}
```
大致上说一下，设定了float的元素一般会与不设定float的元素重叠，但如果不设定float的元素触发了BFC，就不会了，于是乎这里使用```overflow:hidden```触发BFC，同时由于有浮动元素的存在，需要清除浮动，如果后面有元素，在后面元素上加上```clear:both```就可以了。如果后面没有元素，那就在父元素上加入一个```::after```伪元素，里面设定清除浮动，代码如上所示

这样中视口的布局效果就搞定了，还可以加上一些额外的效果，比如修改一下h1~h6的文字大小和margin，修改一下导航条内元素的间距之类的

###大视口的变革
中视口和小视口终究还是一栏布局（中视口虽然拉出了一列仅显示“查看详细”按钮，但本质上还是一栏布局）。到了大视口（我这里定义的大视口是大于等于1024px，也就是64em的视口，为什么呢？因为我的ipadmini 横屏是1024px），边栏应该拉出来，放在屏幕的左边，内容在右边，同时footer应该还在最下面

还是用之前类似的方式，核心CSS如下：
```css
@media screen and (min-width: 64em) {
    .content {float:right;}
    .aside {overflow: hidden}
    .footer {clear:both}
}
```
这样布局修改就完成了，再加上一些CSS3的animation特效，齐活

##总结
响应式页面设计还是很有意思的，逐步向上扩展，需要很明确的将各个部分划分成一块一块，方便日后响应式布局，新的页面虽然丑了点，但是还能看，有点小清新的感觉（笑），关键是加载的大小降低了很多。至于浏览器的兼容性问题，我只是兼容了比较主流的浏览器，没有兼容ie6-8这些坑货，不过无所谓了，能兼容ie9+，Chrome和Firefox、opera我就满足了，毕竟ie8压根就不支持CSS3的media queries

{% endraw %}