layout: art
title: CSS布局相关基础知识
subtitle: 包含块、浮动、相对定位、绝对定位以及布局属性相关关系
tags: 
- CSS
categories: 
- CSS
date: 2014/3/31
---


##包含块（containing block）的定义
元素盒子的位置和大小通常需要通过一个确定的矩形来计算，这个矩形就是包含块，其定义如下：
1. 根元素的包含块是一个被称为原始包含块（initial containing block）的矩形。它由视口确定，对于分页媒体来说就是页区域。它的direction属性时和根元素的一样
2. 对于其他元素，如果元素的position是relative或static，包含块由其最近的块级祖先的内边距（content edge）来确定
3. 如果元素时position:fixed，那么包含块就是连续媒体的视口或是分页媒体的页区域
4. 如果元素的position属性时absolute，包含那块将根据最近的position属性为非static的祖先元素来确定，有如下规则
    - 当那个祖先元素是一个内联元素时，包含块需要根据祖先元素的direction属性来确定
        -  如果direction是ltr，那么包含块的左上顶点将是祖先元素的第一个盒子的左上顶点，而包含块的右下顶点将是祖先元素最后一个盒子的右下顶点
        -  如果direction是rtl，那么包含块的右上顶点将是祖先元素的第一个盒子的右上顶点，而包含块的左下顶点将是祖先元素最后一个盒子的左下顶点
    - 如果祖先元素是块状元素，那么它的包含块将是这个祖先元素的padding edge
    - 如果没有这么一个祖先元素，则包含块就是原始包含块

分页媒体中，绝对定位元素会被定位在其自己的包含块中，而无视任何分页（就好像整个文档是连续的）。这可能导致元素被分开到多页中

##浮动
一个浮动的盒子首先会根据文档流定位，然后尽可能的往左移或者往右移，直到它的外边界（margin边界）碰到了包含块边界或其他浮动元素的外边界。如果在一个line box中，浮动盒子的顶部外边界将与当前的line box的顶部对齐

如果水平方向上没有足够的空间以容纳浮动元素，它将向下移动，直到它能被容纳或没有更多的浮动元素（If there is not enough horizontal room for the float, it is shifted downward until either it fits or there are no more floats present.不知如何翻译）

由于浮动元素不在文档流内，其前后的未定位的元素将当做它不存在（脱离文档流）。但是，当前的line box和其后面被浮动元素缩短的line box将会为这个浮动的元素创建空间

一个line box在垂直位置满足如下四个条件时，被定义为紧邻着浮动元素，line box会被缩短：
1. 在linx box的顶部边界位置或其下方
2. 在line box的底部边界位置或其上方
3. 在浮动元素的上margin边界之下
4. 在浮动元素的下margin边界之上

如果一个被缩短的line box太小而不足以容纳任何内容，那么这个line box将会被向下移动（它的宽度也将重新计算），直到某些内容能够展现或不再被浮动影响。任何与浮动元素在一行的元素将会在浮动元素的另外一边重新排列。也就是说，如果内联盒子被放置在一个float：left元素的左边，那么它将移动到float元素的右边。而rtl模式和float:right则相反

一个触发了BFC的元素不能与同一BFC下的任何浮动元素重叠。如果有必要，这些元素可以被实现为清除浮动，但如果有足够的空间，可以被放置在浮动元素之后。他们甚至能被浮动元素挤压变得更窄

浮动元素的margin不会和相邻盒子的margin重叠。一个浮动元素能与正常流中的其他元素重叠。当这种情况发生时，浮动元素将被渲染在未定位的文档流内的块状元素之前，文档流的内联元素之后

clear清除浮动，意思是确定当前元素不能与哪个方向的浮动元素相邻。触发了BFC的元素和浮动元素本身的clear属性将无效

另外使用clear清除浮动或由于被挤压而到下面时，设置margin-top是无效的，需要先使用一个div清除浮动，或是在上面一个元素设定margin-bottom

![清除浮动元素margin-top无效的解释1](http://lingyu.wang/img/layout/1.png)

![清除浮动元素margin-top无效的解释2](http://lingyu.wang/img/layout/2.png)

![清除浮动元素margin-top无效的解释3](http://lingyu.wang/img/layout/3.png)

##定位
CSS中一个盒子的定位可以通过如下三种定位模式：
1. 文档流：文档流包括块级元素的块级格式和内联元素的内联格式，以及relative和sticky定位
2. 浮动：浮动模式下，一个盒子起初定位在文档流中，然后被从文档流中拿出向左或向右移动。内容会包围在浮动元素的边上
3. 绝对定位：在绝对定位模式下，一个盒子会从文档流中完全脱离，并根据定位所属的包含块进行定位

当一个元素时浮动的，或者绝对定位或者是根元素，那么就称它脱离文档流。一个元素没脱离文档流的话就被称为流内元素（in-flow）

##相对定位（relative positioning）
当一个盒子通过文档流或浮动定位，那么它能通过position:relative设定一个相对的偏移。这就是相对定位。为一个相对定位的盒子设定偏移不会影响到其他盒子。这也意味着相对定位的盒子会和其他盒子重叠。然而，当一个父元素设定了overflow的值为auto和scroll，而其中的子元素设定了相对偏移而溢出父元素，那么父元素应当扩张滚动条，让用户能通过滚动条看到设定相对偏移的子元素的内容。

一个相对定位的盒子保持它在文档流之中的大小，包括它的换行以及原本为它保留的空间

一个相对定位的盒子建立一个新的包含块，这个可以为其内部的绝对定位元素创建一个包含块

使用left和right属性能够水平方向移动盒子，而不用改变其大小。left将盒子右移，而right将盒子左移。left = -right
- 如果left和right都是auto，那么他们的值都是0
- 如果left是auto，将使用-right值
- 如果rifht是auto，将使用-left值
- 如果都不是auto，就会形成一个过渡约束，那么就有一个值必须被忽略。如果direction属性为ltr，left将优先于left被使用。如果direction是rtl，那么right将优先

top和bottom属性上下移动盒子而不改变其大小。top将盒子向下移，而bottom将盒子向上移。top=-bottom
- 如果都是auto，那么值都是0
- 如果有一个是auto，那么它的值将是另外一个的负数
- 如果都不是auto，那么bottom将被忽略

##绝对定位
在绝对定位模型中，一个盒子根据它所在的包含块（containing block）计算偏移。绝对定位的元素将完全从文档流中脱离而不会影响到其他元素。同时它自身也会为其内部的绝对定位元素（absolute）子孙元素和文档流元素建立一个包含块。但是一个绝对定位元素的内容不会受其他盒子的影响。他们会根据盒子所具有的的堆叠等级（z-index）来掩盖其他盒子（或者被其他盒子所掩盖）

###非替换元素的绝对定位（absolute，
page，fixed）宽度计算
对所有能使用的影响宽度的值有如下限制：
> 'left' + 'margin-left' + 'border-left-width' + 'padding-left' + width + 'padding-right' + 'border-right-width' + 'margin-right' + 'right' = 包含块的宽度

如果left、width和right都是auto，那么将把margin-left和margin-right中值为auto的替换成0。如果建立包含块属性的direction属性为ltr，那么设定left属性为静态定位时的值，然后根据下面的3号规则来确定。如果direction属性为rtl，那么设定right属性为静态定位时的值，然后根据下面的1号规则来确定。

如果left、width和right都不是auto：如果margin-left和margin-right为auto，会根据如下规则解析整个等式计算出两个margin的值，margin-left和margin-right的值相等。如果他们都是负数，当包含块的direction为ltr时，设定margin-left为0，然后计算margin-right，若包含块的direction为rtl时，设定margin-right为0，然后计算margin-left。如果margin-left和margin-right只有一个是auto，那么可以根据等式计算出为auto的margin的值。如果值被过度约束，在direction为ltr时忽略right值，在为rtl时忽略left值。

否则，将margin-left和margin-right中为auto的值替换成0，并选则如下6条中的一条执行：
1. 如果left和width都是auto，而right不是auto，那么width将会扩展尽可能收缩，然后计算left值
2. 如果left和right为auto，而width不是auto，那么如果创建包含块的元素direction属性为ltr，设定left为静态定位时的值然后计算出right，如果direction属性为rtl，设定right为静态定位时的值然后计算出left。
3. 如果width和right都是auto，而left不是auto，那么width会背尽可能收缩，然后计算出right
4. 如果left是auto，width和right都不是auto，直接算出left
5. 如果width是auto，left和right都说不是auto，直接算出width
6. 如果right是auto，width和left都不是auto，直接算出right

###非替换元素的绝对定位（absolute，
page，fixed）高度计算
对所有能够使用的影响高度的值有如下限制：
> 'top' + 'margin-top' + 'border-top-width' + 'padding-top' + 'height' + 'padding-bottom' + 'border-bottom-width' + 'margin-bottom' + 'bottom' = 包含块的高度

如果top、height、bottom都是auto，首先将margin-top和margin-bottom中为auto的替换为0，然后设定top为静态定位中的值，然后使用下面的3号规定来确定

如果top、height、bottom都不是auto，如果margin-top和margin-bottom都是auto，那么根据等式计算出margin-top和margin-bottom的值，他们俩相等。如果margin-top和margin-bottom只有一个是auto，解析等式直接算出为auto的值即可。如果出现了过度限制，那么忽略bottom的值，然后计算得到bottom值

否则，替换margin-top和margin-bottom中的auto为0，按照下面的规则计算：
1. 如果top、height都是auto，而bottom不是auto，高度将根据元素内部高度计算得出（[计算规则在这里](http://dev.w3.org/csswg/css-position/#root-height)），然后算出top
2. 如果top、bottom都是auto，而height不是auto，那么设定top为静态定位时的初始值，然后计算出bottom
3. 如果height和bottom都是auto，而top不是auto，高度将根据元素内部高度计算得出（[计算规则在这里](http://dev.w3.org/csswg/css-position/#root-height)），然后算出top
4. 如果top是auto，而height和bottom不是auto，那么直接算出top
5. 如果height是auto，top和bottom不是auto，那么直接算出height
6. 如果bottom是auto，top和height不是auto，那么直接算出bottom

##Normal flow（文档流）
在文档流中的盒子属于一个格式上下文，可以是BFC（块级格式上下文）或是IFC（内联格式上下文）。

###BFC（Block formatting context）
浮动元素，绝对定位元素，一些块容器元素（display为inline-block，table-celss，table-captions等），或设定了overflow不为visible的元素都会创建BFC

BFC中，盒子将被垂直的一个接一个的从父元素的包含块（containing block）的顶部向下排列。盒子之间的垂直距离由盒子的垂直margin来确定。而相邻的块级元素元元素的margin会发生重叠（collapse）

BFC中，每个盒子的做外边界（左margin边界）触碰到父元素的包含块的左边界（如果是从右往左，则反过来）。就算表现浮动时也是一样，除非盒子建立一个新的BFC。

###IFC（Inline formatting context）
在IFC中，盒子一个接一个的在父元素的包含块中水平布局。水平margin、border、padding将会影响布局，而纵向的则不会。盒子在纵向布局上采用了完全不同的方式：他们的底部或顶部可以相互对齐，或他们内部的文本可以以一个基准线进行对齐。这个包含了一行的多个盒子的矩形区域成为一个行盒子（line box）。

line box的宽度足以包含其内部所有元素。而它的高度则可能比它所包含的最高的盒子还要高。如果一个盒子高度不足以达到line box的高度，我们就可以使用vertical-align来确定它的位置。当很多内联盒子无法被一个line box水平包裹时，它们将分布在两个或者多个垂直堆叠的line box中。这样一个段落实际上就被分成了很多垂直方向分布的line box了。line box在垂直方向上没有间隔，也不会重叠

一般情况下，一个line box的宽度与父元素包含块的宽度相同，line box会顶在父元素包含块的左边界和右边界。一般情况下，在同一个内联格式上下文中，所有的line box的宽度是一样的。但如果出现了浮动的话，水平宽度也会由于浮动而变化。在同一个内联格式上下文中的line box的高度经常很多样，其根据line box内部包含的子元素来确定的（如果都是文字的话没什么区别，但是又是偶会包含一些图片）

当一个内联盒子超出了line box的宽度，那么它被分割到多个盒子中，而这些盒子将被分配到多个line box中。如果一个内敛盒子不能被分割，那么这个内联盒子将溢出其所在的line box

当一个内联盒子被拆分，margin、border、padding在分割的地方不会有视觉效果

内联盒子也可以由于unicode-bidi和direction的设定被拆分到多个统一line box中。

line box的创建是根据需要的内容大小来的。line box不包含文字，也没有留白，没有margin、padding、border，并且不以一个保留的0高度的（被当做不存在）line box而结束

line box的高度有如下计算方式：
1. 计算出line box内部的每个内联盒子的高度。对于替换元素、inline-block元素和inline-table元素，他们的高度是整个margin box的高度。而对于内联盒子，值是他们的line-height属性。
2. 内联盒子在垂直方向上根据他们的vertival-align属性来分布。当值为top或bottom时，他们必须以最小化line box高度的方式排布。如果那个盒子足够高，就会撑开line box
3. line box的height属性是最上面盒子的顶端到最下面盒子的底端的值

空的inline元素元素会生成空的内联盒子。但这些盒子一样有自己的margin、padding、border以及一个line heihgt，一样会影响行盒的计算

##display，position和float相互关系
这桑格元素都会影响盒子的生成和布局，他们有如下相互影响的规则：
1. 如果display是none，那么position和float不会起作用。这个元素压根就不会生成盒子
2. 如果display不是none，如果position的值为absolute，page或者fixed，而float值为left或right，那么盒子会绝对定位同时float值将被设为none。display属性将根据下面这张表来确定。由于使用了绝对定位，盒子的位置由其top、right、botton、left属性和盒子所属的包含块确定
3. 否则，如果float不是none。那么盒子将是浮动定位，而且display属性将按照如下表格确定
4. 否则，如果盒子是根元素，display属性将按照如下表格确定
5. 否则，将运用display属性

![display属性转换表](http://lingyu.wang/img/layout/4.png)

