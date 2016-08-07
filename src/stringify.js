function stringifyAttributes ( attributes ) {
	return Object.keys( attributes ).map( key => ` ${key}="${attributes[key]}"` ).join( '' );
}

export default function stringify ( node, indent ) {
	const attributes = stringifyAttributes( node.attributes );

	let str = `${indent}<${node.name}${attributes}`;

	if ( node.children && node.children.length ) {
		str += `>\n${
			node.children.map( child => stringify( child, indent + '\t' ) ).join( '\n' )
		}\n${indent}</${node.name}>`;
	} else if ( node.val ) {
		str += `>${node.val}</${node.name}>`;
	} else {
		str += '/>';
	}

	return str;
}
