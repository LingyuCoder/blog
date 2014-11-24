layout: art
title: 构建华丽UI的7条准则（上部）
subtitle: 7 Rules for Creating Gorgeous UI (Part 1)
tags: 
- 设计
categories: 
- 翻译
date: 2014/11/24
---

本文翻译自Erik D. Kennedy的[7 Rules for Creating Gorgeous UI (Part 1)](https://medium.com/@erikdkennedy/7-rules-for-creating-gorgeous-ui-part-1-559d4e805cda?hn=1)

<!-- more -->

##简介

好吧，首先需要说明的是，这篇指南并不适合每一个人。那么它适合哪些人呢？
- 那些要在紧要关头设计他们自己的好看的UI的**开发者**
- 那些希望自己的作品集看起来比五边形PPT更炫酷或是那些将优秀的用户体验和漂亮的UI打包出售的**用户体验（以下简称UX）设计师**

如果你曾经上过艺术学校，或是认为自己已经是一个UI设计师，你很可能会觉着这篇指南充斥着a.) 无聊, b.) 错误, and c.) 不爽。没关系。你的所有批评都是对的。关掉页面，该干啥干啥。

让我来告诉你这篇指南里都有些什么。

首先，我是一个没有UI技能的UX设计师。我喜欢设计用户体验，但
我干的时间不长，直到我了解到如下这些驱动我去学界面美化的原因：
- 我的作品集看起来很废，无法很好的反映我的工作和思想进程；
- 我的UX咨询客户更愿意去找那些不只会画方框和箭头，而懂得更多专业知识的人；
- 我是否在某些时候需要在项目初期干活？不只是帮忙扫扫地


我有我自己的理由。我并不了解垃圾美学观。我是个做工程的，而最令我自豪的就是构建一些帅气的东西。

最后，我学到了应用程序的每学，它和任何其他创造性的活动中的一样：冰冷，难以分析。以及无耻的从他人作品中模仿。我曾在一个UI项目上花费了10个小时，但只赚了一个小时的钱。其他的9个小时都是在瞎逛式的学习。无休止的搜索Google、Pinterest和Dribbble来找可以模仿的作品。


这些准则就是这样总结出来的

**所以有一些话希望告诉那些书呆子们：如果做出了优秀的设计，并不是因为我参透了美感和平衡，而是因为我分析出了成果。**

这篇文章并不是一些理论，都是纯粹的应用。你不会看到任何和黄金分割相关的东西。我甚至都没有提及色彩理论。只有那些我不断失败不断练习所学到的东西。

可以这样说：柔道是基于几个世纪的日本无数和哲学传统发展而来的。你参与了柔道训练，并进行了实战，你就会听到很多关于能量、流动、平和以及之类的东西。

另一方面，马伽术是一些在20世纪30年代捷克斯洛伐克的一些强硬的犹太人，为了在街头对抗纳粹所发明的。其中没有任何艺术科研，在它的课程中，你学到的是如何通过一支笔去刺瞎别人的眼镜。

这里就是屏幕上的马伽术

这些准则包括：
1. 光来自天空
2. 黑白先行
3. 使用双倍的留白
4. 学习如何在图像上叠加文字
5. 让文字弹出——并且反流行
6. 仅使用好的字体
7. 像艺术家一样去偷

让我们开始吧

##准则一：光来自天空

*阴影是用来帮助大脑用来分辨用户界面上元素的宝贵线索*

这可能是在学习UI设计中**最重要且常被忽略**的了：光来自天空。光线时常来自于天空，如果从下方来的话会看起来很怪异。

![wooooo](http://skyinlayerblog.qiniudn.com/blog/img/2014-11-24/1.jpeg)

当光线来自天空，它照亮了物体的顶部并在他们下方留下阴影。物体的顶部更亮，底部更暗。

你不会把人的下眼睑当做特别的阴影，但当光照在上面时，瞬间就好像一个妖娆的女孩站在你的门前。

是的，UI也是一样。正如我们的所有五官下侧都会有较小的阴影，在我们所看到的每个UI元素下面也有阴影。**屏幕是扁平的，但我们已经找到了很多方法使得他们看起来像是3D的**

![My favorite part of this image is the poker finger in the lower-right.](http://skyinlayerblog.qiniudn.com/blog/img/2014-11-24/2.png)

就拿按钮来说。即使这种相对“扁平”的按钮，它仍有一些与光线相关的细节：
1. 未按下的按钮（上图）有一个较暗的底部边缘。太阳光照不到那里；
2. 未按下的按钮的**顶部比底部稍微亮一些**。这是因为它模拟了一个稍微弯曲的表面。就和你需要倾斜你面前的镜子才能看到里面的太阳一样，倾斜向上的表面对你反射了的太阳光多了那么一点点；
3. 未按下的按钮蒙上了**细微的阴影**，可能你将部分进行放大才能看见
4. 按下的按钮，底部依然要比顶部更暗，但它**整体都变暗了**——这是因为它在屏幕同意平面上，而光不再那么容易地照到它。可能有人会说了，现实生活中我们按下的按钮颜色也会较深，事实上那是因为我们的双手遮挡住了光线。

这只是一个按钮，但也呈现出4个小的光线效果。那么问题来了，我们需要将这些运用到所有元素下。

![iOS 6 is a little outdated, but it makes a good case study in light behavior.](http://skyinlayerblog.qiniudn.com/blog/img/2014-11-24/3.png)

这是iOS 6的“请勿打扰”和“通知”的设定。很漂亮不是吗？那么我们来看看它有多少光线效果。
- 面板的顶部上有细小的阴影
- “ON”开关的滑动轨道上也有
- “ON”开关的滑动轨道是凹陷的，而底部反射更多的光
- 图标突出了一点，是否看到它顶部的边框更亮？这代表了一个垂直于光源的面，因此接收到了不少的光，也因此反射更多光到你眼睛
- 面板分割的缺口远离阳光的角度蒙有阴影，反之亦然

![A close-up of a divider notch. From an old Hubster concept of mine.](http://skyinlayerblog.qiniudn.com/blog/img/2014-11-24/4.png)

以下元素通常看起来是**内嵌**的：
- 文本输入框
- 按下的按钮
- 开关的滑动轨道
- 单选按钮（未被选择）（radio）
- 复选按钮（checkbox）

以下元素通常看起来是**外凸**的：
- 按钮（未按下）
- 开关
- 下拉控件
- 卡片
- 被选择的单选按钮的按钮部分
- 弹出窗口

现在你学到了，你会发现到处都是这样。欢迎你，孩子

###等等，扁平化设计怎么办呢，Erik？
iOS7的“扁平化设计”轰动了技术社区。如字面上所说，它是平的。没有凸起或凹陷，只是纯色的线条和形状。

![iOS 7 扁平设计](http://skyinlayerblog.qiniudn.com/blog/img/2014-11-24/5.png)

我和后面那个家伙一样喜欢干净和简洁，但我不认为这是个长期的趋势。我们在界面上对于3D的模拟，还远远没有自然到能够放弃一切。

**很有可能在不久的将来我们就会见到半扁平UI**（我推荐你能够精通这样的设计）。进一步可以称之为“扁平化的设计（flatty design）”。依然干净，依然简洁，但那些需要触碰、滑动、点击的元素会有一些阴影和线索。

![OS X Yosemite—不只是扁平，而是扁平化](http://skyinlayerblog.qiniudn.com/blog/img/2014-11-24/6.png)

在我写这篇文章时，Google在他们的产品之上推出了“Material Design”语言。这是一个统一的视觉语言，它的核心思想就旨在模仿现实世界。

从Material Design的设计图中可以看出，它展示了如何通过不同的阴影来表现元素不同的深度。

![Material Design 1](http://skyinlayerblog.qiniudn.com/blog/img/2014-11-24/7.png)

![Material Design 2](http://skyinlayerblog.qiniudn.com/blog/img/2014-11-24/8.png)

这是我一直坚持做的事情。

它采用了细微的现实世界的线索来传达信息。**关键字，细微**。

你不能说它没有模仿现实世界，但也没有像2006年的网站上那样的纹理、渐变和光亮。

我认为扁平化是未来。扁平？那只是过去。

![扁平设计现在似乎大热](http://skyinlayerblog.qiniudn.com/blog/img/2014-11-24/9.png)

##规则二——黑白先行
*在添加颜色之前使用灰度进行设计能让最复杂元素的视觉设计也变得简单。*

如今UX设计师也进行“移动先行”的设计。这就意味着，先在手机上考虑页面样式及交互，然后再扩展到高像素的Retina屏幕上

**这是个非常好的约束。它传达了一个思想。**先从困难的问题开始（在较小的屏幕上可用的应用程序），然后将解决方案适配到简单的问题上（在大屏幕上可用的应用程序）。

还有一个类似的约束：先用黑白进行设计。在没有颜色的帮助下，以让应用在各个角度下漂亮且可用这样的困难问题作为开始。最后再添加颜色，即使如此，明确目标。

![Haraldur Thorleifsson’s grayscale wireframes look as good as lesser designer’s finished sites.](http://skyinlayerblog.qiniudn.com/blog/img/2014-11-24/10.png)

这是一个保持应用程序看起来“简洁”的较为可靠且简单的方式。**过多的颜色很容易破坏“简洁”。**黑白先行使得你更加专注于留白、尺寸和布局。而这些正式“简洁”设计所关注的。

![Classy grayscale.](http://skyinlayerblog.qiniudn.com/blog/img/2014-11-24/11.png)
![Classy grayscale.](http://skyinlayerblog.qiniudn.com/blog/img/2014-11-24/12.jpeg)
![Classy grayscale.](http://skyinlayerblog.qiniudn.com/blog/img/2014-11-24/13.png)

在某些情况下黑白先行并没有效果。那些有很强特定风格的设计——“运动的”、“浮华的”、“卡通的”，等等——需要设计师非常好的使用颜色。但**大多数应用程序除了“简洁”以外都没有特定的风格。**不可否认，那些设计更难。

![Flashy and vibrant designs by Julien Renvoye (left) and Cosmin Capitanu (right). Harder than it looks.](http://skyinlayerblog.qiniudn.com/blog/img/2014-11-24/14.png)

![Flashy and vibrant designs by Julien Renvoye (left) and Cosmin Capitanu (right). Harder than it looks.](http://skyinlayerblog.qiniudn.com/blog/img/2014-11-24/15.png)

对于其他的，都可以用黑白先行

###第二步：如何上色
最简单的上色方式就是只添加一种颜色

![添加一种颜色](http://skyinlayerblog.qiniudn.com/blog/img/2014-11-24/16.png)

往黑白的网页中添加一种颜色是简单而有效地吸引眼球方式

![添加一种颜色](http://skyinlayerblog.qiniudn.com/blog/img/2014-11-24/17.png)

你也可以更进一步，灰度+两种颜色，或是灰度+单一色调的多种颜色

> **实践中的色码——等等，什么事色调？**
> 
> 网页和大多数人都是用16进制RGB编码表示颜色。最好忽略这些。RGB并不是一个好的颜色设计框架。[HSB](http://demosthenes.info/blog/61/An-Easy-Guide-To-HSL-Color-In-CSS3)更有用（HSB与HSV或HSL“基本上是同义的”）
> 
> HSB比RGB更好，以为它符合我们自然思考颜色的方式，你能从HSB值的改变中预测到颜色的变化。
> 
> 如果这对你来说是个新闻，这里有一个对于[HSB颜色的介绍](http://demosthenes.info/blog/61/An-Easy-Guide-To-HSL-Color-In-CSS3)。

![来自Smashing Magazine的单色调的金色主题](http://skyinlayerblog.qiniudn.com/blog/img/2014-11-24/18.jpeg)

![来自Smashing Magazine的单色调的蓝色主题](http://skyinlayerblog.qiniudn.com/blog/img/2014-11-24/19.jpeg)

通过修改单一色相的**饱和度**和**亮度**，可以生成更多的颜色——深色的、浅色的、当背景的、做强调的、吸引眼球的——但它并不会在你眼前压倒一切。

使用来自一种或两种色相的多个颜色是在**不破坏设计的前提下突出和弱化元素的最可靠的方法。**

![Countdown timer by Kerem Suer](http://skyinlayerblog.qiniudn.com/blog/img/2014-11-24/20.png)

##颜色使用的一些其他的注意事项
颜色是视觉设计中最复杂的部分。虽然颜色上的很多东西并不精细，而且对于你面前的设计并不适用，我还是看到了一些不错的东西：

一些小工具：

- [永远不要使用纯黑](http://ianstormtaylor.com/design-tip-never-use-black/) (Ian Storm Taylor)。这篇文章中说，纯粹的灰色几乎不会出现在现实世界，灰色的色调的饱和度——尤其是较暗的色调——能为你的设计添加丰富的视觉效果。此外，饱和的灰色更好的模拟了现实世界，这正是它的美之所在。
- [Adobe Color CC](https://color.adobe.com/).一个用来发现、修改和创建颜色方案的优秀工具
- [通过颜色搜索Dribbble](https://dribbble.com/colors/BADA55). 另外一个找到某一个特定颜色实践的不错方式。这很实用。如果你已经决定使用某个颜色，看看世界上最好的设计师们如何使用这个颜色。

##规则三：使用双倍的留白
*增加更多呼吸空间可以让你的UI看起来有设计感*

我曾在规则二中说过，“黑白先行”迫使设计师在考虑配色之前先考虑留白和布局，以及这为什么好。那么，现在来聊聊留白和布局。

如果你曾在[scratch](http://baike.baidu.com/subview/526745/15420063.htm)（一款面向少年的简易编程工具），你可能比较熟悉HTML默认情况下在页面上的布局。

![页面上默认的布局](http://skyinlayerblog.qiniudn.com/blog/img/2014-11-24/21.png)


基本上，一切都被堆砌在屏幕的顶端。字体比较小，行与行之间完全没有空白。段与段之间有那么一丁点的空白，但并不多。各个段落随着页面伸缩，不管是100像素，还是10000像素。

从美学上讲，这非常的难看。**如果你希望你的UI看起来有设计感，你需要给它增加一些呼吸的空间。**

有时候需要的留白很夸张。

> 留白、HTML和CSS
> 
> 如果你，和我一样，曾经使用CSS来实现各种格式，**默认情况下没有留白**，现在是时候从中解脱出来了。试着默认情况下从留白开始思考——一切都以空白开始，直到你拿一个元素来替换它。
> 
> 很有禅意对吗？我想这是一个人们这么设计的重要原因。
> 
> **从一个空白页面开始，意味着以一个只有空白的页面开始。**你在一开始就考虑外边距和留白。你画的所有东西都是有意识的在删除空白。
> 
> **从一堆没样式的HTML开始意味着从内容出发。**事后再考虑空白。必须正确的描述这些。

以下是[Piotr Kwiatkowski](http://www.piotrkwiatkowski.co.uk/)的一个音乐播放器的设计图

![音乐播放器](http://skyinlayerblog.qiniudn.com/blog/img/2014-11-24/22.jpeg)

尤其注意左边的菜单

![左侧的菜单](http://skyinlayerblog.qiniudn.com/blog/img/2014-11-24/23.png)

在两个菜单项的垂直空白是文字本身的两倍。12px的字体，上下的内边距也是一样。

再看一下列表的标题。在单词“PLAYLISTS”上下有15像素的留白，而且它有下划线。也就是说，在列表与列表之间相距25px。

![导航条上有更多的空白。“Search all music”的文字大小只占导航条高度的20%。图标也差不多大](http://skyinlayerblog.qiniudn.com/blog/img/2014-11-24/24.png)

不错，大的空白能让凌乱的界面看起来更加诱人和简单——比如下面这个论坛。

![Matt Sisto设计的论坛](http://skyinlayerblog.qiniudn.com/blog/img/2014-11-24/25.png)

或者维基百科。

![Aurélien Salomon设计的维基百科](http://skyinlayerblog.qiniudn.com/blog/img/2014-11-24/26.png)

你会发现存在很多争议说，这个重新设计的维基百科省去了使用网页的关键功能。但你必须承认，这是一个不错的学习体验。


增加线条之间的留白

增加元素之间的留白

增加每组元素之间的留白

**分析是什么在起作用**


