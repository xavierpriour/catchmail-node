'use strict';

module.exports = function(grunt) {
  require('load-grunt-tasks')(grunt); // Load grunt tasks automatically

  var jsFiles = [
    'Gruntfile.js',
    'lib/*.js',
    'bin/*',
    'test/*.js'
  ];
  // Define the configuration for all the tasks
  grunt.initConfig({
    jshint: {
      options: {
        jshintrc: true
      },
      all: jsFiles
    },

    jscs: {
      options: {
        config: '.jscsrc'
      },
      src: jsFiles
    },

    mochaTest: {
      options: {
        clearRequireCache: true
      },
      test: {
        src: ['test/*.js']
      }
    },

    // Watches files for changes and runs tasks based on the changed files
    watch: {
      options: {
        // we don't want to lose the environment, specially the stage
        spawn: false
      },
      gruntfile: {
        files: ['Gruntfile.js']
        // no tasks, this automatically triggers a watch restart
      },
      js: {
        files: jsFiles,
        tasks: ['test']
      }
    }
  });

  grunt.registerTask('build', [
    //'clean:stage',
    //'copy',
    //'compile',
    //'patch',
    //'symlink',
  ]);

  grunt.registerTask('test', [
    'jshint',
    'jscs',
    'mochaTest',
  ]);

  grunt.registerTask('serve', [
    'watch',
  ]);

  grunt.registerTask('default', [
    'build',
    'test',
    'serve'
  ]);
};
