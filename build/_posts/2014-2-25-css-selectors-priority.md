---
layout: art
title: CSS优先级备忘
subTitle: 记录CSS优先级计算的规则，再也不用害怕面试官问了
desc: 
tags: [css]
categories: [前端技术]
---
{% raw %}
##常规优先级计算
一个选择器的优先级是由如下方式计算的：
* 通配符（```*```）的权重为0
* 元素选择器(```div```)、伪元素(```::before```)的权重为1
* 类型选择器(```.className```)、属性选择器(```[someAttr=someValue]```)、伪类选择器(```:hover```)的权重为10
* id选择器（```#```）的权重为100
* 内联样式（HTML中的```style="blahblah"```）为1000
* 如果权重一样，后声明的优先

需要注意的是这里的10、100、1000并不是十进制的，进制数很大，在W3C上的原话： Concatenating the three numbers a-b-c (in a number system with a large base) gives the specificity.

确定伪元素有哪些：
* first-letter
* first-line
* before
* after

确伪类有哪些：
* active
* focus
* hover
* link
* visited
* first-child
* lang

需要注意的是伪类和伪元素的差别，伪类的优先级要高于伪元素。伪元素一般使用```::first-letter```，前面两个冒号，而伪类只有一个。但目前已知处于相互混淆的状态。用一个也是可以的。同时很多人将```::before```和```::after```也一起称为伪类，更加混淆了伪类和伪元素。虽然平常使用的时候差别并不大，但在计算优先级权重的时候还是有差别的，需要注意。

##特殊规则
###!important永远覆盖其他
当!important规则被用在一个样式声明中，这个样式声明会覆盖任何其他声明，无论在声明列表的那个位置，与优先级无关

如下例所示：
```html
<div class="outer" style="color:red">
    <p>这是outer中的一段文字</p>
</div>
```

然后加上outer类的样式：
```css
.outer {
    color: green !important;
}
```
最终结果:

![结果](/img/selector_priority/1.png)

可见!important凌驾于一切之上

###:not伪类的优先级为0
需要注意的是伪类的优先级为0，比如如下例子：
```html
<div class="outer">
    <p>这是outer中的文本，不属于inner</p>
    <div class="inner">
        <p>这是inner中的文本</p>
    </div>
</div>
```
给其添加样式如下：
```css
div:not(.outer) p {
    color: green;
}

div.outer p{
    color: red;
}
```
结果如图：

![结果](/img/selector_priority/2.png)

可以看到，outer的color属性为red，很好理解

但inner的color也是red，可以检索一下元素发现：

![结果](/img/selector_priority/3.png)

两个样式都被用在了inner上了，但```div.outer p```被最终采用。说明```div:not(.outer) p```的优先级不会大于```div.outer p```。

接下来给两个样式换个顺序：
```css
div.outer p{
    color: red;
}

div:not(.outer) p {
    color: green;
}
```
F5看看输出效果，inner的color属性变成green了

![结果](/img/selector_priority/4.png)

由此可以看出```div.outer p```的优先级也不会大于```div:not(.outer) p```。这俩优先级一样，会按照最后声明的样式进行加载。这也充分证明了```:not```伪类是没有优先级的

##参考文献
[MDN的CSS优先级文章](https://developer.mozilla.org/zh-CN/docs/CSS/Specificity)

[CSS3 Selectors Specificity](http://www.w3.org/TR/selectors/#specificity)

{% endraw %}