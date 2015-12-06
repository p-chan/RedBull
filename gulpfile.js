var path = require('path');

var gulp = require('gulp');
var stylus = require('gulp-stylus');
var nib = require('nib');
var autoprefixer = require('gulp-autoprefixer');
var handlebars = require('handlebars');
var gulpHandlebars = require('gulp-handlebars-html')(handlebars);
var rename = require('gulp-rename');
var plumber = require('gulp-plumber');
var notify = require('gulp-notify');

var browserSync = require('browser-sync');

gulp.task('handlebars', () => {
  gulp.src([
      './app/view/**/*.hbs',
      '!' + './app/view/partials/*.hbs'
    ])
    .pipe(plumber({
      errorHandler: notify.onError("handlebars: <%= error.message %>")
    }))
    .pipe(gulpHandlebars({
      title: 'RedBull'
    }, {
      allowedExtensions: ['hbs'],
      partialsDirectory: ['./app/view/partials']
    }))
    .pipe(rename((path) => {
      path.extname = '.html';
    }))
    .pipe(gulp.dest('./build'))
    .pipe(browserSync.stream());
});

gulp.task('stylus', () => {
  gulp.src('./app/stylus/app.styl')
    .pipe(plumber({
      errorHandler: notify.onError("stylus: <%= error.message %>")
    }))
    .pipe(stylus({
      use: nib()
    }))
    .pipe(autoprefixer({
      browser: ['last 2 versions'],
      cascade: false
    }))
    .pipe(gulp.dest('./build/assets/css'))
    .pipe(browserSync.stream());
});

gulp.task('browser-sync', () => {
  browserSync({
    server: {
      baseDir: './build'
    }
  });
});

gulp.task('default', ['handlebars', 'stylus', 'browser-sync'], () => {
  gulp.watch('./app/view/**/*.hbs', ['handlebars']);
  gulp.watch('./app/stylus/**/*.styl', ['stylus']);
});