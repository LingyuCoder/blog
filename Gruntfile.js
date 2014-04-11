var path = require("path");
module.exports = function(grunt) {
  require('load-grunt-tasks')(grunt);
  // 构建任务配置
  grunt.initConfig({
    //读取package.json的内容，形成个json数据
    pkg: grunt.file.readJSON('package.json'),

    // Auto-prefix CSS properties using Can I Use?
    autoprefixer: {
      multiple_files: {
        expand: true,
        flatten: true,
        src: 'css/*.min.css', // -> src/css/file1.css, src/css/file2.css
        dest: 'css/' // -> dest/css/file1.css, dest/css/file2.css
      },
    },

    // Minify CSS
    cssmin: {
      minify: {
        expand: true,
        cwd: 'css/',
        src: ['*.css', '!*.min.css'],
        dest: 'css/',
        ext: '.min.css'
      }
    },

    // Uglify JavaScript
    uglify: {
      my_target: {
        files: {
          'js/md_editor.min.js': ['js/md_editor.js']
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
        output: path.join(__dirname, "gitbook"),
        input: "./gitbook-src",
        title: "天镶的读书笔记",
        description: "这里记录了天镶读书时的收获和感悟",
        github: "LingyuCoder/blog"
      }
    },

    //jekyll 
    jekyll: {
      dist: {
        options: {
          config: '_config.yml',
        }
      }
    },

    'gh-pages': {
      options: {
        base: '.',
        add: true,
        branch: 'gh-pages',
        repo: 'git@github.com:LingyuCoder/blog.git',
        message: '小管家自动提交',
        user: {
          name: 'Skyinlayer',
          email: 'lingyucoder@gmail.com'
        },
        tag: 'v<%= pkg.version %>',
        push: true,
      },
      src: ['**']
    }
  });
  grunt.registerTask('publish', ['cssmin', 'autoprefixer', 'uglify', 'gitbook', 'jekyll', 'gh-pages']);
  // 默认执行的任务
  grunt.registerTask('default', ['cssmin', 'autoprefixer', 'uglify', 'gitbook', 'jekyll']);
};