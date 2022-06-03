const { src, dest, watch, parallel} = require('gulp');

// CSS
const sass = require('gulp-sass')(require('sass'));
const plumber = require('gulp-plumber');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const postcss = require('gulp-postcss');
const sourcemaps = require('gulp-sourcemaps');

// Imagenes
const cache = require('gulp-cache');
const imagemin = require('gulp-imagemin');
const webp = require('gulp-webp');
const avif = require('gulp-avif');
const notify = require('gulp-notify');

// JAVASCRIPT
const terser = require('gulp-terser-js');

function css( done ) {
    src('src/scss/**/*.scss')
    .pipe( sourcemaps.init() )
        .pipe( plumber() ) // Para que no se detenga el workflow
        .pipe( sass() ) // Compilar
        .pipe( postcss( [ autoprefixer(), cssnano() ] ) )
        .pipe( sourcemaps.write('.') )
    .pipe( dest('build/css') )

    done();
}

function imagenes( done ) {
    // Optimizar y Aligerar Imagenes
    const opciones = {
      optimizationLevel : 3  
    };

    src('src/img/**/*.{jpg,png,jpeg}')
        .pipe( cache( imagemin(opciones) ) )
        .pipe( dest('build/img') )
        .pipe(notify({ message: 'Imagen Completada'}));

    done();
}

function versionWebp( done ) {
    // Pasar imagenes a WEBP
    const opciones = {
        quality : 50
    };

    src('src/img/**/*.{jpg,png,jpeg}')
        .pipe( webp(opciones) )
        .pipe( dest('build/img') )
        .pipe(notify({ message: 'Imagen Webp Completada'}));

    done();
}

function versionAvif( done ){
    // PASAR IMAGENES A AVIF
        const opciones = {
            quality : 50
        };
    
        src('src/img/**/*.{jpg,png,jpeg}')
            .pipe( avif(opciones) )
            .pipe( dest('build/img') )
            .pipe(notify({ message: 'Imagen Avif Completada'}));
    
        done();
}

function javascript( done ) {
    
    src('src/js/**/*.js')
        .pipe( sourcemaps.init() )
        .pipe( terser() )
        .pipe( sourcemaps.write('.') )
        .pipe( dest('build/js') )

    done();
}

function dev( done ) {
    watch('src/scss/**/*.scss', css);
    watch('src/js/**/*.js', javascript);

    done();
}

exports.css = css;
exports.js = javascript;
exports.imagenes = imagenes;
exports.versionWebp = versionWebp;
exports.versionAvif = versionAvif;
exports.dev = parallel( imagenes, versionWebp, versionAvif, javascript, dev );