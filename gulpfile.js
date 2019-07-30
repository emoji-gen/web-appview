'use strict'

const del = require('del')

const gulp = require('gulp')
const nunjucks = require('gulp-nunjucks')
const plumber = require('gulp-plumber')
const rename = require('gulp-rename')


// ------ ejs ---------------------------------------------

gulp.task('ejs', () =>
  gulp.src([
    'docs/**/*.j2',
    '!docs/*.j2',
    '!docs/includes/**/*.j2',
  ])
    .pipe(nunjucks.compile())
    .pipe(rename({ extname: '.html' }))
    .pipe(gulp.dest('public'))
)

gulp.task('watch-ejs', () => {
  gulp.watch(['docs/**/*.j2'], gulp.task('ejs'))
})


// ------ clean -------------------------------------------

gulp.task('clean', () =>
  del(['public/**/*.html'])
)


// ------ for production ----------------------------------

gulp.task('default', gulp.series('clean', 'ejs'))


// ------ for development ---------------------------------

gulp.task('watch', gulp.series('clean', 'ejs', 'watch-ejs'))
