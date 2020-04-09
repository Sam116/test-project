const gulp = require('gulp'),
    sass = require('gulp-sass'),
    plumber = require('gulp-plumber'),
    autoprefixer = require('gulp-autoprefixer'),
    rename = require('gulp-rename'),
    cssMinify = require('gulp-csso'),
    del = require('del'),
    newer = require('gulp-newer'),
    svgSprite = require('gulp-svg-sprite'),
    webpack = require('webpack'),
    gulpSourcemaps = require('gulp-sourcemaps'),
    typograf = require('gulp-typograf'),
    webpackConfig = require('./webpack.config.js'),
    mergeMediaQurires = require('gulp-merge-media-queries'),
    webpackStream = require('webpack-stream'),
    gulpImagemin = require('gulp-imagemin'),
    imageminPngquant = require('imagemin-pngquant'),
    imageminJpegRecompress = require('imagemin-jpeg-recompress'),
    fileInclude = require('gulp-file-include');


const browserSync = require('browser-sync').create();

// Paths for reuse
const srcPath = (file, watch = false) => {
    if (file === 'scss' && watch === false) return './src/scss/styles.scss';
    if (file === 'scss' && watch === true) return './src/scss/**/*.scss';
    if (file === 'js' && watch === false) return entryArray;
    if (file === 'js' && watch === true) return './src/js/**/*.js';
    if (file === 'html' && watch === true) return './src/**/*.html';
    if (file === 'html' && watch === false) return './src/*.html';
    if (file === 'img') return './src/img/**/*';
    if (file === 'sprite') return './src/img/icons/*.svg';
    console.error('Unsupported file type entered into Gulp Task Runner for Source Path');
};
const distPath = (file, serve = false) => {
    if (['css', 'js', 'img'].includes(file)) return `./dist/${file}`;
    if (file === 'html' && serve === false) return './dist/**/*.html';
    if (file === 'html' && serve === true) return './dist';
    console.error('Unsupported file type entered into Gulp Task Runner for Dist Path');
};

gulp.task('sprite', function() {
    return gulp
        .src(srcPath('sprite'))
        .pipe(
            svgSprite({
                mode: {
                    inline: true, // Prepare for inline embedding
                    symbol: {
                        sprite: "../sprite.svg"
                    }
                }
            }),
        )
        .pipe(gulp.dest('./src/img'));
});


gulp.task('clean-html', function(done) {
    del([distPath('html')])
    done();
});


gulp.task('html', function() {
    return gulp
        .src(srcPath('html', true))
        .pipe(fileInclude({
            prefix: '@@',
        }))
        .pipe(typograf({
            locale: ['ru', 'en-US'],
            disableRule: 'ru/other/phone-number'
        }))
        .pipe(gulp.dest(distPath('html', true)))
        .pipe(browserSync.stream());
});

gulp.task('images-build', function() {
    return gulp
        .src(srcPath('img'))
        .pipe(gulpImagemin([
            gulpImagemin.gifsicle(),
            gulpImagemin.jpegtran(),
            gulpImagemin.optipng(),
            gulpImagemin.svgo(),
            imageminPngquant(),
            imageminJpegRecompress(),
        ]))
        .pipe(gulp.dest(distPath('img')))
});

gulp.task('images', function() {
    return gulp
        .src(srcPath('img'))
        .pipe(gulp.dest(distPath('img')))
});


gulp.task('styles', function() {
    return gulp
        .src(srcPath('scss'))
        .pipe(gulpSourcemaps.init({loadMaps: true}))
        .pipe(plumber())
        .pipe(sass())
        .pipe(autoprefixer())
        .pipe(gulpSourcemaps.write('.'))
        .pipe(mergeMediaQurires())
        .pipe(gulp.dest(distPath('css')))
        .pipe(cssMinify())
        .pipe(rename('styles.min.css'))
        .pipe(gulp.dest(distPath('css')))
        .pipe(browserSync.stream());
});

gulp.task('scripts', function() {
    return gulp
        .src(srcPath('js', true))
        .pipe(plumber())
        .pipe(webpackStream(webpackConfig, webpack))
        .pipe(gulp.dest(distPath('js')))
        .pipe(browserSync.stream());
});

gulp.task('scripts-production', function() {
    return gulp
        .src(srcPath('js', true))
        .pipe(plumber())
        .pipe(webpackStream({ ...webpackConfig, mode: 'production', devtool: 'source-map' }, webpack))
.pipe(gulp.dest(distPath('js')))
        .pipe(browserSync.stream());
});

gulp.task('clean', function() {
    return del('./dist');
});

gulp.task('serve', function() {
    browserSync.init({
        port: 3000,
        host: "192.168.31.73",
        ghostMode: false,
        server: distPath('html', true)
    });
    gulp.watch(srcPath('html', true), gulp.series('html'));
    gulp.watch(srcPath('sprite', true), gulp.series('sprite', 'html'));
    gulp.watch(srcPath('scss', true), gulp.series('styles'));
    gulp.watch(srcPath('js', true), gulp.series('scripts'));
    gulp.watch(srcPath('img', true), gulp.series('images'));
});

gulp.task('dev', gulp.series('clean', 'images', 'sprite', 'html', gulp.parallel('styles', 'scripts')));

gulp.task('build', gulp.series('clean', 'images-build', 'sprite', 'html', gulp.parallel('styles', 'scripts-production')));

gulp.task('default', gulp.series('build', 'serve'));
