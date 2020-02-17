const
  gulp = require('gulp'),
  sass = require('gulp-sass'),
  minifycss = require('gulp-uglifycss'),
  autoPrefixer = require('gulp-autoprefixer'),
  mmq = require('gulp-merge-media-queries'),
  sourceMaps = require('gulp-sourcemaps'),
  pug = require('gulp-pug'),
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
    pugSrc:'./**/*.jade',
    pugWatch: './**/*.jade',
    pugDest: './',
    projectSrc:'./index.html',
  },

  // CSS settings
  cssSettings = {
    src: dir.sassSrc,
    watch: dir.sassWatch,
    build: dir.cssDest,
    sassOptions: {
      outputStyle: 'compact',
      precision: 10,
      errLogToConsole: true,
    },
  },

  // Jade settings
  pugSettings = {
    src: dir.pugSrc,
    watch: dir.pugWatch,
    build: dir.pugDest,
    pugOptions: {
      filename: '',
      pretty: true,
      debug: true,
    },
  },

  // Server settings
  browserSyncConfig = {
    server: true,
    watch:true,
    open: true,
    injectChanges: true,
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
  return gulp.src(cssSettings.src)
    .pipe(sourceMaps.init())
    .pipe(sass(cssSettings.sassOptions).on('error', sass.logError))
    .pipe(sourceMaps.write({
      includeContent: false
    }))
    .pipe(sourceMaps.init({
      loadMaps: true
    }))
    .pipe(autoPrefixer(prefixerOptions))
    .pipe(sourceMaps.write('./'))
    .pipe(linec())
    .pipe(gulp.dest(cssSettings.build))
    .pipe(filter('**/*.css'))
    .pipe(mmq({
      log: true
    }))
    .pipe(browserSync.stream())
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(minifycss({
      maxLineLen: 10
    }))
    .pipe(linec())
    .pipe(gulp.dest(cssSettings.build))
    .pipe(filter('**/*.css'))
    .pipe(browserSync.reload({
      stream: true
    }))
    .pipe(notify({
      message: 'Sass compiled! 💯',
      onLast: true
    }));
}
exports.sassCompiler = gulp.series(sassCompiler);

// Pug compiler
function pugCompiler() {
  return gulp.src(pugSettings.src)
    .pipe(pug({
      doctype: 'html',
      pretty: false,
    }))
    .pipe(gulp.dest(pugSettings.build))
    .pipe(notify({
      message: 'Pug compiled! 💯',
      onLast: true
    }))
    .pipe(browserSync.reload({
      stream: true
    }));
}
exports.pugCompiler = gulp.series(pugCompiler);

// Server task (Private)
function server(done) {
  if (browserSync) browserSync.init(browserSyncConfig);
  done();
}

// Watch task
function watch(done) {
  gulp.watch(cssSettings.watch, sassCompiler); // Sass changes
  //gulp.watch(jadeSettings.watch, jadeCompiler); // Jade changes
  done();
}

// Default task
exports.default = gulp.series(exports.sassCompiler, exports.pugCompiler, watch, server);