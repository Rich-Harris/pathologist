import convertToPath from './convertToPath.js';
import applyTransforms from './applyTransforms.js';
import applyClasses from './applyClasses.js';
import { assign } from './utils/object.js';

const ignore = [ 'defs', 'title' ];

export default function walk ( node, paths, transforms, classes ) {
	if ( node.name === 'svg' ) {
		const _transforms = transforms.slice();
		node.children.forEach( child => {
			walk( child, paths, _transforms, classes );
		});
	}

	else if ( node.name === 'g' ) {
		const _transforms = node.attributes.transform ? transforms.concat( node.attributes.transform ) : transforms;

		const _classes = assign( {}, classes );
		if ( node.attributes.class ) {
			node.attributes.class.split( ' ' )
				.filter( Boolean )
				.forEach( className => _classes[ className ] = true );
		}

		node.children.forEach( child => {
			walk( child, paths, _transforms, _classes );
		});
	}

	else if ( ~ignore.indexOf( node.name ) ) {
		applyClasses( node, classes );
		applyTransforms( node, transforms );
		paths.push( node );
	}

	else {
		if ( node.name !== 'path' ) {
			node = convertToPath( node );
		}

		applyClasses( node, classes );
		applyTransforms( node, transforms );
		paths.push( node );
	}
}
