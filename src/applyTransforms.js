import svgpath from 'svgpath';

export default function applyTransforms ( node, transforms ) {
	if ( node.attributes.transform ) {
		transforms = transforms.concat( node.attributes.transform );
	}

	node.attributes.d = svgpath( node.attributes.d )
		.transform( transforms.join( ' ' ) )
		.round( 10 )
		.toString();

	delete node.attributes.transform;
}
