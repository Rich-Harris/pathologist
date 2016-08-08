function stringifyAttributes ( attributes ) {
	return Object.keys( attributes ).map( key => ` ${key}="${attributes[key]}"` ).join( '' );
}

export default function stringify ( node, indent ) {
	if ( typeof node === 'string' ) return node;

	const attributes = stringifyAttributes( node.attributes );

	let str = `${indent}<${node.name}${attributes}`;

	if ( node.children && node.children.length ) {
		str += '>';
		let prefix = '\n';

		for ( let child of node.children ) {
			if ( typeof child === 'string' ) {
				str += child;
				prefix = '';
			} else {
				str += prefix + stringify( child, indent + '\t' );
				prefix = '\n';
			}
		}

		if ( prefix ) prefix += indent;

		str += `${prefix}</${node.name}>`;
	} else if ( node.val ) {
		str += `>${node.val}</${node.name}>`;
	} else {
		str += '/>';
	}

	return str;
}
