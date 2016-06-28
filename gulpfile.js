/*
  gulpfile.js
  ===========
  Rather than manage one giant configuration file responsible
  for creating multiple tasks, each task has been broken out into
  its own file in gulp/tasks. Any files in that directory get
  automatically required below.
  To add a new task, simply add a new task file that directory.
  gulp/tasks/default.js specifies the default set of tasks to run
  when you run `gulp`.
*/
var gulp = require('gulp'),
    browserify = require('browserify'),
    glob = require("glob"),
    source = require('vinyl-source-stream'),
    buffer = require('vinyl-buffer'),
    rename = require('gulp-rename'),
    minifycss = require('gulp-minify-css'),
    uglify = require('gulp-uglify'),
    runSequence = require('run-sequence'),
    header = require('gulp-header');

var G_PATH={
  basePath:'./',
  srcPath:'lib/',
  cssPath:'css/',
  distPath:'dist'
};

function buildHeader () {
  var pkg = require('./package.json');
  var banner = ['/**',
    ' * @providesModule <%= pkg.name %> - <%= pkg.description %>',
    ' * @author <%= pkg.author %>',
    ' * @version v<%= pkg.version %>',
    ' * @link <%= pkg.homepage %>',
    ' * @license <%= pkg.license %>',
    ' * @time '+ getTime(),
    ' */',
    ''
  ].join('\n');
  return header(banner, { pkg: pkg });
}
function getTime(){
  var date=new Date();
  var year=date.getFullYear();
  var month=date.getMonth()+1;
  var d=date.getDate();
  var h=date.getHours();
  var m=date.getMinutes();
  var s=date.getSeconds();
  h=h<10?'0'+h:h;
  m=m<10?'0'+m:m;
  s=s<10?'0'+s:s;
  var time=year+'-'+month+'-'+d+' '+h+':'+m+':'+s;
  return time;
}

//browserify
gulp.task('browserify', function(cb) {
  glob(G_PATH.srcPath+'test.indexeddb.js', {nodir: true}, function(err, files) {
    var b = browserify();
    files.forEach(function(file) {
      b.add(file);
    });
    b.bundle()
      .pipe(source('test.indexeddb.js'))
      .pipe(buffer())
      .pipe(uglify())
      .pipe(rename({suffix: '.min'}))
      .pipe(buildHeader())
      .pipe(gulp.dest(G_PATH.distPath));
    cb();
  });
});

//minifycss
gulp.task('minifycss', function() {
    return gulp.src(G_PATH.cssPath+'css.css')
        .pipe(minifycss())
        .pipe(rename({suffix: '.min'}))
        .pipe(buildHeader())
        .pipe(gulp.dest(G_PATH.distPath));
});

//minifyjs
gulp.task('minifyjs', function() {
    return gulp.src(G_PATH.srcPath+'fm-*.js')
        .pipe(uglify())
        .pipe(rename({suffix: '.min'}))
        .pipe(buildHeader())
        .pipe(gulp.dest(G_PATH.distPath));
});

gulp.task('deploy', function() {
  runSequence('browserify','minifycss','minifyjs');
});

gulp.task('default',['deploy']);