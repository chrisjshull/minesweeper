import babel from 'rollup-plugin-babel';
import nodeResolve from 'rollup-plugin-node-resolve';
import eslint from 'rollup-plugin-eslint';
import inject from 'rollup-plugin-inject';
import strip from 'rollup-plugin-strip';
import commonjs from 'rollup-plugin-commonjs';

const plugins = [ // todo: order
    babel({exclude: 'node_modules/**'}),
    nodeResolve({
        browser: true,
        jsnext: true,
        preferBuiltins: false,
    }),
    eslint(),
    commonjs(),
    inject({
        $: 'jquery',
    }),
];

if (process.env.BUILD === 'prod') {
    // todo: minify/uglify
    plugins.push(strip());
}

export default {
    entry: 'src/index.js',
    format: 'iife',
    dest: 'dist/index.js',
    plugins,
};
