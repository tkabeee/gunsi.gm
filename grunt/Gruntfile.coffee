module.exports = (grunt) ->

  pkg = grunt.file.readJSON '/Users/sdkondo/Work/Grunt/package.json'

  grunt.initConfig

    #config
    js_files:   "../web/js"
    css_files:  "../web/css"
    scss_files: "../web/sass"

    #task
    concat:
      basic_set_css:
        src: [
            '<%= css_files %>/reset.css'
            '<%= css_files %>/normalize.css'
          ]

        dest: '<%= css_files %>/bset.css'

    cssmin:
      css:
        files:
          '<%= css_files %>/bset.min.css': ['<%= css_files %>/bset.css']

    uglify:
    	options:
        mangle: true
    	dist:
    		files:
          '<%= js_files %>/app.min.js': ['<%= js_files %>/app.js']

    compass:
      dev:
        options:
          config: 'compass.config.rb'
          environment: 'development'

      prod:
        options:
          config: 'compass.config.rb'
          environment: 'production'

    watch:
      js:
        files: ['<%= js_files %>/*.js']
        tasks: ['js']

      css:
        files: ['<%= scss_files %>/*.scss']
        tasks: ['css']

  grunt.loadNpmTasks 'grunt-contrib-sass'
  grunt.loadNpmTasks 'grunt-contrib-compass'
  grunt.loadNpmTasks 'grunt-contrib-concat'
  grunt.loadNpmTasks 'grunt-contrib-cssmin'
  grunt.loadNpmTasks 'grunt-contrib-uglify'
  grunt.loadNpmTasks 'grunt-contrib-watch'

  grunt.registerTask 'js', [
    'uglify'
  ]

  grunt.registerTask 'css', [
    'compass:dev'
    'concat'
    'cssmin'
  ]