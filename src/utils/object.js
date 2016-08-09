const assign = Object.assign || function assign ( source, ...targets ) {
	targets.forEach( target => {
		Object.keys( target ).forEach( key => {
			source[ key ] = target[ key ];
		});
	});
};

export { assign };
