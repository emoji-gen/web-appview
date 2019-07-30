'use strict'

const del = require('del')

const gulp = require('gulp')
const nunjucks = require('gulp-nunjucks')
const plumber = require('gulp-plumber')
const rename = require('gulp-rename')

// --------------------------------------------------------

const isDev = process.argv.includes('watch')
const siteUrl = isDev ? '/appview' : '//emoji-gen.ninja/appview';

// ------ nunjucks ----------------------------------------

gulp.task('nunjucks', () =>
  gulp.src([
    'templates/**/*.j2',
    '!templates/*.j2',
    '!templates/includes/**/*.j2',
  ])
    .pipe(plumber())
    .pipe(nunjucks.compile({ siteUrl }))
    .pipe(rename({ extname: '.html' }))
    .pipe(gulp.dest('public'))
)

gulp.task('nunjucks-watch', () => {
  gulp.watch(['templates/**/*.j2'], gulp.task('nunjucks'))
})


// ------ clean -------------------------------------------

gulp.task('clean', () =>
  del(['public/**/*.html'])
)


// ------ for production ----------------------------------

gulp.task('default', gulp.series('clean', 'nunjucks'))


// ------ for development ---------------------------------

gulp.task('watch', gulp.series('clean', 'nunjucks', 'nunjucks-watch'))
