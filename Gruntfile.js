module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    htmlmin: {
      dist: {
        options: {
          collapseWhitespace: true,
          minifyCSS: true,
          minifyJS: true,
          preventAttributesEscaping: true,
          useShortDoctype: true,
        },
        files: {
          'min.chat.html': 'chat.html'
        }
      }
    },
    insert: {
      options: {},
      main: {
          src: 'min.chat.html',
          dest: 'chat.js',
          match: '// INSERT HERE'
      }
    },
    uglify: {
      my_target: {
        files: {
          'dist/chat.min.js': ['chat.js']
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-htmlmin');
  grunt.loadNpmTasks('grunt-insert');

  grunt.registerTask('default', ['htmlmin', 'insert', 'uglify']);
};