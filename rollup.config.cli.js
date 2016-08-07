import buble from 'rollup-plugin-buble';
import json from 'rollup-plugin-json';
import string from 'rollup-plugin-string';
import nodeResolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';

export default {
	entry: 'bin/src/index.js',
	dest: 'bin/pathologist',
	format: 'cjs',
	banner: '#!/usr/bin/env node',
	plugins: [
		string({ include: '**/*.md' }),
		json(),
		buble(),
		commonjs({
			include: 'node_modules/**',
			// namedExports: { 'chalk': [ 'red', 'cyan', 'grey' ] }
		}),
		nodeResolve({
			main: true
		})
	],
	external: [
		'fs',
		'path',
		'module',
		'os',
		'pathologist'
	],
	paths: {
		pathologist: '../dist/pathologist.umd.js'
	}
};
