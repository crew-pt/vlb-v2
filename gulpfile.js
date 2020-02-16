const
  gulp = require('gulp'),
  sass = require('gulp-sass'),
  minifycss = require('gulpuglifycss'),
  autoPrefixer = require('gulp-autoprefixer'),
  mmq = require('gulp-merge-media-queries'),
  jade = require('gulp-jade'),
  notify = require('gulp-notify'),
  rename = require('gulp-rename'),
  filter = require('gulp-filter'),
  linec = require('gulp-line-ending-corrector'),
  browserSync = require('browser-sync').create(),
  reload = browserSync.reload,

  // Directory settings
  dir = {
    sassSrc: './assets/sass/style.sass',
    sassWatch: './assets/sass/**/*.sass',
    cssDest: './assets/css/',
    jadeSrc:'',
    JadeWatch: '',
    jadeDest: '',
    projectSrc:'',
  },

  // CSS settings
  cssOptions = {
    src: dir.sassSrc,
    watch: dir.sassWatch,
    build: dir.cssDest,
    sassOptions: {
      outputStyle: 'compact',
      precision: 10,
      errLogToConsole: true
    },
  },

  // Jade settings
  jadeSettings = {
    src: dir.jadeSrc,
    watch: dir.jadeWatch,
    build: dir.jadeDest,
    jadeOptions: {
      filename: '',
      pretty: true,
      debug: true,
    },
  },

  // Server settings
  browserSyncConfig = {
    proxy: dir.projectSrc,
    port: 8000,
    open: true,
    injectChanges: true
  },

  // Autoprefixer settings
  prefixerOptions = [
    'last 2 version',
    '> 1%',
    'ie >= 9',
    'ie_mob >= 10',
    'ff >= 30',
    'chrome >= 34',
    'safari >= 7',
    'opera >= 23',
    'ios >= 7',
    'android >= 4',
    'bb >= 10'
  ];

// Sass compiler
function sassCompiler() {
  sass.compiler = require('node-sass');
  return gulp.src(cssOptions.src)
    .pipe(sass(cssOptions.sassOptions).on('error', sass.logError))
    .pipe(autoPrefixer(prefixerOptions))
    .pipe(gulp.dest(cssOptions.build))
    .pipe(browserSync.stream())
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(minifycss({
      maxLineLen: 10
    }))
    .pipe(gulp.dest(cssOptions.build))
    .pipe(browserSync.reload({
      stream: true
    }))
    .pipe(notify({
      message: 'Sass compiled! 💯',
      onLast: true
    }));

}
exports.sassCompiler = gulp.series(sassCompiler);

// Jade compiler
function jadeCompiler() {
  return gulp.src(dir.jadeSrc)
    .pipe(jade({
      locals:
    }))
    .pipe(gulp.dest(dir.jsDest))
    .pipe(notify({
      message: 'Jade compiled! 💯',
      onLast: true
    }))
    .pipe(browserSync.reload({
      stream: true
    }));
}
exports.jadeCompiler = gulp.series(jadeCompiler);

// Server task (Private)
function server(done) {
  if (browserSync) browserSync.init(browserSyncConfig);
  done();
}

// Watch task
function watch(done) {
  gulp.watch(cssOptions.watch, sassCompiler); // CSS changes
  gulp.watch(dir.phpSrc).on('change', reload); // PHP changes
  gulp.watch(dir.jsVendorSrc, jsVendor).on('change', jsVendor); // JS Vendor changes
  gulp.watch(dir.jsCustomSrc, jsCustom).on('change', jsCustom); // JS Custom changes
  done();
}

// Default task
exports.default = gulp.series(exports.sassCompiler, exports.jsVendor, exports.jsCustom, exports.translate, watch, server);
