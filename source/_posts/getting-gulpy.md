title: Gulp思维 —— Gulp高级技巧
subtitle: Getting gulpy -- Advanced tips for using gulp.js
tags: 
- NodeJs
- JavaScript
- Gulp
categories: 
- NodeJs
date: 2014/10/7
---

**本文翻译自[Getting gulpy -- Advanced tips for using gulp.js](https://medium.com/@webprolific/getting-gulpy-a2010c13d3d5)**

感受过[gulp.js](http://gulpjs.com/)带来的兴奋过后，你需要的不仅仅是它的光鲜，而是切切实实的实例。这篇文章讨论了一些使用gulp.js时常踩的坑，以及一些更加高级和定制化的插件和流的使用技巧。

<!-- more -->

##基本任务
gulp的基本设置拥有非常友好的语法，让你能够非常方便的对文件进行转换：

```javascript
gulp.task('scripts', function() {
    return gulp.src('./src/**/*.js')
        .pipe(uglify())
        .pipe(concat('all.min.js'))
        .pipe(gulp.dest('build/'));
});
```

这种方式能够应付绝大多数情况，但如果你需要更多的定制，很快就会遇到麻烦了。这篇将介绍这其中的一些情况并提供解决方案。

##流不兼容？
使用gulp时，你可能会陷入“流不兼容”的问题。这主要是因为常规流和Vinyl文件对象有差异，或是使用了仅支持buffer（不支持流）库的gulp插件与常规流不兼容。

比如说，你不能直接将常规流与gulp和（或）gulp插件相连。我们创建一个可读流，并尝试使用[gulp-uglify](https://www.npmjs.org/package/gulp-uglify)和[gulp-rename](https://www.npmjs.org/package/gulp-rename)来进行转换，将最后得到的内容交给`gulp.dest()`。下面就是个错误的例子：

```javascript
var uglify = require('gulp-uglify'),
    rename = require('gulp-rename');
gulp.task('bundle', function() {
    return fs.createReadStream('app.js')
        .pipe(uglify())
        .pipe(rename('bundle.min.js'))
        .pipe(gulp.dest('dist/'));
});
```

为什么我们不能将可读流和一个gulp插件直接相连？gulp难道不就是一个基于流的构建系统吗？是的，但上面的例子忽视了一个事实，gulp插件期望的输入是Vinyl文件对象。你不能直接将一个可读流与一个以Vinyl文件对象作为输入的函数（插件）相连

##Vinyl文件对象
gulp使用了[vinyl-fs](https://github.com/wearefractal/vinyl-fs)，它实现了`gulp.src()`和`gulp.dest()`方法。vinyl-fs使用[vinyl](https://github.com/wearefractal/vinyl)文件对象——一种“虚拟文件格式”。如果我们需要将gulp和（或）gulp插件与常规的可读流一起使用，我们就需要先把可读流转换为vinyl。

使用[vinyl-source-stream](https://www.npmjs.org/package/vinyl-source-stream)是个不错的选择，如下：

```javascript
var source = require('vinyl-source-stream'),
    marked = require('gulp-marked');
fs.createReadStream('*.md')
    .pipe(source())
    .pipe(marked())
    .pipe(gulp.dest('dist/'));
```

另外一个例子首先通过[browserify](http://browserify.org/)封装并最终将其转换为一个vinyl流：

```javascript
var browserify = require('browserify'),
    uglify = require('gulp-uglify'),
    source = require('vinyl-source-stream');
gulp.task('bundle', function() {
    return browserify('./src/app.js')
        .bundle()
        .pipe(source(‘bundle.min.js))
        .pipe(uglify())
        .pipe(gulp.dest('dist/'));
});
```

哎呦不错哦。注意我们不再需要使用gulp-rename了，因为vinyl-source-stream创建了一个拥有指定文件名的vinyl文件实例（这样gulp.dest方法将使用这个文件名）

###gulp.dest
这个gulp方法创建了一个可写流，它真的很方便。它重新使用可读流中的文件名，然后在必要时创建文件夹（使用[mkdirp](https://www.npmjs.org/package/mkdirp)）。在写入操作完成后，你能够继续使用这个流（比如：你需要使用gzip压缩数据并写入到其他文件）

##流和buffer
既然你有兴趣使用gulp，这篇文章假设你已经了解了流的基础知识。无论是buffer还是流，vinyl的虚拟文件都能包含在内。使用常规可读流时，你可以监听data事件来检测数据碎片的到来：

```javascript
fs.createReadStream('/usr/share/dict/words').on('data', function(chunk) {
    console.log('Read %d bytes of data', chunk.length);
});
> Read 65536 bytes of data
> Read 65536 bytes of data
> Read 65536 bytes of data
> Read 65536 bytes of data
> ...
```

不同的是，使用`gulp.src()`会将转换成buffer的vinyl文件对象重新写入到流中。也就是说，你获得的不再是数据碎片，而是将内容转换成buffer后的（虚拟）文件。vinyl文件格式拥有一个属性来表示里面是buffer还是流，gulp默认使用buffer：

```javascript
gulp.src('/usr/share/dict/words').on('data', function(file) {
    console.log('Read %d bytes of data', file.contents.length);
});
> Read 2493109 bytes of data
```

这个例子说明了在文件被完整加入到流之前数据会被转换成buffer。

##Gulp默认使用buffer
尽管更加推荐使用流中的数据，但很多插件的底层库使用的是buffer。有时候必须使用buffer，因为转换需要完整的文件内容。比如文本替换和正则表达式的情形。如果使用数据碎片，将会面临匹配失败的风险。同样，像[UglifyJS](http://lisperator.net/uglifyjs/)和[Traceur Compiler](https://github.com/google/traceur-compiler)需要输入完整的文件内容（至少需要语法完整的JavaScript字符串）

这就是为什么gulp默认使用转换成buffer的流，因为这更好处理。

使用转换成buffer的流也有缺点，处理大文件时将非常低效。文件必须完全读取，然后才能被加入到流中。那么问题来了，文件的尺寸多大才会降低性能？对于普通的文本文件，比如JavaScript、CSS、模板等等，这些使用buffer开销非常小。

在任何情况下，如果将buffer选项设为false，你可以告诉gulp流中传递的内容究竟是什么。如下所示：
```javascript
gulp.src('/usr/share/dict/words', {buffer: false}).on('data', function(file) {
    var stream = file.contents;
    stream.on('data', function(chunk) {
        console.log('Read %d bytes of data', chunk.length);
    });
});
> Read 65536 bytes of data
> Read 65536 bytes of data
> Read 65536 bytes of data
> Read 65536 bytes of data
> ...
```

##从流到buffer
由于所需的输入（输出）流和gulp插件不尽相同，你可能需要将流转换成buffer（反之亦然）。之前已经有过介绍，大多数插件使用buffer（尽管他们的一部分也支持流）。比如[gulp-uglify](https://www.npmjs.org/package/gulp-uglify)和[gulp-traceur](https://www.npmjs.org/package/gulp-traceur)。你可以通过[gulp-buffer](https://www.npmjs.org/package/gulp-buffer)来转换成buffer：

```javascript
var source = require('vinyl-source-stream'),
    buffer = require('gulp-buffer'),
    uglify = require('gulp-uglify');
fs.createReadStream('./src/app.js')
    .pipe(source('app.min.js'))
    .pipe(buffer())
    .pipe(uglify())
    .pipe(gulp.dest('dist/'));
```

或者另一个例子：

```javascript
var buffer = require('gulp-buffer'),
    traceur = require('gulp-traceur');
gulp.src('app.js', {buffer: false})
    .pipe(buffer())
    .pipe(traceur())
    .pipe(gulp.dest('dist/'));
```

##将buffer转换为流
你也可以使用[gulp-streamify](https://www.npmjs.org/package/gulp-streamify)或[gulp-stream](https://www.npmjs.org/package/gulp-stream)将一个使用buffer的插件的输出转化为一个可读流。这样处理之后，跟在使用buffer的插件后面的（只能）使用流的插件也能正常工作了。

```javascript
var wrap = require('gulp-wrap'),
    streamify = require('gulp-streamify'),
    uglify = require('gulp-uglify'),
    gzip = require('gulp-gzip');
gulp.src('app.js', {buffer: false})
    .pipe(wrap('(function(){<%= contents %>}());'))
    .pipe(streamify(uglify()))
    .pipe(gulp.dest('build'))
    .pipe(gzip())
    .pipe(gulp.dest('build'));
```

##不是所有事都需要插件
虽然已经有很多使用且方便的插件，很多任务以及转换可以不使用插件而轻易完成。插件会带来一些问题，你需要依赖一个额外的npm模块，一个插件接口和（反应迟钝？）的维护者，等等。如果一个任务可以不使用插件而使用原生模块就能轻易完成，绝大多数情况下，都建议不要使用插件。能够理解上面所说的概念，并能够在所处的情况下做出正确的决定，这点非常重要。下面来看一些例子：

###vinyl-source-stream
之前的例子中，我们已经直接使用了browserify，而不是使用（现已加入黑名单）[gulp-browserify](https://www.npmjs.org/package/gulp-browserify)插件。这里的关键是使用vinyl-source-stream（或类似的库）进行加工，来将常规的可读流输入使用vinyl的插件。

###文本转换
另一个例子就是基于字符串的变换。这里有一个非常基础的插件，直接使用了vinyl的buffer：
```javascript
function modify(modifier) {
    return through2.obj(function(file, encoding, done) {
        var content = modifier(String(file.contents));
        file.contents = new Buffer(content);
        this.push(file);
        done();
    });
}
```
你可以像这样使用这个插件：
```javascript
gulp.task('modify', function() {
    return gulp.src('app.js')
        .pipe(modify(version))
        .pipe(modify(swapStuff))
        .pipe(gulp.dest('build'));
});
function version(data) {
    return data.replace(/__VERSION__/, pkg.version);
}
function swapStuff(data) {
    return data.replace(/(\w+)\s(\w+)/, '$2, $1');
}
```
这个插件并没有完成，而且也不能处理流（[完整版本](https://gist.github.com/webpro/a9a9e14d291c021894b3)）。然而，这个例子说明，可以很轻易地通过一些基本函数来创建新的变换。[through2](https://www.npmjs.org/package/through2)库提供了非常优秀的Node流封装，并且允许像上面那样使用转换函数。

##任务流程
如果你需要去运行一些定制化或动态的任务，了解gulp所使用的[Orchestrator](https://www.npmjs.org/package/orchestrator)模块会很有帮助。`gulp.add`方法其实就是`Orchestrator.add`方法（事实上所有的方法都是从Orchestrator继承而来的）。但为什么你需要这个？
* 你不想“私有任务”（比如：不暴露给命令行工具）弄乱gulp任务列表。
* 你需要更多的动态的和（或）可重用的子任务。

##最后的思考
请注意，gulp（或grunt）并不总是当前情境下的最佳工具。比如说，如果你需要拼接并使用uglify压缩一系列的JavaScript文件，又或者你需要编译一些SASS文件，你可能需要考虑使用makefile或npm run，通过命令行来实现。减少依赖，减少配置，才是正解。

阅读[通过npm run来实现任务自动化](http://substack.net/task_automation_with_npm_run)来了解更多信息。你需要明确通过一系列的“自定义构建”后需要得到什么，而哪个工具最合适。

不过，我觉得gulp是一个伟大的构建系统，我很喜欢使用它，它展现了Node.js中流的强大。

希望这些能够帮到你！如果你有任何反馈或其他提议，请在评论中告诉我，或者加我的twitter：[@webprolific](https://twitter.com/webprolific)