import svgpath from 'svgpath';

export default function applyTransforms ( node, transforms ) {
	if ( node.attributes.transform ) {
		transforms = transforms.concat( node.attributes.transform );
		delete node.attributes.transform;
	}

	const transformString = transforms.join( ' ' );

	if ( node.name === 'path' ) {
		node.attributes.d = svgpath( node.attributes.d )
			.transform( transformString )
			.round( 10 )
			.toString();
	} else if ( transformString ) {
		node.attributes.transform = transformString;
	}
}
