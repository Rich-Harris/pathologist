import minimist from 'minimist';
import help from './help.md';
import { version } from '../../package.json';
import runPathologist from './runPathologist';

const command = minimist( process.argv.slice( 2 ), {
	alias: {
		i: 'input',
		o: 'output'
	}
});

if ( command.help || ( process.argv.length <= 2 && process.stdin.isTTY ) ) {
	console.log( `\n${help.replace('__VERSION__', version)}\n` ); // eslint-disable-line no-console
}

else if ( command.version ) {
	console.log( `pathologist version ${version}` ); // eslint-disable-line no-console
}

else {
	runPathologist( command );
}
