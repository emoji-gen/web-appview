'use strict'

const del = require('del')

const gulp = require('gulp')
const ejs = require('gulp-ejs')
const plumber = require('gulp-plumber')
const rename = require('gulp-rename')

// --------------------------------------------------------

gulp.task('clean', () =>
  del(['public/*.html'])
)

gulp.task('ejs', () =>
  gulp.src('docs/*.ejs')
    .pipe(plumber())
    .pipe(ejs())
    .pipe(rename({ extname: '.html' }))
    .pipe(gulp.dest('public'))
)

gulp.task('default', gulp.series('clean', 'ejs'))

