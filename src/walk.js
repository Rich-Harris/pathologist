import convertToPath from './convertToPath.js';
import applyTransforms from './applyTransforms.js';

const ignore = [ 'defs', 'title' ];

export default function walk ( node, paths, transforms ) {
	if ( node.name === 'svg' ) {
		const _transforms = transforms.slice();
		node.children.forEach( child => {
			walk( child, paths, _transforms );
		});
	}

	else if ( node.name === 'g' ) {
		const _transforms = node.attributes.transform ? transforms.concat( node.attributes.transform ) : transforms;
		node.children.forEach( child => {
			walk( child, paths, _transforms );
		});
	}

	else if ( ~ignore.indexOf( node.name ) ) {
		paths.push( node );
	}

	else {
		if ( node.name !== 'path' ) {
			node = convertToPath( node );
		}

		applyTransforms( node, transforms );
		paths.push( node );
	}
}
