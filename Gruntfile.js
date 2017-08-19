module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    env : {
      prod: {
        src: "settings.json"
      }
    },
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
    },
    'string-replace': {
      inline: {
        files: {
          'chat.html':'chat.html'
        },
        options: {
          replacements: [
            {
              pattern: '<SOCKET_SERVER_DOMAIN>',
              replacement: '<%= serverDomain %>'
            },
            {
              pattern: '<SOCKET_SERVER_PATH>',
              replacement: '<%= serverPath %>'
            },
            {
              pattern: '<SOCKET_SERVER_CONNECTION_METHOD>',
              replacement: '<%= socketConnectionStrategy %>'
            }
          ]
        }
      }
    }
  });

  grunt.registerTask('loadconfig', 'Load configuration from settings.json', function() {
    grunt.config('serverDomain', process.env.serverDomain);
    grunt.config('serverPath', process.env.serverPath);
    grunt.config('socketConnectionStrategy', process.env.socketConnectionStrategy);
    console.log('process.env.serverUrl',process.env.serverUrl)
    console.log('process.env.socketConnectionStrategy',process.env.socketConnectionStrategy)
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-htmlmin');
  grunt.loadNpmTasks('grunt-insert');
  grunt.loadNpmTasks('grunt-env');
  grunt.loadNpmTasks('grunt-string-replace');

  grunt.registerTask('default', ['env:prod', 'loadconfig', 'string-replace', 'htmlmin', 'insert', 'uglify']);
};