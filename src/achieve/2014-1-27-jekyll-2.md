---
layout: art
title: 使用Jekyll在Github上搭建个人博客（博客编写）
subTitle: 使用jekyll搭建github博客系列
desc: 系列博文使用jekyll搭建github博客系列文章第二篇，本文主要介绍了如何编写jekyll博客，如何在浏览器中查看效果
categories: [网站建设]
tags: [github, jekyll]
---
{% raw %} 
系列文章传送门：

[使用Jekyll在Github上搭建个人博客（环境搭建）](http://lingyu.wang#/art/blog/2014/01/25/jekyll-1/)

这篇文章主要介绍博客内容的编写及本地测试，内容主要来自[Jekyll的文档](http://jekyllrb.com/docs/home/)、[Liquid的文档](http://docs.shopify.com/themes/liquid-basics)
##创建项目
---
到想要创建项目的文件夹下（如d:/），运行命令：
```shell
jekyll new blog
```
这样就会创建一个新文件夹d:/blog，其结构如下：
1. 文件夹\_layouts：用于存放模板的文件夹，里面有两个模板，default.html和post.html
2. 文件夹\_posts：用于存放博客文章的文件夹，里面有一篇markdown格式的文章--2014-01-27-welcome-to-jekyll.markdown
3. 文件夹css：存放博客所用css的文件夹
4. .gitignore：可以删掉，后面会将项目添加到git项目，所以这个不需要了
5. \_coinfig.yml：jekyll的配置文件，里面可以定义相当多的配置参数，具体配置参数可以参照其[官网](http://jekyllrb.com/docs/configuration/)
6. index.html：项目的首页

根据实际需要，可能还需要创建如下文件或文件夹：
1. \_includes:用于存放一些固定的HTML代码段，文件为.html格式，可以在模板中通过liquid标签引入，常用来在各个模板中复用如 导航条、标签栏、侧边栏 之类的在每个页面上都一样不变的内容，需要注意的是，这个代码段也可以是未被编译的，也就是说也可以使用liquid标签放在这些代码段中
2. image和js等自定义文件夹：用来存放一些需要的资源文件，如图片或者javascript文件，可以任意命名
3. CNAME文件：用来在github上做域名绑定的，将在后面介绍
4. favicon.ico：网站的小图标
5. 
....

创建完需要的文件夹之后，首先需要修改的就是jekyll的配置文件\_config.yml，这个配置文件的内容相当多，详细见[官方文档](http://jekyllrb.com/docs/configuration/)，如果没有太多的额外需求，只需要设定两个参数就行了，一个是编码的字符集，一个是项目的路径，我这里是这么设定的：
```
baseurl: /
encoding: utf-8
```

这样一个博客项目就创建完成了

##编写博文
---
大致上jekyll生成html的流程，jekyll首先会读取如下内容进入内存中：
1. \_posts及文件夹下的所有文章，将其参数和文章内容组织保存在内存中，所有的文章的内容、参数都在site.posts对象（其他文件夹下的文章不会放入site.posts中）
2. \_layouts文件夹下的所有模板
3. \_includes文件夹下的所有需要被引入的内容

然后根据每一篇需要编译的文章选择的其参数定义的模板来创建一个模板，并将当前文章的内容、参数等进行扩展后放在page对象、content对象中，然后进行模板的编译，生成html文件，并按照一定规则放在\_site文件夹下。也就是说在创建一篇文章时，其实所有文章的内容都已经被读取出来了，这也为文章相互之间的关联提供了可能

可以看一下_posts下的jekyll给的例子：
```markdown
---
layout: post
title:  "Welcome to Jekyll!"
date:   2014-01-27 21:57:11
categories: jekyll update
---

You'll find this post in your `_posts` directory - edit this post and re-build (or run with the `-w` switch) to see your changes!
To add new posts, simply add a file in the `_posts` directory that follows the convention: YYYY-MM-DD-name-of-post.ext.

Jekyll also offers powerful support for code snippets:

{% highlight ruby %}
def print_hi(name)
  puts "Hi, #{name}"
end
print_hi('Tom')
#=> prints 'Hi, Tom' to STDOUT.
{% endhighlight %}

Check out the [Jekyll docs][jekyll] for more info on how to get the most out of Jekyll. File all bugs/feature requests at [Jekyll's GitHub repo][jekyll-gh].

[jekyll-gh]: https://github.com/mojombo/jekyll
[jekyll]:    http://jekyllrb.com
```
可以看到在博文的最上方有被两个```---```包裹起来的一段，这里就定义了文章的一些参数，更多参数在[FrontMatter](http://jekyllrb.com/docs/frontmatter/)和[Variables](http://jekyllrb.com/docs/variables/)获取，简单的只需要关注几个就好：
1. title：文章的标题
2. date：文章的日期
3. categories：定义了文章所属的目录，一个list，将会根据这个目录的list来创建目录并将文章html放在生成的目录下，文章分类时候用，这里就不使用了
4. layout：文章所使用的模板名称，也就是\_layouts中定义的模板的文件名去掉.html
5. tags：例子中没有，定义了文章的标签，也是一个list，文章分类时候用，这里就不使用了

这里就写一个最简单的文章，只是用其中的两个参数：layout，title，如下：
```
---
layout: mylayout
title: hello-jekyll
---

Hello jekyll!
```
将这个写完的文章保存为  “年-月-日-标题.markdown”的名字形式，因为如果不修改permlinks，jekyll会根据文章的标题来创建文件夹，如2014-01-27-hello会创建成/2014/01/27/hello.html。这里就保存成2014-01-27-hello.markdown

ps：文章的文件名不要使用中文，否则会出现bug，因为在url中会escape，而服务器查找却是按照escape后的字符串去查找
，就会出现找不到文章的情况，使用英文代替就好，定义了title变量就无所谓文件名中标题的内容了

博客不能没有主页，所以我们修改index.html文件如下：
```html
---
layout: mylayout
title: Hello Jekyll!
---
<ul class="posts">
{% for post in site.posts %}
  <li><span>{{ post.date | date_to_string }}</span> &raquo; <a href="{{ post.url }}">{{ post.title }}</a></li>
{% endfor %}
</ul>
```
还是使用我们刚才的模板，这回编译完成后生成的结果如下：
```html
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <title>test</title>
    </head>
    <body>
        Hello Jekyll!
        <ul class="posts">
          <li><span>27 Jan 2014</span> &raquo; <a href="/2014/01/27/hello.html">hello-jekyll</a></li>
        </ul>
    </body>
</html>
```
由于index文件名中没有时间，所以时间直接被忽略了，而内容段则通过liquid的for标签进行了迭代，遍历了\_posts下的所有文章，将其文章的时间、路径、标题组织成html文件，生成指向博文的连接

##创建模板
---
我们可以打开jekyll给的例子default.html看一看模板的结构:
```html
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
        <title>{{ page.title }}</title>
        <meta name="viewport" content="width=device-width">

        <!-- syntax highlighting CSS -->
        <link rel="stylesheet" href="/css/syntax.css">

        <!-- Custom CSS -->
        <link rel="stylesheet" href="/css/main.css">

    </head>
    <body>

        <div class="site">
          <div class="header">
            <h1 class="title"><a href="/">{{ site.name }}</a></h1>
            <a class="extra" href="/">home</a>
          </div>

          {{ content }}

          <div class="footer">
            <div class="contact">
              <p>
                Your Name<br />
                What You Are<br />
                you@example.com
              </p>
            </div>
            <div class="contact">
              <p>
                <a href="https://github.com/yourusername">github.com/yourusername</a><br />
                <a href="https://twitter.com/yourusername">twitter.com/yourusername</a><br />
              </p>
            </div>
          </div>
        </div>

    </body>
</html>
```
可以看到，模板和普通的html文件几乎是一样的。jekyll使用的是一个叫liquid的模板引擎创建html文件，这个模板引擎也有[详细的文档](http://docs.shopify.com/themes/liquid-basics)，现在就只关注其中比较核心的部分，文章的标题和文章的内容

可以看到模板的有这么两句{{ page.title }}, {{ content }}，这两句就分别是文章标题和文章内容的占位符，如果有文章使用了这个模板，如过使用上面写的那篇hello的文章，标题就是hello-jekyll，content就是Hello jekyll!，这里定义一个自己的新模板，保存为mylayout.html
```html
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <title>test</title>
    </head>
    <body>
          {{ page.title }}
          {{ page.date }}
          {{ content }}
    </body>
</html>
```
第一行是标题，然后是博文时间（在文件名中定义），然后是博文内容
这样一个简单的模板就创建好了

##调试
---
在博客文件夹下，在命令行中输入```jekyll build --trace```就可以将所有文章文件根据其模板进行编译，生成结果，放在根目录下的\_site中，这里我们使用后，会出现如下结果：\blog\\\_site\2014\01\27文件夹下有一个hello.html，其内容为：
```html
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <title>test</title>
    </head>
    <body>
          hello-jekyll
          2014-01-27 00:00:00 +0800
          <p>Hello jekyll!</p>
    </body>
</html>
```
可以看到，这就是编译完的博文文件，如我们设定的，第一行是标题，然后是文件名定义的时间，然后是博文内容，如果编译错误，将会在命令行中看到一个错误栈，可以方便调试，具体哪里出错了，如果不需要看错误栈，直接使用```jekyll build```就行了

如果想要在本地开启一个服务器查看效果，可以使用命令```jekyll serve```，这样会开启一个监听端口4000的服务器，浏览器中查看localhost:4000，则会进入index.html的内容中，点击文章的标题就可以跳转到具体的博文了
{% endraw %}


