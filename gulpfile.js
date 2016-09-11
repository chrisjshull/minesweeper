/*eslint-env node*/

// Node
const fs = require('fs');
const path = require('path');

// Gulp
const gulp = require('gulp');
const sourcemaps = require('gulp-sourcemaps');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const rename = require('gulp-rename');
const insert = require('gulp-insert');
const serve = require('gulp-serve');

// JS
const rollup = require('rollup-stream');
const babel = require('rollup-plugin-babel');
const nodeResolve = require('rollup-plugin-node-resolve');
const eslint = require('rollup-plugin-eslint');
const inject = require('rollup-plugin-inject');
// const strip = require('rollup-plugin-strip');
const commonjs = require('rollup-plugin-commonjs');
const string = require('rollup-plugin-string');

// CSS
const sass = require('gulp-sass');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');


const license = () => {
    let txt = fs.readFileSync('LICENSE', 'utf8').trim();
    txt = `/*!\n${txt}\n*/\n`;
    return insert.prepend(txt);
};

const globalJS = () => {
    return insert.prepend([
        require.resolve('babel-polyfill/dist/polyfill.js'),
        require.resolve('jquery')
    ].map(e => fs.readFileSync(e, 'utf8') + '\n\n').join(''));
};

const rollupPlugins = [ // todo: order
    eslint({
        include: ['./src/**/*.js'],
    }),

    inject({
        // $: 'jquery', // handled by gulp
        mix: ['mixwith/src/mixwith.js', 'mix'],

    }),
    babel({
        plugins: ["external-helpers"],
        presets: [['latest', {es2015: {modules: false}}]],
        exclude: ['./node_modules/**'],
        include: ['./src/**/*.js'],
        sourceMaps: false,
    }),

    nodeResolve({
        browser: true,
        jsnext: true,
        preferBuiltins: false,
    }),
    commonjs(),
    string({
        include: './src/**/*.html',
    }),
];

// basic gulp + rollup from https://github.com/gulpjs/gulp/blob/master/docs/recipes/rollup-with-rollup-stream.md
gulp.task('js', () => rollup(
    {
        entry: './src/index.js',
        sourceMap: true,
        format: 'iife',
        plugins: rollupPlugins,
    })
    .pipe(source('index.js', './src')) // point to the entry file.
    .pipe(buffer()) // buffer the output. most gulp plugins, including gulp-sourcemaps, don't support streams.
    .pipe(sourcemaps.init({loadMaps: true})) // tell gulp-sourcemaps to load the inline sourcemap produced by rollup-stream.
    .pipe(globalJS())
    .pipe(license())
    .pipe(rename('script.js'))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./dist'))
);

const postcssPlugins = [ // todo: order
    autoprefixer(),
];

gulp.task('css', () => gulp.src('./src/**/*.scss')
    .pipe(sourcemaps.init())
    .pipe(sass({
        includePaths: [path.dirname(require.resolve('normalize.css'))],
    }).on('error', sass.logError))
    .pipe(postcss(postcssPlugins))
    .pipe(license())
    .pipe(rename('style.css'))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./dist'))
);

gulp.task('copy', () => gulp.src('./static/**')
   .pipe(gulp.dest('./dist'))
);


gulp.task('default', ['js', 'css', 'copy']);
gulp.task('watch', ['default'], () => [
    gulp.watch('./src/**/*.{js,html}', ['js']),
    gulp.watch('./src/**/*.scss', ['css']),
    gulp.watch('./src/index.html', ['copy']),
]);
gulp.task('serve', ['watch'], serve('dist'));


// todo: prod build task with minification, sourcemap skipping, strip()
