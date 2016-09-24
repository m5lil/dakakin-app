/* jshint node:true */

'use strict';

// gulp serve           -> build for dev
// gulp build           -> build for prod
// gulp serve:dist      -> build and serve the output from the dist build

var gulp = require('gulp'),
    gutil = require('gulp-util'),
    rimraf = require('rimraf'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    cleanCSS = require('gulp-clean-css'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    size = require('gulp-size'),
    sourcemaps = require('gulp-sourcemaps'),
    browserSync = require('browser-sync'),
    imagemin = require('gulp-imagemin'),
    rename = require('gulp-rename'),
    changed = require('gulp-changed'),
    svgSprite = require('gulp-svg-sprite'),
    reload = browserSync.reload,
    rev = require('gulp-rev'),
    chalk = require('chalk'),
    duration = require('gulp-duration'),
    _ = require('lodash'),
    browserify = require('browserify'),
    babelify = require('babelify'),
    watchify = require('watchify'),
    source = require('vinyl-source-stream'),
    jade = require('gulp-jade'),
    buffer = require('vinyl-buffer');

// Options, project specifics
var options = {};

// browserSync options

// If you already have a server
// Comment out the 'server' option (below)
// Uncomment the 'proxy' option and update its value in 'gulp-config.json'
// You can easily create 'gulp-config.json' from 'gulp-config-sample.json'
// Uncomment 'var config' line below

// Custom browserSync config
//var config = require('./gulp-config.json');

options.browserSync = {
    notify: false,
    open: true,
    server: {
        baseDir: './app/dist/'
    },

    //proxy: config.browsersync.proxy,

    // If you want to specify your IP adress (on more complex network), uncomment the 'host' option and update it
    //host: config.browsersync.host,

    // If you want to run as https, uncomment the 'https' option
    // https: true
};

// Paths settings
options.distPath = 'app/dist/';         // path to your app distribution folder
options.srcPath = 'app/src/';        // path to your app source folder

options.paths = {
    sass: options.srcPath + 'sass/',
    js: options.srcPath + 'js/',
    images: options.srcPath + 'images/',
    fonts: options.srcPath + 'fonts/',
    pages: options.srcPath + 'pages/',
    destCss: options.distPath + 'css/',
    destJs: options.distPath + 'js/',
    destImages: options.distPath + 'images/',
    destFonts: options.distPath + 'fonts/'
};

// gulp-sass options
options.libsass = {
    errLogToConsole: false,
    sourceMap: true,
    sourceComments: true,
    precision: 10,
    outputStyle: 'expanded',
    imagePath: 'app/src/images'
};

// gulp-autoprefixer
options.autoprefixer = {
    support: [
        'last 2 version',
        'ie >= 10',
        'safari >= 6',
        'ios >= 7',
        'android >= 4'
    ]
};

// gulp-uglify
options.uglify = {
    compress: {
        pure_funcs: ['console.log']
    }
};

// gulp-imagemin
options.imagemin = {
    progressive: true,
    interlaced: true,
    optimizationLevel: 3
};

// Basic configuration example
options.svgprite = {
    mode: {
        css: false,
        inline: true,
        symbol: true
    }
};

var browserify_config = {
    debug: true
};

// Delete the dist directory
gulp.task('clean', function (cb) {
    rimraf(options.distPath, cb);
});

// browser-sync task for starting the server. (Use the built-in server or use your existing one by filling the proxy options)
gulp.task('browser-sync', function () {
    browserSync(options.browserSync);
});

// Jade
gulp.task('pages', function() {
  gulp.src(options.paths.pages + '*.jade')
    .pipe(jade(
      {pretty: gutil.env.type === 'prod' ? false : true}
    ))
    .on('error', function (error) {
            gutil.log(gutil.colors.red(error.message));
            this.emit('end');
    })  
    .pipe(gulp.dest(options.distPath))
    .pipe(reload({stream:true}));
});

// Node Sass
gulp.task('sass', function () {
    // List all .scss files that need to be processed
    return gulp.src([
            options.paths.sass + '**/*.{scss,css}'
        ])

        .pipe(sourcemaps.init())

        .pipe(sass(options.libsass))

        // Catch any SCSS errors and prevent them from crashing gulp
        .on('error', function (error) {
            gutil.log(gutil.colors.red(error.message));
            this.emit('end');
        })

        // Hotfix while gulp-sass sourcemaps gets fixed
        // https://github.com/dlmanning/gulp-sass/issues/106#issuecomment-60977513
        .pipe(sourcemaps.write())

        .pipe(sourcemaps.init({loadMaps: true}))

        // Add vendor prefixes
        .pipe(autoprefixer(options.autoprefixer.support))

        .pipe(gutil.env.type === 'prod' ? cleanCSS() : gutil.noop())

        // Write final .map file for Dev only
        .pipe(gutil.env.type === 'prod' ? gutil.noop() : sourcemaps.write())

        // Output the processed CSS
        .pipe(gulp.dest(options.paths.destCss))

        .pipe(size({title: 'CSS'}))

        .pipe(reload({stream: true}));
});


// Copy Modernizr
gulp.task('modernizr', function () {
    return gulp.src([
            options.paths.js + 'modernizr-custom.js'
        ])
        .pipe(gulp.dest(options.paths.destJs));
});

gulp.task('pluginsjs', function () {
    return gulp.src(options.paths.js + 'plugins/*.js')
        .pipe(gutil.env.type === 'prod' ? uglify(options.uglify) : gutil.noop())
        .pipe(sourcemaps.write('./', {sourceRoot: './'})) // Set folder for sourcemaps to output to
        .pipe(gulp.dest(options.paths.destJs));
});

// SVG sprite
gulp.task('svg', function () {
    return gulp.src(options.paths.images + '**/*.svg')
        .pipe(svgSprite(options.svgprite))
        .pipe(gulp.dest(options.paths.destImages));
});


// Images
gulp.task('images', function () {
    return gulp.src(options.paths.images + '**/*')
        .pipe(changed(options.paths.destImages)) // Ignore unchanged files
        .pipe(imagemin(options.imagemin)) // Optimize
        .pipe(gulp.dest(options.paths.destImages));
});


// Fonts
gulp.task('fonts', function () {
    return gulp.src(options.paths.fonts + '**/*.{ttf,woff,woff2,eot,svg}')
        .pipe(changed(options.paths.destFonts)) // Ignore unchanged files
        .pipe(gulp.dest(options.paths.destFonts));
});


// JS hint task (WIP, disabled)
gulp.task('jshint', function () {
    return gulp.src([
            options.paths.js + '*.js',
            './gulpfile.js'
        ])
        .pipe(jshint('.jshintrc'))
        .pipe(jshint.reporter('jshint-stylish'));
});


// Completes the final file outputs
function bundle(bundler) {
    var bundleTimer = duration('Javascript bundle time');

    bundler
        .bundle()
        .on('error', mapError) // Map error reporting
        .pipe(source('app.js')) // Set source name
        .pipe(buffer()) // Convert to gulp pipeline
        .pipe(sourcemaps.init({loadMaps: true})) // Extract the inline sourcemaps
        .pipe(rename({
            dirname: '',
            basename: 'bundle'
        }))
        .pipe(gutil.env.type === 'prod' ? uglify(options.uglify) : gutil.noop())
        .pipe(sourcemaps.write('./', {sourceRoot: './'})) // Set folder for sourcemaps to output to
        .pipe(gulp.dest(options.paths.destJs)) // Set the output folder
        .pipe(bundleTimer) // Output time timing of the file creation
        .pipe(browserSync.stream({once: true}));
}

// Error reporting function
function mapError(err) {
    if (err.fileName) {
        // Regular error
        gutil.log(chalk.red(err.name)
            + ': ' + chalk.yellow(err.fileName.replace(__dirname + '/src/js/', ''))
            + ': ' + 'Line ' + chalk.magenta(err.lineNumber)
            + ' & ' + 'Column ' + chalk.magenta(err.columnNumber || err.column)
            + ': ' + chalk.blue(err.description));
    } else {
        // Browserify error..
        gutil.log(chalk.red(err.name)
            + ': '
            + chalk.yellow(err.message));
    }
}


// gulp serve           -> build for dev
// gulp build           -> build for prod
// gulp serve:dist      -> build and serve the output from the dist build

gulp.task('serve', [
        'sass',
        // 'jshint',
        'modernizr',
        'pluginsjs',
        'pages',
        'images',
        'svg',
        'fonts',
        'browser-sync'
    ], function () {

        // Watch Sass
        gulp.watch(options.paths.sass + '**/*.scss', ['sass'])
            .on('change', function (evt) {
                console.log(
                    '[watcher] File ' + evt.path.replace(/.*(?=sass)/, '') + ' was ' + evt.type + ', compiling...'
                );
            });

        // Watch images
        gulp.watch(options.paths.images + '**/*', ['images']);

        // Watch JS
        var args = _.assign({}, watchify.args, browserify_config);
        var bundler = browserify('./app/src/js/app.js', args) // Browserify
            .plugin(watchify, {ignoreWatch: ['**/node_modules/**', '**/bower_components/**']}) // Watchify to watch source file changes
            .transform(babelify, {presets: ['es2015']}); // Babel tranforms
        bundle(bundler); // Run the bundle the first time (required for Watchify to kick in)
        bundler.on('update', function () {
            bundle(bundler); // Re-run bundle on source updates
        });

        // Watch Jade
        gulp.watch(options.paths.pages + '*.jade', ['pages']);
    }
);

// Build and serve the output from the dist build
gulp.task('serve:dist', ['default'], function () {
    browserSync(options.browserSync);
});

gulp.task('build', ['clean'], function () {
    gutil.env.type = 'prod';
    //gulp.start('sass', 'modernizr', 'images', 'svg', 'fonts');
    gulp.start('sass', 'images', 'svg', 'pluginsjs', 'fonts', 'modernizr', 'pages');

    var bundler = browserify('./app/src/js/app.js', browserify_config) // Browserify
        .transform(babelify, {presets: ['es2015']}); // Babel tranforms
    bundle(bundler); // Run the bundle the first time (required for Watchify to kick in)

    return gulp.src(options.distPath + '**/*').pipe(size({title: 'build', gzip: false}));
});

gulp.task('default', function () {
    gulp.start('build');
});
