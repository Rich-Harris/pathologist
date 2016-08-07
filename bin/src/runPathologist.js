import * as fs from 'fs';
import * as path from 'path';
import handleError from './handleError.js';
import { EOL } from 'os';
import pathologist from 'pathologist';

function compile ( from, to, command ) {
	try {
		var stats = fs.statSync( from );
		if ( stats.isDirectory() ) {
			compileDir( from, to, command );
		} else {
			compileFile( from, to, command );
		}
	} catch ( err ) {
		handleError( err );
	}
}

function compileDir ( from, to, command ) {
	if ( !command.output ) handleError({ code: 'MISSING_OUTPUT_DIR' });

	try {
		fs.mkdirSync( to );
	} catch ( e ) {
		if ( e.code !== 'EEXIST' ) throw e;
	}

	fs.readdirSync( from ).forEach( function ( file ) {
		compile( path.resolve( from, file ), path.resolve( to, file ), command );
	});
}

function compileFile ( from, to ) {
	const ext = path.extname( from );

	if ( ext !== '.svg' ) return;

	if ( to ) to = to.slice( 0, -ext.length ) + '.svg';

	const source = fs.readFileSync( from, 'utf-8' );
	const result = pathologist.transform( source );

	write( result, to );
}

function write ( result, to ) {
	if ( to ) {
		fs.writeFileSync( to, result );
	} else {
		console.log( result ); // eslint-disable-line no-console
	}
}

export default function runPathologist ( command ) {
	if ( command.input ) {
		compile( command.input, command.output, command );
	}

	else {
		process.stdin.resume();
		process.stdin.setEncoding( 'utf8' );

		let source = '';

		process.stdin.on( 'data', chunk => source += chunk );

		process.stdin.on( 'end', () => {
			const result = pathologist.transform( source );
			write( result, command );
		});
	}
}
