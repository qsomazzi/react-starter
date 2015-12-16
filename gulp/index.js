import gulp   from 'gulp';
import config from './config';

// include plug-ins
import concat      from 'gulp-concat';
import rename      from 'gulp-rename';
import uglify      from 'gulp-uglify';
import minifyCSS   from 'gulp-minify-css';
import sass        from 'gulp-sass';
import sourcemaps  from 'gulp-sourcemaps';
import notify      from 'gulp-notify';
import gutil       from 'gulp-util';
import addsrc      from 'gulp-add-src';
import watchify    from 'watchify';
import browserify  from 'browserify';
import babelify    from 'babelify';
import source      from 'vinyl-source-stream';
import buffer      from 'vinyl-buffer';
import del         from 'del';
import browserSync from 'browser-sync';
import runSequence from 'run-sequence';

gulp.task('default', ['publish'], () => {});

/**
 * Main Taks
 */
gulp.task('publish', (done) => {
    return runSequence(
        'clean',
        ['js', 'sass', 'build-css', 'copy'],
        done
    );
});

gulp.task('dev', (done) => {
    return runSequence(
        'clean',
        ['watch-js', 'copy'],
        ['watch-css', 'build-css'],
        'serve',
        done
    );
});





/**
 * Internals Taks
 */

gulp.task('watch-css', () => {
    gulp.watch(config.styles.src, () => {
        gutil.log(gutil.colors.green('Changes in CSS files spotted. New compilation triggered.'));

        return gulp.start('build-css');
    });
});

// CSS concat, auto-prefix and minify
gulp.task('build-css', () => {    
    return gulp.src(config.styles.src)
        .on('error', notifyError)
        .pipe(sourcemaps.init())
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(sourcemaps.write())
        .pipe(addsrc(config.plugins.css))
        .pipe(concat(config.styles.index))
        .pipe(gulp.dest(config.styles.dest))
        .pipe(minifyCSS())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest(config.styles.dest));
});

function notifyError(err) {
    let args = Array.prototype.slice.call(arguments);
    
    // Send error to notification center with gulp-notify
    notify.onError({
        title:     "Compilation Error",
        message:   "<%= error.message %>"
    }).apply(this, args);

    // Keep gulp from hanging on this task
    this.emit('end');
}

function compileJs(watch) {
    let bundler = watchify(browserify(config.scripts.src, { 
        debug: true,
        extensions: ['.js', '.jsx'],
        cache: {},  // for watchify
        packageCache: {},  // for watchify
    }).transform(babelify));

    function rebundle() {
        bundler.bundle()
            .on('error', notifyError)
            .pipe(source(config.scripts.index))
            .pipe(buffer())
            .pipe(gulp.dest(config.scripts.dest))
            .pipe(sourcemaps.init({ loadMaps: true }))
            .pipe(uglify())
            .pipe(rename({suffix: '.min'}))
            .pipe(sourcemaps.write('./'))
            .pipe(gulp.dest(config.scripts.dest))
        ;
    }

    if (watch) {
        bundler.on('update', function() {
            gutil.log(gutil.colors.green('Changes in JS files spotted. New compilation triggered.'));
            rebundle();
        });
    }

    rebundle();
}

gulp.task('js', () => { return compileJs(); });
gulp.task('watch-js', () => { return compileJs(true); });

gulp.task('copy', () => {
    // Move main index file
    gulp.src(config.index)
        .on('error', notifyError)
        .pipe(gulp.dest(config.dest))
    ;

    // Move fonts
    gulp.src(config.fonts)
        .on('error', notifyError)
        .pipe(gulp.dest(config.dest + '/fonts'))
    ;

    // Move other files / resources
    return gulp.src(config.copy, {base: config.root})
        .on('error', notifyError)
        .pipe(gulp.dest(config.dest))
    ;
});

gulp.task('clean',  done => {
    return del([config.dest + '/**/*'], {force: true}, done);
});

gulp.task('serve', () => {
    if (config.server.enable) {
        return browserSync({
            server: {
                baseDir: config.dest
            },
            port: config.server.port,
            open: config.server.open
        });
    }
});

if (config.server.enable) {
    gulp.watch([
        config.index, 
        config.styles.cssDest + '/*.min.css', // we use only min file to prevent double reload
        config.scripts.dest + '/*.min.js'     // same
    ]).on('change', browserSync.reload);
}
