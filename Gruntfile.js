var path = require("path");
module.exports = function(grunt) {
  require('load-grunt-tasks')(grunt);
  // 构建任务配置
  grunt.initConfig({
    //读取package.json的内容，形成个json数据
    pkg: grunt.file.readJSON('package.json'),

    clean: {
      initClean: ["build", "_site"],
      doneClean: ["build"]
    },
    // Auto-prefix CSS properties using Can I Use?
    autoprefixer: {
      options: {
        browsers: ['last 2 version', 'ie 9']
      },
      multiple_files: {
        expand: true,
        flatten: true,
        src: 'src/css/*.css', // -> src/css/file1.css, src/css/file2.css
        dest: 'build/css/' // -> dest/css/file1.css, dest/css/file2.css
      },
    },

    // Minify CSS
    cssmin: {
      minify: {
        expand: true,
        cwd: 'build/css/',
        src: ['*.css', '!*.min.css'],
        dest: 'build/css/',
        ext: '.min.css'
      }
    },

    // Uglify JavaScript
    uglify: {
      my_target: {
        files: {
          'build/js/editor.min.js': ['src/js/editor.js']
        }
      }
    },

    // Watch files for changes
    watch: {
      css: {
        files: [
          'css/*',
          'js/*',
          '!node_modules'
        ],
        tasks: ['autoprefixer', 'cssmin', 'uglify'],
      }
    },

    //generate gitbook
    gitbook: {
      development: {
        output: path.join(__dirname, "build/gitbook"),
        input: "src/gitbook",
        title: "天镶的读书笔记",
        description: "这里记录了天镶读书时的收获和感悟",
        github: "LingyuCoder/blog"
      }
    },
    copy: {
      main: {
        files: [
          {src: 'src/js/main.js', dest: 'build/js/main.min.js'},
          {expand: true, flatten: true, src: ['src/include/*'], dest: 'build/_includes/', filter: 'isFile'},
          {expand: true, flatten: true, src: ['src/template/*'], dest: 'build/_layouts/', filter: 'isFile'},
          {expand: true, flatten: true, src: ['src/json/*'], dest: 'build/', filter: 'isFile'},
          {expand: true, flatten: true, src: ['src/page/*'], dest: 'build/', filter: 'isFile'},
          {expand: true, flatten: true, src: ['src/achieve/*'], dest: 'build/_posts/', filter: 'isFile'},
          {expand: true, flatten: true, src: ['src/other/*'], dest: 'build/', filter: 'isFile'},
          {expand: true, flatten: true, src: ['src/font/*'], dest: 'build/font/', filter: 'isFile'},
          {expand: true, cwd: 'src/img', src: ['**'], dest: 'build/img/'},
        ]
      },
      buildToPublish: {
          files: [{expand: true, cwd: 'build/', src: ['**'], dest: 'publish/'}]
      }
    },

    //jekyll 
    jekyll: {
      options: {
        src: "build/",
        dest: "build/_site/"
      },
      build: {
        dist: {}
      },
      server: {
        options: {
          serve: true
        },
        serve: {}
      }
    },

    'gh-pages': {
      options: {
        base: 'build',
        branch: 'gh-pages',
        repo: 'git@github.com:LingyuCoder/blog.git',
        message: '小管家自动提交',
        user: {
          name: 'Skyinlayer',
          email: 'lingyucoder@gmail.com'
        },
        clone: 'publish',
        tag: 'v<%= pkg.version %>',
        push: true,
      },
      src: ['**']
    }
  });
  
  grunt.registerTask('build', ['autoprefixer', 'cssmin', 'uglify', 'gitbook', 'copy']);

  grunt.registerTask('default', ['clean:initClean', 'build', 'jekyll:build']);

  grunt.registerTask('server', ['clean:initClean', 'build', 'jekyll:server']);

  grunt.registerTask('publish', ['default', 'copy:buildToPublish','gh-pages']);
};