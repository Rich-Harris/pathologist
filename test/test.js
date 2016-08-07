const path = require( 'path' );
const fs = require( 'fs' );
const assert = require( 'assert' );
const pathologist = require( '..' );

require( 'source-map-support' ).install();

describe( 'pathologist', () => {
	const SAMPLES = path.join( __dirname, 'samples' );
	fs.readdirSync( SAMPLES ).forEach( dir => {
		( /-SOLO$/.test( dir ) ? it.only : it )( dir, () => {
			const input = fs.readFileSync( path.join( SAMPLES, dir, 'input.svg' ), 'utf-8' ).trim();
			const output = fs.readFileSync( path.join( SAMPLES, dir, 'output.svg' ), 'utf-8' ).trim();

			assert.equal( pathologist.transform( input ), output );
		});
	});
});
