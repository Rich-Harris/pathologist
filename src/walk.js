import convertToPath from './convertToPath.js';
import applyAttributes from './applyAttributes.js';
import applyClasses from './applyClasses.js';
import applyTransforms from './applyTransforms.js';
import { assign, cloneExcept } from './utils/object.js';

const ignore = [ 'defs', 'title' ];
const noninheritable = [ 'id', 'class', 'style', 'transform' ];

export default function walk ( node, paths, transforms, classes, attributes ) {
	if ( node.name === 'svg' ) {
		const _transforms = transforms.slice();
		node.children.forEach( child => {
			walk( child, paths, _transforms, classes, attributes );
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

		const _attributes = assign(
			cloneExcept( attributes, noninheritable ),
			cloneExcept( node.attributes, noninheritable )
		);

		node.children.forEach( child => {
			walk( child, paths, _transforms, _classes, _attributes );
		});
	}

	else if ( ~ignore.indexOf( node.name ) ) {
		applyAttributes( node, attributes );
		applyClasses( node, classes );
		applyTransforms( node, transforms );
		paths.push( node );
	}

	else {
		applyAttributes( node, attributes );
		applyClasses( node, classes );

		if ( node.name !== 'path' ) {
			node = convertToPath( node );
		}

		applyTransforms( node, transforms );
		paths.push( node );
	}
}
