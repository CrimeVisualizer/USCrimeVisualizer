module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    shell: {
      options: {
        stdout: true,
        stderr: true
      },
      mongoimport: {
        command: 'mongoimport --db USCrime --collection crimes --type csv --headerline --file ./test.csv'
      }
    },
    nodemon: {
      dev: {
        script: './bin/www'
      }
    }
  });

  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-nodemon');

  ////////////////////////////////////////////////////
  // Main grunt tasks
  ////////////////////////////////////////////////////
  
  // Imports test.csv into your mongo database
  grunt.registerTask('import', function(n) {
    grunt.task.run(['shell:mongoimport']);
  });
  // Starts server
  grunt.registerTask('default', function(n) {
    grunt.task.run(['nodemon']);
  });
};