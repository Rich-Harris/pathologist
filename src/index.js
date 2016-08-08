import { parse } from 'svg-parser';
import walk from './walk.js';
import stringify from './stringify.js';

class Pathologist {
	constructor ( source ) {
		this.source = source;

		this.target = {
			name: source.name,
			attributes: Object.assign( {}, source.attributes )
		};

		this.paths = [];
		walk( this.source, this.paths, [] );

		this.target.children = this.paths;
	}

	toString () {
		return stringify( this.target, '' );
	}
}

export { parse };

export function transform ( source ) {
	return new Pathologist( parse( source ) ).toString();
}
