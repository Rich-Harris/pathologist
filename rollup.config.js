import buble from 'rollup-plugin-buble';
import commonjs from 'rollup-plugin-commonjs';
import nodeResolve from 'rollup-plugin-node-resolve';

export default {
	entry: 'src/index.js',
	moduleName: 'pathologist',
	plugins: [
		buble(),
		nodeResolve({
			main: true
		}),
		commonjs()
	],
	// globals: {
	// 	xmldoc: 'xml',
	// 	svgpath: 'svgpath'
	// },
	sourceMap: true,
	//external: [ 'svgpath', 'xmldoc' ],
	targets: [
		{ format: 'es', dest: 'dist/pathologist.es.js' },
		{ format: 'umd', dest: 'dist/pathologist.umd.js' }
	]
};
