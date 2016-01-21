/* eslint-env node */
const gulp = require('gulp');
const gutil = require('gulp-util');
const rename = require('gulp-rename');
const eslint = require('gulp-eslint');
const uglify = require('gulp-uglify');
const webpack = require('webpack');
const Testem = require('testem');
const yaml = require('js-yaml');
const fs = require('fs');
const del = require('del');
const run = require('run-sequence');

gulp.task('clean', (done) => {
  del(['.tmp', 'dist'], done);
});

gulp.task('eslint', () => {
  return gulp.src('src/**/*.js')
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

gulp.task('webpack', (done) => {
  webpack(require('./webpack.config'), (err, stats) => {
    if (err) throw new gutil.PluginError('webpack', err);
    gutil.log('[webpack]', stats.toString());
    done();
  });
});

gulp.task('webpack:dev', () => {
  const compiler = webpack(require('./webpack.config.dev'));

  compiler.watch(200, (err, stats) => {
    if (err) throw new gutil.PluginError('webpack', err);
    gutil.log('[webpack]', stats.toString());
  });
});

gulp.task('webpack:test', () => {
  const compiler = webpack(require('./webpack.config.test'));

  compiler.watch(200, (err) => {
    if (err) throw new gutil.PluginError('webpack', err);
  });
});

gulp.task('testem', () => {
  const testem = new Testem();
  testem.startDev(yaml.safeLoad(fs.readFileSync(__dirname + '/testem.yml')));
});

gulp.task('uglify', () => {
  return gulp.src(['dist/**/*.js', '!**/*.min.js'])
    .pipe(uglify())
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest('dist'));
});

gulp.task('build', ['eslint'], (done) => {
  run('webpack', 'uglify', done);
});

gulp.task('test', ['webpack:test', 'testem']);
gulp.task('default', ['webpack:dev']);
