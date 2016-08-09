import { assign } from './utils/object.js';

export default function applyClasses ( node, classes ) {
	if ( node.attributes.class ) {
		classes = assign( {}, classes );

		node.attributes.class.split( ' ' )
			.filter( Boolean )
			.forEach( className => classes[ className ] = true );
	}

	const classList = Object.keys( classes ).join( ' ' );

	if ( classList ) {
		node.attributes.class = classList;
	}
}
