var fs = require('fs-extra');
var gulp = require('gulp');
var path = require('path');
var less = require('gulp-less');
var ttkm = require('gulp-ttkm');
var through = require('through2');
var iconv = require('iconv-lite');
var gutil = require('gulp-util');
var code = require('gulp-code')
var plumber = require('gulp-plumber');

var pkg = JSON.parse(fs.readFileSync('./package.json'));

function err(error) {
    console.error(gutil.colors.red("[ERROR]: " + error.message));
    this.emit('end');
}

gulp.task('builda', function(callback) {
    fs.removeSync('./templates');
    var exec = require('child_process').exec;
    exec("clam build vm", function(err, stdout) {
        if (err) console.log(err);
        callback();
    });
});

gulp.task('replacevm', ['buildvm'], function() {
    return gulp.src('./templates/**/*.vm')
        .pipe(through.obj(function(file, encoding, callback) {

            if (file.isNull()) {
                this.push(file);
                return callback();
            }

            if (file.isStream()) {
                return callback('Streaming not supported');
            }

            var contents = new String(file.contents);

            //替换control路径
            contents = contents.replace(/\$control\.setTemplate\(\"/g, '$control.setTemplate("mobile/');


            if (file.path.indexOf('layout/mobileDetail') != -1) {
                //将script移动到页尾
                contents = contents.replace(/<\/body>/, function($, $1, $2, $3) {
                    return '<script src="http://g.tbcdn.cn/??kissy/k/1.4.2/seed-min.js,mtb/lib-mtop/0.4.6/mtop_all.js,tm/detail-m/' + pkg.version + '/seed.js,tm/detail-m/' + pkg.version + '/base.js,tm/detail-m/' + pkg.version + '/index.js"></script>\r\n</body>';
                });
                contents = contents.replace('<script type="text/javascript" src="http://g.tbcdn.cn/??kissy/k/1.4.2/seed-min.js,mtb/lib-mtop/0.4.6/mtop_all.js,tm/detail-m/1.6.5/seed.js,tm/detail-m/1.6.5/base.js,tm/detail-m/1.6.5/index.js"></script>', '');
            }

            if (file.path.indexOf('screen') != -1) {
                contents = contents.replace('<script src="http://g.tbcdn.cn/??kissy/k/1.4.2/seed-min.js,mtb/lib-mtop/0.4.6/mtop_all.js,tm/detail-m/${__version__}/seed.js,tm/detail-m/${__version__}/base.js,tm/detail-m/${__version__}/index.js"></script>"></script>', '');
            }

            if (file.path.indexOf('layout/mobileCombo') != -1) {
                //将script移动到页尾
                contents = contents.replace(/<\/body>/, function($, $1, $2, $3) {
                    return '<script src="http://g.tbcdn.cn/??kissy/k/1.4.2/seed-min.js,mtb/lib-mtop/0.4.6/mtop_all.js,tm/detail-m/' + pkg.version + '/seed.js,tm/detail-m/' + pkg.version + '/base.js,tm/detail-m/' + pkg.version + '/combo.js"></script>\r\n</body>';
                });
                contents = contents.replace('<script type="text/javascript" src="http://g.tbcdn.cn/??kissy/k/1.4.2/seed-min.js,mtb/lib-mtop/0.4.6/mtop_all.js,tm/detail-m/1.6.5/seed.js,tm/detail-m/1.6.5/base.js,tm/detail-m/1.6.5/combo.js"></script>', '');
            }


            //不转义输出
            contents = contents.replace(/\$\!\{noescape_([\S]+)_noescape\}/ig, function($, $1) {
                return '$!securityUtil.ignoretext($' + $1 + ')';
            });



            //不转义输出
            contents = contents.replace(/<\!--version-->/ig, function($, $1) {
                return pkg.version;
            });

            contents = contents.replace('<meta charset="utf-8" />', '<meta charset="gbk" />');
            contents = iconv.encode(contents, 'gbk');
            file.contents = new Buffer(contents);
            this.push(file);
            callback();
        }))
        .pipe(gulp.dest('./templates'))
});

gulp.task('vm', ['replacevm'], function(callback) {
    fs.renameSync('./templates/control', './templates/control2');
    fs.mkdirsSync('./templates/control/mobile');
    fs.copySync('./templates/control2', './templates/control/mobile');
    fs.copySync('./src/config.json', './templates/control/openModule/assetshub/config/mobile.vm');
    fs.removeSync('./templates/control2');
    callback();
});

gulp.task('tpl', function() {
    return gulp.src('./src/**/*.juicer')
        .pipe(plumber(err))
        .pipe(ttkm({
            package: pkg.name
        }))
        .pipe(code.lint())
        .pipe(gulp.dest('./src'));
});

gulp.task('css', function() {
    return gulp.src(['./src/**/*.less', '!./src/less/**/*.less'])
        .pipe(plumber(err))
        .pipe(less({
            paths: [path.join(__dirname)],
            relativeUrls: true
        }))
        .pipe(code.lint())
        .pipe(code.minify())
        .pipe(gulp.dest('build'))
});

gulp.task('js', ['tpl'], function() {
    return gulp.src(['src/**/*.js', '!./src/js/**/*.js'])
        .pipe(plumber(err))
        .pipe(code.lint())
        .pipe(code.dep({
            package: pkg.name,
            path: 'http://g.tbcdn.cn/tm/' + pkg.name + '/' + pkg.version + '/',
            group: 'group1'
        }))
        .pipe(code.minify())
        .pipe(gulp.dest('build'))


});

gulp.task('builda', ['css', 'tpl', 'js', 'vm']);

var spawn = require('child_process').spawn;
gulp.task('push', ['default'], function(done) {
    var v = process.argv[3];
    if (!v) {
        v = 'daily/' + pkg.version;
    }
    var m = process.argv[4];
    var version = v;
    var msg = m ? m : 'bugfx';
    var shellCfg = {
        env: process.env,
        cwd: path.resolve('.'),
        stdio: [
            process.stdin,
            process.stdout,
            process.stderr
        ]
    };
    var psAdd = spawn('git', ['add', '-A', '.'], shellCfg);
    psAdd.on('close', function() {
        var psCi = spawn('git', ['commit', '-m', msg], shellCfg);
        psCi.on('close', function() {
            var psPull = spawn('git', ['pull'], shellCfg);
            psPull.on('close', function() {
                var psPush = spawn('git', ['push', 'origin', version], shellCfg);
                psPush.on('close', function() {
                    done();
                });
            });
        });
    });
});

gulp.task('build', function() {
    gulp.watch([
        './src/**/*.less',
        './img/**'
    ], ['css']);

    gulp.watch([
        './src/**/*.js',
        './src/**/*.juicer',
        '!./src/**/*.juicer.js'
    ], ['js']);

    gulp.watch([
        './src/**/*.html'
    ], ['vm']);
});


gulp.task('server', function(done) {
    var shellCfg = {
        env: process.env,
        cwd: path.resolve('.'),
        stdio: [
            process.stdin,
            process.stdout,
            process.stderr
        ]
    };
    var serverMonitor = spawn('node', ['--harmony', 'demoServer.js'], shellCfg);
    serverMonitor.on('close', function() {
        done();
    });
});