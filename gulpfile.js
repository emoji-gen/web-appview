'use strict'

const del = require('del')

const gulp = require('gulp')
const nunjucks = require('gulp-nunjucks')
const plumber = require('gulp-plumber')
const rename = require('gulp-rename')


// ------ nunjucks ----------------------------------------

gulp.task('nunjucks', () =>
  gulp.src([
    'docs/**/*.j2',
    '!docs/*.j2',
    '!docs/includes/**/*.j2',
  ])
    .pipe(nunjucks.compile())
    .pipe(rename({ extname: '.html' }))
    .pipe(gulp.dest('public'))
)

gulp.task('nunjucks-watch', () => {
  gulp.watch(['docs/**/*.j2'], gulp.task('nunjucks'))
})


// ------ clean -------------------------------------------

gulp.task('clean', () =>
  del(['public/**/*.html'])
)


// ------ for production ----------------------------------

gulp.task('default', gulp.series('clean', 'nunjucks'))


// ------ for development ---------------------------------

gulp.task('watch', gulp.series('clean', 'nunjucks', 'nunjucks-watch'))
