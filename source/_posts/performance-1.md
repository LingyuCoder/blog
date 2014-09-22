layout: art
title: 前端性能优化（DOM操作篇）
subtitle: 前端性能优化系列
tags: 
- JavaScript
- HTML
- CSS
categories: 
- 性能优化
date: 2014/3/25
---

最近准备笔试面试题的时候看到很多关于前端性能优化的问题，所以提前调研做做准备，加上我之前写的两篇博客，组成一个新系列

<!-- more -->

##缓存DOM对象
JavaScript的DOM操作可以说是JavaScript最重要的功能，我们经常要根据用户的操作来动态的增加和删除元素，或是通过AJAX返回的数据动态生成元素。比如我们获得了一个很多元素的数组`data[]`，需要将其每个值生成一个li元素插入到一个id为container的ul元素中，最简单（最慢）的方式是：

```javascript
var liNode, i, m;
for (i = 0, m = data.length; i < m; i++) {
    liNode = document.createElement("li");
    liNode.innerText = data[i];
    document.getElementById("container").appendChild(liNode);
}
```

这里每一次循环都会去查找id为container的元素，效率自然非常低，所以我们需要将元素在循环前查询完毕，在循环中仅仅是引用就行了，修改代码为：

```javascript
var ulNode = document.getElementById("container");
var liNode, i, m;
for (i = 0, m = data.length; i < m; i++) {
    liNode = document.createElement("li");
    liNode.innerText = data[i];
    ulNode.appendChild(liNode);
}
```

缓存DOM对象的方式也经常被用在元素的查找中，查找元素应该是DOM操作中最频繁的操作了，其效率优化也是大头。在一般情况下，我们会根据需要，将一些频繁被查找的元素缓存起来，在查找它或查找它的子孙元素时，以它为起点进行查找，就能提高查找效率了。

##在内存中操作元素
由于DOM操作会导致浏览器的回流，回流需要花费大量的时间进行样式计算和节点重绘与渲染，所以应当尽量减少回流次数。一种可靠的方法就是加入元素时不要修改页面上已经存在的元素，而是在内存中的节点进行大量的操作，最后再一并将修改运用到页面上。DOM操作本身提供一个创建内存节点片段的功能:`document.createDocumentFragment()`，我们可以将其运用于上述代码中：
```javascript
var ulNode = document.getElementById("container");
var liNode, i, m;
var fragment = document.createDocumentFragment();
for (i = 0, m = data.length; i < m; i++) {
    liNode = document.createElement("li");
    liNode.innerText = data[i];
    fragment.appendChild(liNode);
}
ulNode.appendChild(fragment);
```
这样就只会触发一次回流，效率会得到很大的提升。如果需要对一个元素进行复杂的操作（删减、添加子节点），那么我们应当先将元素从页面中移除，然后再对其进行操作，或者将其复制一个（`cloneNode()`），在内存中进行操作后再替换原来的节点

##一次性DOM节点生成
在这里我们每次都需要生成节点（`document.createElement("li")`），然后将其加入到内存片段中，我们可以通过`innerHTML`属性来一次性生成节点，具体的思路就是使用字符串拼接的方式，先生成相应的HTML字符串，最后一次性写入到ul的innerHTML中。修改代码为：
```javascript
var ulNode = document.getElementById("container");
var fragmentHtml = "", i, m;
for (i = 0, m = data.length; i < m; i++) {
    fragmentHtml += "<li>" + data[i] + "</li>";
}
ulNode.innerHTML = fragmentHtml;
```
这样效率也会有提升，不过手动拼写字符串是相当麻烦的一件事

##通过类修改样式
有时候我们需要通过JavaScript给元素增加样式，比如如下代码：
```javascript
element.style.fontWeight = 'bold';
element.style.backgroundImage = 'url(back.gif)';
element.style.backgroundColor = 'white';
element.style.color = 'white';
//...
```
这样效率很低，每次修改style属性后都会触发元素的重绘，如果修改了的属性涉及大小和位置，将会导致回流。所以我们应当尽量避免多次为一个元素设置style属性，应当通过给其添加新的CSS类，来修改其CSS
```css
.element {
    background-image: url(back.gif);
    background-color: #fff;
    color: #fff;
    font-weight: 'bold';
    /*...*/
}
```

```javascript
element.className += " element";
```

##通过事件代理批量操作事件
还是之前那个ul和添加li，如果我们需要给每个li都绑定一个click事件，就可能写出类似如下代码：
```javascript
var ulNode = document.getElementById("container");
var fragment = document.createDocumentFragment();
var liNode, i, m;
var liFnCb = function(evt){
    //do something
};
for (i = 0, m = data.length; i < m; i++) {
    liNode = document.createElement("li");
    liNode.innerText = data[i];
    liNode.addEventListener("click", liFnCb, false);
    fragment.appendChild(liNode);
}
ulNode.appendChild(fragment);
```
这里每个li元素都需要执行一次`addEventListener()`方法，如果li元素数量一多，就会降低效率。所以我们可以通过事件代理的方式，将事件绑定在ul上，然后通过`event.target`来确定被点击的元素是否是li元素，同时我们也可以使用`innerHTML`属性一次性创建节点了，修改代码为：
```javascript
var ulNode = document.getElementById("container");
var fragmentHtml = "", i, m;
var liFnCb = function(evt){
    //do something
};
for (i = 0, m = data.length; i < m; i++) {
    fragmentHtml += "<li>" + data[i] + "</li>";
}
ulNode.innerHTML = fragmentHtml;
ulNode.addEventListener("click", function(evt){
    if(evt.target.tagName.toLowerCase() === 'li') {
        liFnCb.call(evt.target, evt);
    }
}, false);
```
这样事件绑定的代码就只要执行一次，可以监听所有li元素的事件了。当然如果需要移除事件回调函数，我们也不需要循环遍历所有的li元素，只需要移除ul元素上的事件处理就行了

