layout: art
title: Google的HTML/CSS样式指南
subtitle: 写更简洁、更美观的HTML和CSS
categories: 
- 前端技术
tags: 
- HTML
- CSS
date: 2014/5/4
---

之前读过网易的NEC，以及百度的前端编码规范，感觉自己HTML和CSS代码写的很烂，这里又读了一下Google的style guide，发现有很多地方值得学习补充，在这里大致上翻译一下

<!-- more -->

##通用样式规范
###使用相对协议
```html
<!-- 不推荐使用 -->
<script src="http://www.google.com/js/gweb/analytics/autotrack.js"></script>

<!-- 推荐使用 -->
<script src="//www.google.com/js/gweb/analytics/autotrack.js"></script>
```

###HTML文件中一个tab两个空格
老调重弹，不要混合使用tab和空格
```html
<ul>
  <li>Fantastic
  <li>Great
</ul>

.example {
  color: blue;
}
```

###仅使用小写
所有代码应该使用小写，比如HTML元素的名称、属性、属性值（除了text/CDATA）。CSS的选择器、属性、属性值等等

```html
<!-- 不推荐使用 -->
<A HREF="/">Home</A>

<!-- 推荐使用 -->
<img src="google.png" alt="Google">
```

```css
<!-- 不推荐使用 -->
color: #E5E5E5;

<!-- 推荐使用 -->
color: #e5e5e5;
```

###不要有后缀的空格
```html
<!-- 不推荐使用 -->
<p>What?_

<!-- 推荐使用 -->
<p>Yes please.
```

###使用UTF-8编码
保证编辑器的编码字符集为UTF-8，同时在文档中添加`<meta charset="utf-8">`

###在必要的时候，在合适的地方添加注释
用注释来表明元素的范围以及它的用途

###仅使用TODO来添加todo任务

##HTML样式规范
###使用HTML5文档类型
使用`<!DOCTYPE html>`来声明文档类型，建议使用`text/html`来定义HTML文件的MIME类型，不要使用`application/xhtml+xml`来定义。在编写HTML时，空元素可以不必闭合，如`<br>`不必写成`<br/>`

###使用HTML验证器进行验证
尽量使用HTML验证器验证过的代码
```html
<!-- 不推荐使用 -->
<title>Test</title>
<article>This is only a test.

<!-- 推荐使用 -->
<!DOCTYPE html>
<meta charset="utf-8">
<title>Test</title>
<article>This is only a test.</article>
```

###根据用途使用元素
使用元素时应当根据元素的作用来选择适当的标签，`<h1>`~`<h6>`用来表示头，`<p>`元素表示段落，`<a>`元素表示超链接等等。根据用途使用元素对可访问性，重用和代码效率等有很重要的帮助
```html
<!-- 不推荐使用 -->
<div onclick="goToRecommendations();">All recommendations</div>

<!-- 推荐使用 -->
<a href="recommendations/">All recommendations</a>
```

###对于多媒体元素，提供替换文本（alt）
对于多媒体元素，像图片，视频，动画对象如canvas等等，应该为其提供有意义的替换文本（alt），同时尽可能为视频和音频提供副本（不同格式）和字幕

这同样关乎到可访问性，当盲人用户需要通过image等获得信息时，可以转而通过alt中的文字来获得信息

```html
<!-- 不推荐使用 -->
<img src="spreadsheet.png">

<!-- 推荐使用 -->
<img src="spreadsheet.png" alt="Spreadsheet screenshot.">
```

###将结构、表现、行为三者分离
严格将结构（标记），表现（样式）和行为（脚本）进行分离解耦，使他们之间相互独立

具体做法就是将HTML文档和模板中仅包含HTML，样式妨碍CSS中，而行为相关代码放在脚本中

这样更易于网页的维护和重用

```html
<!-- 不推荐使用 -->
<!DOCTYPE html>
<title>HTML sucks</title>
<link rel="stylesheet" href="base.css" media="screen">
<link rel="stylesheet" href="grid.css" media="screen">
<link rel="stylesheet" href="print.css" media="print">
<h1 style="font-size: 1em;">HTML sucks</h1>
<p>I’ve read about this on a few sites but now I’m sure:
  <u>HTML is stupid!!1</u>
<center>I can’t believe there’s no way to control the styling of
  my website without doing everything all over again!</center>
  
<!-- 推荐使用 -->
<!DOCTYPE html>
<title>My first CSS-only redesign</title>
<link rel="stylesheet" href="default.css">
<h1>My first CSS-only redesign</h1>
<p>I’ve read about this on a few sites but today I’m actually
  doing it: separating concerns and avoiding anything in the HTML of
  my website that is presentational.
<p>It’s awesome!
```

###避免引用实体
可以直接使用UTF-8等字符集中的字符替代实体，除了一些在HTML中有特殊意义的字符（如`<`和`&`）需要使用实体代替以外，尽量不要使用实体

```html
<!-- 不推荐使用 -->
The currency symbol for the Euro is &ldquo;&eur;&rdquo;.

<!-- 推荐使用 -->
The currency symbol for the Euro is “€”.
```

###省略可选标签
出于降低文档大小和代码可读性考虑，可以将可选标签省略。HTML5定义了一套[可选标签规范](http://www.whatwg.org/specs/web-apps/current-work/multipage/syntax.html#syntax-tag-omission)，标明哪些元素时可选的

```html
<!-- 不推荐使用 -->
<!DOCTYPE html>
<html>
  <head>
    <title>Spending money, spending bytes</title>
  </head>
  <body>
    <p>Sic.</p>
  </body>
</html>

<!-- 推荐使用 -->
<!DOCTYPE html>
<title>Saving money, saving bytes</title>
<p>Qed.
```

###省略样式表和脚本的type属性
```html
<!-- 不推荐使用 -->
<link rel="stylesheet" href="//www.google.com/css/maia.css"
  type="text/css">
<script src="//www.google.com/js/gweb/analytics/autotrack.js"
  type="text/javascript"></script>

<!-- 推荐使用 -->
<link rel="stylesheet" href="//www.google.com/css/maia.css">
<script src="//www.google.com/js/gweb/analytics/autotrack.js"></script>
```

###块级元素占用一行且合理缩进
每个块级元素，列表项、表格元素单独占用一行，并为每个子元素提供适当的缩进（两个空格）

```html
<!-- 推荐使用 -->
<blockquote>
  <p><em>Space</em>, the final frontier.</p>
</blockquote>
<ul>
  <li>Moe
  <li>Larry
  <li>Curly
</ul>
<table>
  <thead>
    <tr>
      <th scope="col">Income
      <th scope="col">Taxes
  <tbody>
    <tr>
      <td>$ 5.00
      <td>$ 4.50
</table>
```

###属性值使用双引号包裹
```html
<!-- 不推荐使用 -->
<a class='maia-button maia-button-secondary'>Sign in</a>

<!-- 推荐使用 -->
<a class="maia-button maia-button-secondary">Sign in</a>
```

##CSS样式规范
###使用验证过的CSS代码
除非CSS验证器有bug或需要专有语法，否则使用验证过的CSS代码

###使用有意义的ID和类命名
命名应当反映出元素的用途。详细命名规则可以看[NEC的CSS命名规则](http://nec.netease.com/standard/css-name.html)

```css
/* 不推荐使用 */
#yee-1901 {}
.button-green {}
.clear {}

/* 推荐使用 */
#gallery {}
#login {}
.video {}
.aux {}
.alt {}
```

###使用简短但不失描述性的ID和类命名
```css
/* 不推荐使用 */
#navigation {}
.atr {}

/* 推荐使用 */
#nav {}
.author {}
```

###避免在元素选择器之后使用使用ID和类选择器
```css
/* 不推荐使用 */
ul#example {}
div.error {}

/* 推荐使用 */
#example {}
.error {}
```

###尽可能对属性进行合并
很多属性（padding、margin、background、font、border等等）都是可以合并的，尽可能合并他们

```css
/* 不推荐使用 */
border-top-style: none;
font-family: palatino, georgia, serif;
font-size: 100%;
line-height: 1.6;
padding-bottom: 2em;
padding-left: 1em;
padding-right: 1em;
padding-top: 0;

/* 推荐使用 */
border-top: 0;
font: 100%/1.6 palatino, georgia, serif;
padding: 0 1em 2em;
```

###属性值为0时不要携带单位
```css
margin: 0;
padding: 0;
```

###小数的整数部分为0时，省略整数部分
```css
font-size: .8em;
```

###颜色为16进制表示时进行缩写
```css
/* 不推荐使用 */
color: #eebbcc;

/* 推荐使用 */
color: #ebc;
```

###ID和类命名添加前缀表示命名空间
同NEC的命名方式，或者通过模块名来定义前缀

##CSS格式规范
###CSS属性申明顺序
可以按照字典序进行排序，方便查找，但同一属性的不同实现声明在一起，且按照私有实现在前，W3C标准在后的顺序排列

ps：属性顺序排列有另一种说法是：定位相关（position、float、display、top、left、right、bottom、z-index等）在前，随后是盒子模型相关（width、height、padding、margin、border等等），随后是背景相关（background，background-image等等），然后是文字相关（colr，line-height、font等等），然后是一些其他属性（border-radius，opacity等等），最后是动画属性（transition、animation等）

```css
background: fuchsia;
border: 1px solid;
-moz-border-radius: 4px;
-webkit-border-radius: 4px;
border-radius: 4px;
color: black;
text-align: center;
text-indent: 2em;
```

###代码块缩进
所有申明都应该有适当的缩进，就算`@media`媒体查询也不例外
```css
@media screen, projection {

  html {
    background: #fff;
    color: #444;
  }

}
```

###所有属性之后都加上分号
虽然最后一个属性可以不加分号，但建议都加上
```css
/* 不推荐使用 */
.test {
  display: block;
  height: 100px
}

/* 推荐使用 */
.test {
  display: block;
  height: 100px;
}
```

###属性名后加上个空格
```css
/* 不推荐使用 */
h3 {
  font-weight:bold;
}

/* 推荐使用 */
h3 {
  font-weight: bold;
}
```

###选择器群组各占一行
```css
/* 不推荐使用 */
a:focus, a:active {
  position: relative; top: 1px;
}

/* 推荐使用 */
h1,
h2,
h3 {
  font-weight: normal;
  line-height: 1.2;
}
```

###在两个不同的声明中添加回车来区分
```css
html {
  background: #fff;
}

body {
  margin: auto;
  width: 50%;
}
```

###在CSS中省略引号，只在必要时候使用单引号
```css
/* 不推荐使用 */
@import url("//www.google.com/css/maia.css");

html {
  font-family: "open sans", arial, sans-serif;
}

/* 推荐使用 */
@import url(//www.google.com/css/maia.css);

html {
  font-family: 'open sans', arial, sans-serif;
}
```

###通过注释分割代码
通过注释将代码分割成多个分组，注释之后另起一行

```css
/* Header */

#adw-header {}

/* Footer */

#adw-footer {}

/* Gallery */

.adw-gallery {}
```

##总结
大致上粗略的看了一遍Google的HTML和CSS规范，概括的细节还是比较多的。从中也能看出Google对文档大小的重视，基本上都是能省则省，能用一个字符绝不用两个。其很多地方还是非常值得参考的


