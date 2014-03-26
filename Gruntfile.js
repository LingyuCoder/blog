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
            src: 'css/*.css', // -> src/css/file1.css, src/css/file2.css
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
        }
    });
    // 默认执行的任务
    grunt.registerTask('default', ['autoprefixer','cssmin', 'uglify', 'watch']);
};