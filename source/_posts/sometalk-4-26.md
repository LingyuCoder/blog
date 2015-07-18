layout: art
title: 4月26日杂谈
subtitle: 关于最近写的一些小玩意
tags:
- 思考
categories:
- 思考总结
date: 2015/4/26
---

本来今天打算继续写之前说要写的动画基础知识的，但是晚上玩了玩gitbook就忘掉了。现在也懒得组织了，就把最近写的一些小玩意梳理一下。

<!-- more -->

##Gitbook

我的[读书笔记](http://read.lingyu.wang)是用Gitbook来生成的，如果之前关注过的人可能会发现最近读书笔记的样式发生了很大的调整。

是的，我把Gitbook从1.x.x升级到了2.x.x了， 升级之后样式更加美观， 也不会有以前的菜单栏有时不出现的bug了。 新入职才发现， 天猫这边的文档现在都是用Gitbook来生成的，**简约，大方**，但是Gitbook不能完全满足我的需求：

1.	没法创建书单，很好地用todo list的方式展现要读的书、已读的书
2.	Codepen上有不少好东西，但是没办法嵌入到Gitbook中
3.	图片只是100%，没有做任何处理，如果图片较大就会被压缩，里面的文字就看不清了。 比如我现在用百度脑图写读书笔记， 里面文字就被压的很小了

针对这几个问题，我花了点周末时间写了几个插件：

1.	生成todo list：[gitbook-plugin-todo](https://github.com/LingyuCoder/gitbook-plugin-todo)。现在读书笔记[首页](http://read.lingyu.wang/)就是用这个插件生成的书单
2.	生成codepen：[gitbook-plugin-codepen](https://github.com/LingyuCoder/gitbook-plugin-codepen)，具体效果可以看[我的Codepen](http://read.lingyu.wang/Codepen.html)，就是加载有点慢
3.	使用fancybox查看图片：[gitbook-plugin-fancybox](https://github.com/LingyuCoder/gitbook-plugin-fancybox)，现在点击读书笔记里任何一张图片，都会有个弹窗来展示图片，fancybox是个很强大的jQuery图片展示插件，之前hexo默认也是带fancybox的，现在3.0了就不知道还带不带。fancybox效果真心赞，大图片通过buttons的helper也可以很轻松的查看

###一点随想

写这几个插件并不怎么花时间，但是却解决了我的问题，帮我构建了一个更加完善的读书笔记。 **能用来切切实实解决问题、创造出价值的技术，才是真正的技术**

##React玩具

最近React-native炒得很热，整个天猫团队也颇为重视，我也尝试着做了做React-native，不过由于React本身都还没玩通，写起来很吃力，因此决定先好好学习一下React，理解React的思想。这也就产出了几个质脆玩具。

1.	[markdown编辑器](http://lingyucoder.github.io/learn-react/page/md-editor/index.html)
2.	[计算器](http://lingyucoder.github.io/learn-react/page/calculator/index.html)
3.	[日历](http://lingyucoder.github.io/learn-react/page/calendar/index.html)

这些源码都放在我Github的[learn-react](https://github.com/LingyuCoder/learn-react)仓库下

React用能够很方便的自己定义元素，并且使用定义元素也很简单。通过使用JSX，可以直接将HTML代码写在JSX代码中，组件的结构更加清晰、直观。这与Web Component的组件化思想颇有不同，不过用起来要简便很多。React通过virtual dom，自己构建了一个虚拟的DOM树，在渲染时在虚拟的DOM树上进行diff，只渲染不同的部分，因此性能不错。但是目前有几个问题：

1.	虽然JS和HTML实现了组件化，问题是CSS并没有好的管理办法，依旧是和原来一样，相互污染
2.	库的体积比较大，但是还只是解决了V层的问题，不带任何脚手架，一般还需要配合工具库使用

React和Angular比较功能还是比较单一的，虽然代码量都是2w+行，但React并不像Angular是一个完整的MVVM框架，当然这样的React的学习成本个人感觉要比Angular低的多，上手很容易。

##博客升级

最近hexo推出3.0了，于是乎手贱就在新发的电脑上装了，发现主题也跪了，之前写的插件也跪了。好吧，还是继续用我的2.5.7了。

这个博客我记得是去年过年时候搭的算下来得有一年多了，以前写的很勤奋，几乎两天一篇，甚至一天一篇。现在懒得几个月才一篇。之前突然陷入了一个怪思维，总觉着要写就得写点牛逼的东西，不能让别人觉得我的博客很low，但是又一直没干啥牛逼的事，也就没牛逼的东西可以写...恶性循环...

仔细想一想：**这是我的博客，我想咋写咋写，我爱咋写咋写，爱看看，不看ctrl+w就是**。于是乎又有了写东西的动力

##关于日记

可能有人留意到博客首页上有一个[日记](http://lingyu.wang/everyday)，但估计很少有人点进去，我也懒得在里面放百度统计看看有多少流量了，反正整站才每天100左右，那里肯定也就个位数

我从小到大写日记从来没坚持超过两周，但是在那上面竟然写了5个月...虽然经常几天才更新上传一次，但基本上都连下来了。现在保证一天看两篇技术文章，然后把收获写在里面

说实话有很多文章看完连收货都没有

关于这些文章我有一套管理流程：

首先是文章的出处：我订阅了一些邮件，他们会定时向我推送一些文章，这些邮件有

-	奇舞团周刊
-	好东西传送门
-	开发者头条
-	JavaScript Weekly
-	DailyJS
-	Web Tools Weekly
-	SegmentFault • 每周精选

另外在日常刷微博过程中，看到别人转发的文章，比如知乎、乱炖、W3CTech上的文章，我也会mark保存下来。那么这么多文章，怎么把他们汇总存储，有时间就去看呢？

**这就要用到一件神器：印象笔记——剪藏**

剪藏是个印象笔记的Chrome插件，在打开网页后，点击一下剪藏按钮，它就能自动提取正文部分内容，保存到印象笔记里面。然后我在印象笔记里弄了一个笔记本，专门用来放这些还没有看的文章。等到有时间（比如蹲马桶，闲的蛋疼，吃饱不想干活）的时候，就会从里面随便找点文章看一看

我还特地在印象笔记里面弄了个笔记本分组，里面有很多笔记本，专门用于归档这些文章，看完之后觉得有价值的文章就会根据内容放到特定的笔记本中

**这一切都建立在你肯出30块每月的印象笔记高级用户的基础上**

##其他

最近还想写一篇文章，推荐一些觉得不错的Mac工具。不过可能工作上会比较忙，有时间就写写吧
