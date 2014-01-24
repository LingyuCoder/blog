---
layout: art
title: 闭合浮动最佳方案（clearfix）
subTitle: 传统闭合浮动方法与使用:after伪类的闭合浮动
desc: 
tags: [css]
categories: [前端技术]
---

传统方法：
```css
.clear{clear:both;height:0;overflow:hidden;}
```
这样在需要闭合的地方加一个div.clear就行了，但是会改变html文档结构，所以建议使用以下方式：
```css
.clearfix:after{content:".";display:block;height:0;clear:both;visibility:hidden}
.clearfix{*+height:1%;}
```
使用after伪类后可以不用改变html文档结构即完成浮动闭合,加在浮动元素的父元素上就可以了