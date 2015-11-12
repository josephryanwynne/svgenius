module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      build: {
        src: 'src/<%= pkg.name %>.js',
        dest: 'build/<%= pkg.name %>.min.js'
      }
    },
    jshint: {
        src: ['src/*.js']
    },
    jslint: {
      // lint the source
      src: {
        // files to lint
        src: [
          'src/svgenius.js'
            ]
      }
    },
      jsbeautifier : {
    files : ["src/**/*.js"],
    options : {
    }
}
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-jslint');
    grunt.loadNpmTasks("grunt-jsbeautifier");

    
  // Default task(s).
  grunt.registerTask('default', ['uglify', 'jslint']);
};