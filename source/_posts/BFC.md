layout: art
title: 深入浅出BFC（Block formatting contexts）
subtitle: 什么是BFC？它如何出现、又干了些什么？
tags: 
- CSS
categories: 
- CSS
date: 2014/2/26
---

BFC（Block formatting contexts）,是W3C CSS 2.1中的一个概念，决定了元素如何对其内容进行定位，以及与其他元素的关系和相互作用。在创建了BFC的元素中，子元素会一个接一个的被放置...

<!-- more -->

##何为BFC
BFC（Block formatting contexts）,是W3C CSS 2.1中的一个概念，决定了元素如何对其内容进行定位，以及与其他元素的关系和相互作用。在创建了BFC的元素中，子元素会一个接一个的被放置。垂直方向上，他们的起点是一个包含块的顶部，两个相邻元素之间的垂直距离取决于```margin```特性。BFC中相邻的块级元素的垂直边距(```margin-top```和```margin-bottom```)会被折叠（collapse）。在BFC中，每一个元素的左边与包含块的左边（```border-left```）相接触（如果从右到左的格式化，右边接触包含块的```border-right```），除非这个元素也创建了一个BFC。

##触发BFC
满足以下任意一个情况就会触发BFC：
* 根节点
* 浮动（```float```不为```none```）
* 绝对定位元素（```position```为```absolute```或```fixed```）
* ```display: inline-block```的元素
* ```display: table-cell```的元素（HTML的table格子默认就是这个）
* ```display: table-caption```的元素(HTML的table caption默认就是这个)
* ```overflow```不为```visible```的元素
* 伸缩盒元素（```display```为```flex```或```inline-flex```）

##BFC的作用
BFC的主要知识点在清除浮动重叠与margin重叠上，margin重叠有如下规则：
* 两个相邻的外边距都是正数时，折叠结果是它们两者之间较大的值
* 两个相邻的外边距都是负数时，折叠结果是两者绝对值的较大值
* 两个外边距一正一负时，折叠结果是两者的相加的和

###BFC清除嵌套元素的margin重叠
如果父元素不触发BFC，
```html
<div class="outer">
	<div class="inner"></div>
</div>
```
CSS代码如下：
```css
.outer {
	background-color: #f0f0f0;
	width: 100%;
	margin-top: 50px;
}
	.outer .inner {
		width: 100px;
		height: 100px;
		margin-top: 50px;
		background-color: blue;
	}
```

效果图：

![不触发BFC时垂直margin重叠](/img/BFC/1.png)

可以看到，子元素inner和父元素outer的```margin-top```重叠了

在outer上触发BFC，修改CSS：
```css
.outer {
	background-color: #f0f0f0;
	width: 100%;
	margin-top: 50px;
	overflow: hidden;
}
	.outer .inner {
		width: 100px;
		height: 100px;
		margin-top: 50px;
		background-color: blue;
	}
```

效果图：
![触发BFC后垂直margin不重叠](/img/BFC/2.png)

在触发了父元素的BFC，于是乎margin不再重叠

###不与浮动元素重叠
```html
<div class="outer">
	<div class="left"></div>
	<div class="top"></div>
</div>
```
```css
.outer {
	background-color: #f0f0f0;
	width: 100%;
}
	.outer .left {
		width: 100px;
		height: 200px;
		background-color: blue;
		float: left;
	}

	.outer .top {
		width: 200px;
		height: 100px;
		background-color: red;
	}
```

效果图：

![两个矩形重叠](/img/BFC/3.png)

![检索left元素](/img/BFC/4.png)

![检索top元素](/img/BFC/5.png)

可以从上面三张图看到，两个长方形被重叠了

在非浮动元素（top）上触发BFC，修改CSS:
```css
.outer {
	background-color: #f0f0f0;
	width: 100%;
}
	.outer .left {
		width: 100px;
		height: 200px;
		background-color: blue;
		float: left;
	}

	.outer .top {
		width: 200px;
		height: 100px;
		background-color: red;
		overflow:hidden;
	}
```

效果图：

![浮动元素与非浮动元素不再重叠](/img/BFC/6.png)

两个矩形不再重叠，不过需要注意在非浮动元素上触发BFC

###清除元素内部浮动
```html
<div class="outer">
	<div class="left"></div>
	<div class="right"></div>
</div>
```

```css
.outer {
	background-color: #f0f0f0;
	width: 100%;
}
	.outer .left {
		width: 100px;
		height: 100px;
		background-color: blue;
		float: left;
	}

	.outer .right {
		width: 100px;
		height: 100px;
		background-color: red;
		float: right;
	}
```
效果图：

![outer没有被浮动元素撑开](/img/BFC/7.png)

可以看到，outer并没有被撑开，查看元素发现其高度为0px

修改css在outer上触发BFC：
```
.outer {
	background-color: #f0f0f0;
	width: 100%;
	overflow: hidden;
}
	.outer .left {
		width: 100px;
		height: 100px;
		background-color: blue;
		float: left;
	}

	.outer .right {
		width: 100px;
		height: 100px;
		background-color: red;
		float: right;
	}
```
效果图：

![触发BFC后outer被浮动元素撑开](/img/BFC/8.png)

在outer上触发BFC后可以看到，outer的高度变成了100px，被left和right两个浮动元素撑开了

##参考文献

[Block formatting context](https://developer.mozilla.org/en-US/docs/Web/Guide/CSS/Block_formatting_context)







