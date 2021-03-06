'use strict'

const { spawn } = require('child_process')
const fs = require('fs').promises
const { basename } = require('path')

const del = require('del')
const yaml = require('js-yaml')
const log = require('fancy-log')

const gulp = require('gulp')
const flatmap = require('gulp-flatmap')
const htmlmin = require('gulp-htmlmin')
const nunjucks = require('gulp-nunjucks')
const plumber = require('gulp-plumber')
const rename = require('gulp-rename')


// ------ nunjucks ----------------------------------------

const isDev = process.argv.includes('watch')
const siteUrl = isDev ? '/appview' : '//emoji-gen.ninja/appview';

gulp.task('nunjucks', async () => {
  const css = await fs.readFile('dist/style.css', 'utf-8')
  return gulp.src('locales/*.yml')
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
          css,
          ...messages,
        }))
        .pipe(rename(path => {
          path.basename += '_' + locale
          path.extname = '.html'
        }))
    }))
    .pipe(htmlmin({
      collapseWhitespace: true,
      removeAttributeQuotes: true,
    }))
    .pipe(gulp.dest('public/appview'))
})

gulp.task('nunjucks-watch', () => {
  gulp.watch([
    'dist/*.css',
    'locales/*.yml',
    'templates/**/*.j2',
  ], gulp.task('nunjucks'))
})


// ----- webpack ------------------------------------------

function runWebpack(opts, cb) {
  const message = 'Run webpack with options `' + opts.join(' ') + '`'
  log(message)

  const child = spawn('webpack', opts)
  if (child.stdout != null) {
    child.stdout.on('data', data => process.stdout.write(data))
  }
  if (child.stderr != null) {
    child.stderr.on('data', data => process.stderr.write(data))
  }
  child.on('close', cb)
}

gulp.task('webpack', cb => {
  runWebpack([], cb)
})

gulp.task('webpack-watch', cb => {
  runWebpack(['--watch', '--progress'], cb)
})


// ------ clean -------------------------------------------

gulp.task('clean', () =>
  del(['public/**/*.html'])
)


// ------ for production ----------------------------------

gulp.task('default', gulp.series('clean', 'webpack', 'nunjucks'))


// ------ for development ---------------------------------

gulp.task('watch', gulp.series(
  'clean',
  gulp.parallel(
    'nunjucks-watch',
    'webpack-watch',
  )
))
