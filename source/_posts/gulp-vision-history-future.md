title: Gulp -- 项目的愿景、过去和将来
subtitle: The vision, history, and future of the project
tags: 
- NodeJs
- JavaScript
- Gulp
categories: 
- NodeJs
date: 2014/10/6
---

**本文翻译自[gulp -- The vision, history, and future of the project](https://medium.com/@contrahacks/gulp-3828e8126466)**

gulp是一个将vinyl、vinyl-fs、orchestrator、命令行工具以及一系列用于帮助开发者构建优秀插件的指导方针等集于一身的小巧构建工具。尽管它功能很少，但它却完全打破了构建工具生态体系，并通过许多优秀的项目掀起了一股改革你的工作流程的浪潮。

<!-- more -->

下面我们就来介绍gulp背后的各个部分以及它们所起到的作用。

##流
流是一种将多个小的变换操作进行组合，连接成管道的一种方式。你将数据丢入管道顶部，它将下落并穿过所有的变换，最后在底部得到你想要的内容。流系统的灵活性能够很好地解决文件变换需求。

想获得更多关于流的信息，请查阅substack的[流操作手册](https://github.com/substack/stream-handbook)


##Vinyl
[Vinyl](https://github.com/wearefractal/vinyl)是一个用来描述文件的简单元数据对象。当你想要使用一个文件时，首先映入脑海的是文件的两个属性：[路径和内容](https://github.com/wearefractal/vinyl/blob/master/index.js#L18-L25)。这两个属性就是一个Vinyl对象的主要属性。这里的文件并不一定是指你的文件系统里的文件。你在S3、FTP、Dropbox、Box、CloudThingly.io或者其他服务上的文件，一样可以使用Vinyl来描述。

##Vinyl Adapters（Vinyl适配器）
既然Vinyl提供了一个清晰的方法用来描述文件，我们现在还需要找到访问这些文件的方式。每一种文件源我们都需要一个“Vinyl适配器”。一个Vinyl适配器只需要暴露三个方法：`.src(globs)`、`.dest(folder)`、和一个`.watch(globs, fn)`。src流负责产生文件对象，而dest流负责消费这些文件对象。

表面上看人们已经理解了“gulp插件”(一个transform形式的流)的概念，但Vinyl适配器的理念却没有被广泛传播。除非自己开发一些适配器，否则无法得知适配器是如何引用文件源中的内容。。通过Vinyl适配器来实现gulp，并将其作为一个开发工具的想法非常奇妙。

###vinyl-fs
如果你使用gulp，你已经使用了[vinyl-fs](https://github.com/wearefractal/vinyl-fs)模块。它是用来适配本地文件系统的适配器。

###vinyl-s3
vinyl-s3尚不存在，但[gulp-s3](https://github.com/nkostelnik/gulp-s3)已经实现了。它无法提供所有的功能，但它是了一个不错的权宜方案。

##Orchestrator
在写这篇文章时，目前的任务系统是[Orchestrator](https://github.com/orchestrator/orchestrator) 0.3。Orchestrator提供了简单的方式去定义任务和依赖，并能够在依赖树为基础的前提下以最大并发数去与并发执行这些任务。Orchestrator虽然工作良好，但它复杂的依赖管理给用户带来不小的麻烦。Orchestrator为了配合gulp的理念而做了巨大的调整：更加轻量、低复杂度，以及可组合的功能性API。

这里简要介绍一下gulp 4带来的变化：
1. 你可以任意指定任务顺序，并行/串行的任意组合都随心所欲。只有想不到，没有做不到
2. API将非常流畅和友好
3. 代码更加简洁

非常感谢Blaine Bublitz在这方面积极的努力。

##错误处理
实话告诉你：gulp现在的错误处理很烂。我从不期望能从报错信息中获得一点有用的信息。使用gulp的过程中，你可能会遭遇两种错误：

###任务失败
watch时出现任务失败，内部将会一团糟，然后线程会退出，具体的退出方式要取决你如何启动这个任务。这种情况非常糟糕，完全不应该发生，在新的任务系统中将对这些进行修复。

###管道失败
标准的流在遭遇错误时仅仅会停止工作。而像linter（代码风格检测）这样的任务，问题就来了。我想看到所有的代码风格提示，而不只是第一个文件里的那些。技术上其实是因为unpipe事件。本质上看，当一个流遇到错误，它将会触发**unpipe**事件，这个事件将告诉其他流不再向它写入数据。目前有一些hack的解决方法如gulp-plumber，可以作为权宜之计，但我很高兴的说，我将会把这些集成到gulp核心之中去。

这些问题我会在下个release版本最优先解决。

##社区
从一个局外人的角度来看，人们都能参与到这场文件转换工具的战斗之中，实在有些疯狂。虽然外人看来可能有些无趣，但成为这个激情小组的一部分绝对令人振奋。我很自豪社区能够接纳这个工具并对人们的日常生活带来帮助。

##进展
想要跟踪gulp 4的进展，你可以在github上查看[里程碑](https://github.com/gulpjs/gulp/issues?milestone=1&state=open)