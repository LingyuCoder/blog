layout: art
title: JavaScript的MV*模式
subtitle: 简要介绍MVC、MVP和MVVM架构模式之间的异同
tags: 
- JavaScript
categories: 
- 前端技术
date: 2014/5/3
---

虽然在做J2EE的时候就已经对MVC有一定的了解，但平常经常听到的MVVM和MVP模式却完全无法理解是什么意思，《JavaScript设计模式》一书中对MVC、MVP、MVVM做了一个详尽的解释，这里记录了一下上面的知识并做了一个简述，正好在学Angular，这些知识结合Angular一起也更加清晰具体了

<!-- more -->

虽然在做J2EE的时候就已经对MVC有一定的了解，但平常经常听到的MVVM和MVP模式却完全无法理解是什么意思，《JavaScript设计模式》一书中对MVC、MVP、MVVM做了一个详尽的解释，这里记录了一下上面的知识并做了一个简述，正好在学Angular，这些知识结合Angular一起也更加清晰具体了

##MVC
MVC是一种架构设计模式，它将应用分割成业务数据（Model）、用户界面（View）、控制逻辑（Controller）三个部分，其架构图大致是这个样子：

![MVC架构图](http://skyinlayerblog.qiniudn.com/blog/img/2014-5-3-javascript-mvc-mvc.png)

###Model（模型）
Model管理应用程序的数据，Model主要与业务数据相关，其不涉及控制层和表示层逻辑。当Model改变时，它会通过Observer模式（Publish/Subscribe）通知观察它的View，一个Model可以有多个观察它的View。

####Model与View和Controller的关系
Model本身不涉及View和Controller的逻辑，它只在乎业务数据模型，并提供相应的接口对其内部数据进行CRUD操作

###View（视图）
视图用于将Model中的业务数据进行展示。在Smalltalk的MVC中，视图通常是绘制和维护位图，而在浏览器中，View通常是负责DOM元素的操作。

####View与Model的关系
当一个Model改变时，它会通知所有观察这个Model的View，而这个View在收到通知之后，根据Model中的数据进行相应的更新。
####View与Controller的关系
用于也可以和View（视图）进行交互，包括读取和编辑Model的数据，但由于View是表示层，但一般不使用View直接对Model中的数据进行修改，这个修改过程通常交给Controller来做。View在与用户交互时，在用户操作之后，View不会去了解下一步做什么，而是将用户操作交给Controller来做决定

####视图与模板
使用structs+JSP的开发者（或是Express+jade之类的），容易误以为JSP这样的模板就是View视图，但实际上模板只是部分（也可能是全部）View的声明方式，通过模板的规范来生成View，但不代表View的全部。比如Angular中，使用带指令（如`ng-hide`,`ng-show`,`ng-repeat`）的模板来生成DOM节点，其属于View，但实际上如果在Angular中根据scope的属性方法来修改DOM节点（如`$scope.$watch`），这也属于View范畴

###Controller（控制器）
Controller中介于Model和View之间，当用户与View进行交互，操作了View之后，它负责更新Model

####Controller与Model
Controller根据View与用户的交互，来直接对Model进行操作。

####Controller与View
事实上可以理解为Controller为View的策略模式的一个实现。View只是负责与用户交互，其具体应该做的工作交给Controller来决定

###MVC模式总结
MVC将应用程序功能模块化，分离出Model、View和Controller三个部分，互相解耦，使得整体维护更加容易。MVC依赖Observer模式（或是Publish/Subscribe实现）来实现它的核心通信

---
##MVP
MVP模式（模型-视图-表示器）是MVC设计模式的一种衍生模式，专注于改进表示逻辑。MVP中的P为Presenter（表示器），它包含用于View的用户界面业务逻辑的组件，与MVC中不同的是，在Model进行改变之后，它不会直接通知View，而是将修改封装为事件（Events）来通知Presenter，Persenter来与View通信，具体的架构图如下所示：

![MVP模式架构图](http://skyinlayerblog.qiniudn.com/blog/img/2014-5-3-javascript-mvc-mvp.png)

###Presenter（表示器）
Presenter与Controller相同的是，其依旧介于Model和View之间，但不同的地方在于，在MVC中，Model在改变后会直接通知View而不会经过Controller，在MVP中，Model会将其改变封装成一个事件（或是主题），通过Publish/Subscribe模式来传递给Presenter，然后Presenter将更新交给View

####Presenter与View的关系
Presenter与View的关系与MVC中Controller与View的关系大体相同，但增加了将Model的修改交给View的职责，数据通过调用View的接口来传递

####Presenter与Model的关系
Presenter与Modle是一个典型的Pubsub，Presenter作为Subscriber，其订阅了Model的修改事件（主题）。而Model作为Publisher在其数据进行修改后，触发这个事件

###MVP模式总结
MVP通过将MVC的Model和View的关系进行改变，使得Model和View进一步解耦，这样Presenter所担任的工作也就相对于MVC中的仅对Model进行更新而有所增加。各个组件直接的数据通信也更易于通过Presenter进行把控

---
##MVVM
MVVM模式(模型-视图-视图模型)是一种基于MVC和MVP的架构模式，它试图更清晰的将用户界面（UI）开发从应用程序的业务逻辑与行为中分离。它采用了MVP中View和Model的解耦方式，而在View和ViewModel之间也通过Pubsub模式和数据绑定来进行通信，其架构图如下所示：

![MVVM架构图](http://skyinlayerblog.qiniudn.com/blog/img/2014-5-3-javascript-mvc-mvvm.png)

###ViewModel（视图模型）
与MVP中的Presenter一样，MVVM中的ViewModel依旧介于View和Model之间。可以将其作为一个专门的Controller，充当数据的转换器，将Model的信息进行适合View的信息，从这个层面上，Viewodel更应该被看做另一个Model。

####ViewModel与Model
ViewModel与Model在通信方式上与MVP几乎没什么差异，但ViewModel在指责上不再只是将Model中的数据传递给View，其将处理View中的显示逻辑，对Model中的业务数据根据需要进行包装，包装成适配View的数据模型

####ViewModel与View
与Controller和Presenter所不关心显示逻辑不同的是，ViewModel会处理大部分显示逻辑，并暴露一些方法用于保持View的状态。来源于Model的数据会根据显示逻辑进行包装后，通过Pubsub模式与View进行通信，这里View作为Subscriber而ViewModel作为Publisher。而View层将数据传递给ViewModel则是通过了数据绑定的形式，View处理自己的用户界面事件，必要时将他们映射到ViewModel中

###MVVM总结
MVVM专注于将UI开发从应用程序业务逻辑与行为分离，通过ViewModel为UI开发提供了更加友好的数据，使得UI开发更加容易。但需要注意的是用于实现数据绑定可能产生大量的标记，且MVVM并不适合UI简单的情况

---
##总结
现有的一些前端框架如Backbone，Angular的等等都是基于MVC模式来进行模块的划分和相互通信的。理解MVC模式在JavaScript中的应用时理解这些库实现方式的基础

