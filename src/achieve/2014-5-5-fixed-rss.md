---
layout: art
title: 修正了一下博客的RSS
subTitle: 修正了之前换页面使用Angular导致的URL出错的BUG
desc: 把页面换成Angular+ngRoute，所有的URL都改成ngRoute的URL形式，但忘记修改RSS中的URL了，导致订阅之后跳转出了问题，这里修复了一下这个bug
categories: [网站建设]
tags: [github, jekyll]
---

{% raw %}
把页面换成Angular+ngRoute，所有的URL都改成ngRoute的URL形式，但忘记修改RSS中的URL了，导致订阅之后跳转出了问题，这里修复了一下这个bug

另外将订阅从摘要订阅修改成了全文订阅，这样虽然生成的XML文件更大，但使用起来还是要友好一些
{% endraw %}