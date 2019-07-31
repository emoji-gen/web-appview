'use strict'

const { basename } = require('path')

const del = require('del')
const yaml = require('js-yaml')

const gulp = require('gulp')
const flatmap = require('gulp-flatmap')
const nunjucks = require('gulp-nunjucks')
const plumber = require('gulp-plumber')
const rename = require('gulp-rename')


// ------ nunjucks ----------------------------------------

const isDev = process.argv.includes('watch')
const siteUrl = isDev ? '/appview' : '//emoji-gen.ninja/appview';

gulp.task('nunjucks', () =>
  gulp.src('locales/*.yml')
    .pipe(plumber())
    .pipe(flatmap((stream, file) => {
      const locale = basename(file.path, '.yml')
      const messages = yaml.safeLoad(file.contents.toString('utf-8'))

      return gulp.src([
        'templates/**/*.j2',
        '!templates/base.j2',
      ])
        .pipe(plumber())
        .pipe(nunjucks.compile({
          siteUrl,
          locale,
          ...messages,
        }))
        .pipe(rename(path => {
          path.basename += '_' + locale
          path.extname = '.html'
        }))
    }))
    .pipe(gulp.dest('public/appview'))
)

gulp.task('nunjucks-watch', () => {
  gulp.watch([
    'locales/*.yml',
    'templates/**/*.j2',
  ], gulp.task('nunjucks'))
})


// ------ clean -------------------------------------------

gulp.task('clean', () =>
  del(['public/**/*.html'])
)


// ------ for production ----------------------------------

gulp.task('default', gulp.series('clean', 'nunjucks'))


// ------ for development ---------------------------------

gulp.task('watch', gulp.series('clean', 'nunjucks', 'nunjucks-watch'))
