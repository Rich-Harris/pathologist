const assign = Object.assign || function assign ( source, ...targets ) {
	targets.forEach( target => {
		Object.keys( target ).forEach( key => {
			source[ key ] = target[ key ];
		});
	});
};

function cloneExcept ( obj, props ) {
	let clone = {};
	Object.keys( obj ).forEach( prop => {
		if ( !~props.indexOf( prop ) ) clone[ prop ] = obj[ prop ];
	});
	return clone;
}

export { assign, cloneExcept };
