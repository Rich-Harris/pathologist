function cloneExcept ( obj, props ) {
	let clone = {};
	Object.keys( obj ).forEach( prop => {
		if ( !~props.indexOf( prop ) ) clone[ prop ] = obj[ prop ];
	});
	return clone;
}

function convertPoints ( points ) {
	let path = '';
	let prefix = 'M';

	for ( let i = 0; i < points.length; i += 2 ) {
		path += `${prefix}${points[i]},${points[i+1]}`;
		prefix = ' ';
	}

	return path;
}

const converters = {
	ellipse: attributes => {
		const cx = attributes.cx || 0;
		const cy = attributes.cy || 0;
		const rx = attributes.rx || 0;
		const ry = attributes.ry || 0;

		const path = cloneExcept( attributes, [ 'cx', 'cy', 'rx', 'ry' ] );
		path.d = `M${cx - rx},${cy}a${rx},${ry} 0 1,0 ${rx * 2},0a${rx},${ry} 0 1,0 ${rx * -2},0`;

		return path;
	},

	circle: attributes => {
		const cx = attributes.cx || 0;
		const cy = attributes.cy || 0;
		const r = attributes.r || 0;

		const path = cloneExcept( attributes, [ 'cx', 'cy', 'r' ] );
		path.d = `M${cx - r},${cy}a${r},${r} 0 1,0 ${r * 2},0a${r},${r} 0 1,0 ${r * -2},0`;

		return path;
	},

	polygon: attributes => {
		const path = cloneExcept( attributes, 'points' );
		path.d = convertPoints( attributes.points.trim().split( /[\s,]+/ ) );

		return path;
	},

	rect: attributes => {
		const x = +attributes.x || 0;
		const y = +attributes.y || 0;
		const width = +attributes.width || 0;
		const height = +attributes.height || 0;
		// const rx = +attributes.rx || 0; // TODO handle...
		// const ry = +attributes.ry || 0; // TODO handle...

		const path = cloneExcept( attributes, [ 'x', 'y', 'width', 'height', 'rx', 'ry' ] );

		// TODO handle rx and ry
		path.d = `m${x},${y} ${width},0 0,${height} ${-width},0Z`;

		return path;
	}

	// TODO others...
};

export default function convert ( node ) {
	const converter = converters[ node.name ];
	if ( converter ) {
		const attributes = converter( node.attributes );

		return {
			name: 'path',
			attributes
		};
	}

	throw new Error( `TODO <${node.name}>` );
}
