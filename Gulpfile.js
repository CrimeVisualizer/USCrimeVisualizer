'use strict';

var gulp = require('gulp');
var nodemon = require('gulp-nodemon');
var bs = require('browser-sync');
var reload = bs.reload;
var when = require('gulp-if');
var shell = require('gulp-shell');


// the paths to our app files
var paths = {
  // all our client app js files, not including 3rd party js files
  scripts: ['client/**/*.js'],
  html: ['client/**/*.html'],
  styles: ['client/layout/style.css'],
  test: ['test/client/**/*.js']
};

// any changes made to your
// client side code will automagically refresh your page
// with the new changes
gulp.task('start', ['serve'], function () {
  bs({
    notify: true,
    // address for server,
    injectChanges: true,
    files: paths.scripts.concat(paths.html, paths.styles),
    proxy: 'localhost:8000'
  });
});

gulp.task('karma', shell.task([
  'karma start'
]));

// start our node server using nodemon
gulp.task('serve', function () {
  nodemon({
    script: './server/bin/www',
    ignore: 'node_modules/**/*.js'
  });
});

gulp.task('default', ['start']);
