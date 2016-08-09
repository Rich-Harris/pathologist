import { parse as parseSvg } from 'svg-parser';
import walk from './walk.js';
import stringify from './stringify.js';

class Pathologist {
	constructor ( source ) {
		this.source = parseSvg( source );

		this.target = {
			name: this.source.name,
			attributes: Object.assign( {}, this.source.attributes ),
			children: []
		};

		walk( this.source, this.target.children, [], {}, {} );
	}

	toString () {
		return stringify( this.target, '' );
	}
}

export function transform ( source ) {
	return new Pathologist( source ).toString();
}

export function parse ( source ) {
	const pathologist = new Pathologist( source );

	return {
		paths: pathologist.target.children.filter( node => node.name === 'path' ).map( node => node.attributes ),
		toString () {
			return pathologist.toString();
		}
	};
}
