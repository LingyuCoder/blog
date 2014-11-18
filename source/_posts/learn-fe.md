layout: art
title: 学前端的一点总结
subtitle: 一些总结
tags: 
- JavaScript
- HTML
- CSS
- 思考
categories: 
- 思考总结
date: 2014/9/22
---

最近[Qiu](https://github.com/qiu-deqing)开了一个[FE学习经验介绍](https://github.com/qiu-deqing/FE-learning/blob/master/README.md)，并邀请我去写一点东西。感觉这种方式很有意思，趁着闲下来了，就随便扯了一些，希望能帮到想学前端的同学。我自己只是个前端初学者，希望能有更多的前端爱好者一同学习探讨~~

<!-- more -->

####工具
* chrome dev tools：前端开发调试利器，着重注意几个功能：
    - console（废话）
    - elements:元素样式调整，很常用
    - sources：代码中添加断点，单步调试，以及单步调试过程中查看内存中的对象
        + watch expression：通过表达式查看当前内存中的值
        + call stack：查看调用栈，开启async，可以看异步调用栈（这个非常有用，尤其是ajax调试的时候）
        + scope variables：作用域链上的变量，非常有用
    - network：抓包查看每个请求，非常重要，前后端联调必备
    - timeline：分析渲染、js执行等等各个阶段，性能优化利器
    - emulation：模拟移动端环境，mobile页面开发必备
    - 一些插件:
        + liveload: 修改页面后自动刷新，不用按F5
        + dimensions：直接在页面上测量的利器
        + livestyle：css样式修改后自动起效果，不需要刷新，elements修改后也能同步到代码中
        + image tool：测量，取色
        + UC二维码：移动端调试扫码必备
        + pagespeed，YSlow：页面性能分析和优化插件
        + 马克飞象：优秀的在线markdown编辑器，快速写周报，做记录
* sublime text2：编码方便，插件多，速度快，性能好
    - emmet：提升html编码速度必备
    - sublimelinter + 各种语言的lint和hint：代码纠错
    - 一些snippets：自动补全，提升开发效率
* Intellij IDEA和WebStorm：集成开发环境，集成了各种功能，开发比sublime要方便，但会比较吃性能
* Mark Men：测量、取色、标注利器，拿到视觉稿之后第一个打开的软件
* GFW Fucker：我用红杏，可以的话买个虚拟服务器当梯子
* iHosts：非常优秀的hosts管理软件，轻松修改hosts，开发调试必备
* Rythem：AlloyTeam出品的代理抓包软件，非常轻量，安装简单，移动端（真机）开发调试很好用
* Wunderlist：一个非常不错的Todo List，任务、需求多的时候管理起来很方便

####技能
前端的技能其实除了JavaScript（包括NodeJS）、HTML、CSS以外，还有很多。其实前端的技能树很大，这里只能列一些我开发中见到的说一说
#####语言基础
JavaScript：
* 作用域链、闭包、运行时上下文、this
* 原型链、继承
* NodeJS基础和常用API

CSS：
* 选择器
* 浏览器兼容性及常见的hack处理
* CSS布局的方式和原理（盒子模型、BFC、IFC等等）
* CSS 3，如animation、gradient、等等

HTML：
* 语义化标签

#####进阶
JavaScript:
* 异步控制（Promise、ES6 generator、Async）
* 模块化的开发方式（AMD、CMD、KMD等等）
* JavaScript解释器的一些相关知识
    - 异步IO实现
    - 垃圾回收
    - 事件队列
* 常用框架使用及其原理
    - jQuery：基于选择器的框架，但个人认为不能叫框架，应该算工具库，因为不具备模块加载机制，其中源码很适合阅读钻研
    - AngularJS/Avalon等MVVM框架：着重理解MVVM模式本身的理念和双向绑定的实现，如何解耦
    - underscore：优秀的工具库，方便的理解常用工具代码片段的实现
    - polymer/React: 组件化开发，面向未来，理解组件化开发的原理

CSS和HTML：主要是CSS3的特性和HTML5的特性，以及浏览器处理的流程和绘制原理
* DOM树、CSSOM树、渲染树的构建流程及页面渲染的过程
* 解析HTML、CSS、JavaScript时造成的阻塞
* HTML5相关
    - SVG及矢量图原理
    - Canvas开发及动画原理（帧动画）
    - Video和Audio
* flex box布局方式
* icon fonts的使用

常用NodeJs的package：
* koa
* express
* underscore
* async
* gulp
* grunt
* connect
* request

一些理念：
* 响应式Web
* 优雅降级、渐进增强
* don`t make me think
* 网页可用性、可访问性、其中的意义
* SEO搜索引擎优化，了解搜索引擎的原理
* SPA的好处和问题

性能优化：
* 减少请求数量（sprite、combo）
* 善用缓存（application cache、http缓存、CDN、localstorage、sessionstorage，备忘录模式）
* 减少选择器消耗（从右到左），减少DOM操作（DOM和JavaScript解释器的分离）
* CSS的回流与重绘

#####项目
* 版本管理：首推Git，用过Git都不会想用SVN了
    - Git：本地版本管理的机制
    - SVN：远程中心的版本管理机制
* 自动化构建：主要就是less、模板、coffee等的预处理以及对代码压缩和合并
    - Gulp：基于流构建，速度快、模块质量好
    - Grunt：独立任务构建，速度慢，配置蛋疼，灵活性高
* 预处理和模板引擎
    - less：语法简单，但功能有限
    - jade、ejs、velocity等模板引擎，各有各的长处
    - coffee：python工程师最爱，我没用过
* 环境搭建：主要是将线上代码映射到本地，并在本地启动一个demo服务器，至于模拟数据的mock，见仁见智了
    - 本地代理：ihosts
* 自动化测试：在业务较为稳定的情况下，可以通过自动化测试来减少测试的事件，但需求较多的时候，维护测试用例的成本会很高，可能用自动化测试会起到反效果
    - jasmine
    - mocha
* 生态系统
    - npm
    - bower
    - spm
* 搭建一个属于自己的博客
    - git pages
    - hexo
    - jekyll
    
#####未来
* Web Componets：面向未来的组件化开发方式
    - HTML模板
    - Shadow DOM
    - Custom Elements
    - HTML Import
* 移动端Native开发：这也是需要了解的，以后前端工程师会经常地和webview打交道，也要了解native开发

#####其他
有些东西不是考敲码就能弄好的，我参与实习的时候感受到了很多，这些是我遇到的也是我感觉自己做的不好的地方
* **对于业务的思考**：我个人这方面非常欠缺，所以放在最前面，在敲码前要多思考业务
* 交流和沟通能力：这个非常重要，前端同时需要与项目经理、产品、交互、后台打交道，沟通不善会导致很多无用功，延缓项目
* 知识管理、时间管理：input和output的平衡，output是最好的input。如何做好分享，参与社区，做好交流，作好记录
* 对新技术的渴望，以及敢于尝试
    
####入门书
入门可以通过啃书，但书本上的东西很多都已经过时了，在啃书的同时，也要持续关注技术的新动态。这里推几本我觉着不错的书：

* 《JavaScript高级编程》：可以作为入门书籍，但同时也是高级书籍，可以快速吸收基础，等到提升再回来重新看
* 《JavaScript权威指南》：不太适合入门，但是必备，不理解的地方就去查阅一下，很有帮助
* 《编写可维护的JavaScript》和：
* 《Node.js开发指南》：不错的Nodejs入门书籍
* 《深入浅出Node.js》：Nodejs进阶书籍，必备
* 《JavaScript异步编程》：理解JS异步的编程理念
* 《JavaScript模式》和《JavaScript设计模式》：JavaScript的代码模式和设计模式，将开发思维转变到JavaScript，非常好的书
* 《JavaScript框架设计》：在用轮子同时，应当知道轮子是怎么转起来的，讲解很详细，从源码级别讲解框架的各个部分的实现，配合一个现有框架阅读，可以学到很多东西
* 《Don`t make me think》：网页设计的理念，了解用户行为，非常不错
* 《CSS禅意花园》：经久不衰的一部著作，同样传递了网页设计中的理念以及设计中需要注意的问题
* 《高性能JavaScript》和《高性能HTML5》：强调性能的书，其中不只是性能优化，还有很多原理层面的东西值得学习
* 《HTML5 Canvas核心技术》：我正在读的一本书，对于canvas的使用，动画的实现，以及动画框架的开发都非常有帮助
* 《HTTP权威指南》：HTTP协议相关必备，前端开发调试的时候也会经常涉及到其中的知识
* 《响应式Web设计》：技术本身不难，重要的是响应式网页的设计理念，以及移动先行的思想
* 《JavaScript语言精粹》：老道的书，也是普及JavaScript的开发思维的一本好书，非常适合入门

####一些不错的网站
* [github](https://github.com)：没啥好说的，多阅读别人的源码，多上传自己的源码，向世界各地的大牛学习
* [codepen](http://codepen.io/)：感受前端之美的必选之地，里面有很多酷炫的效果和优秀的插件
* [echojs](http://www.echojs.com/)：快速了解js新资讯的网站
* [stackoverflow](http://stackoverflow.com/)和[segmentfault](segmentfault.com)：基本上各种问题都能在上面获得解答
* [google web fundamentals](https://developers.google.com/web/fundamentals/)：每篇文章都适合仔细阅读
* [static files](http://www.staticfile.org/)：开放的CDN，很好用
* [iconfont](http://www.iconfont.cn/)：阿里的矢量图标库，非常不错，支持CDN而且支持项目
* [html5 rocks](http://www.html5rocks.com/): 一个不错的网站，很多浏览器的新特性以及前沿的技术，都能在这上面找到文章
* [css tricks](http://css-tricks.com/)：如何活用CSS，以及了解CSS新特性，这里可以满足你
* [JavaScript 秘密花园](http://bonsaiden.github.io/JavaScript-Garden/zh/#object.general) JavaScript初学必看，非常不错
* [w3cplus](http://www.w3cplus.com/)：一个前端学习的网站，里面的文章质量都挺不错的
* [node school](http://nodeschool.io/)：一个不错的node学习网站
* [learn git branch](http://pcottle.github.io/learnGitBranching/?demo)：一个git学习网站，交互很棒
* [前端乱炖](http://www.html-js.com/)：一个前端文章分享的社区，有很多优秀文章
* [正则表达式](http://deerchao.net/tutorials/regex/regex.htm)：一个正则表达式入门教程，非常值得一看
* [阮一峰的博客](http://www.ruanyifeng.com/blog/)和[张鑫旭的博客](http://www.zhangxinxu.com/wordpress/)：快速了解某些知识的捷径，但是如果需要深挖，还需要其他的资源
* 各路大牛的博客：这个太多了，就不贴了，知乎上有很全的
* 各种规范的官方网站，不懂得时候读规范

####历程
以前是做Java SSH的，半路出家做的前端，所以水平比较弱，遇到问题也比较多。基本上入门靠看书和[W3C School](http://www.w3school.com.cn/)上的教程，以及一些前端博客，如[汤姆大叔的博客](http://www.cnblogs.com/TomXu/)。以前也只是使用jQuery，原生js也没有太多的钻研，后来逐渐看了很多本动物书，比如老道的语言精粹等等。从这些书中学到了很多语言层面的知识。但这显然是不够的，所以我经常会去社区上看看大家在谈论什么，然后去看看相关的资料，感兴趣就会多找些资料看看，或者写一写demo。学CSS主要就是通过这种方式。后来开始更多的关注各路大牛的博客和一些比较深的书籍，以及关注一些新的知识和框架，并且不断地练手提交代码到github，这样也学到了很多知识。在实习的过程中，切身参与到实际项目开发之中，能学到很多在学校学不到的理念和思维，这点也有很大的帮助。不说了，我要去搬砖求offer了...
