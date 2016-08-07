const validNameCharacters = /[a-zA-Z:-]/;
const whitespace = /[\s\t\r\n]/;
const quotemark = /['"]/;

export default function parse ( source ) {
	const match = /^<\?.+\?>/.exec( source );
	const metadata = match ? match[0] : '';

	let i = metadata.length;
	let stack = [];

	let state = neutral;
	let currentElement = null;
	let root = null;

	function error ( message ) {
		const { line, column } = getLocation( source, i );
		const before = source.slice( 0, i );
		const beforeLine = /(^|\n).*$/.exec( before )[0];
		const after = source.slice( i );
		const afterLine = /.*(\n|$)/.exec( after )[0];

		const snippet = `${beforeLine}${afterLine}\n${ Array( beforeLine.length + 1 ).join( ' ' )}^`;

		throw new Error( `${message} (${line}:${column}). If this is valid SVG, it's probably a bug in pathologist. Please raise an issue at https://gitlab.com/Rich-Harris/pathologist/issues – thanks!\n\n${snippet}` );
	}

	function neutral () {
		const char = source[i];

		if ( char === '<' ) {
			return tag;
		}

		if ( whitespace.test( char ) ) {
			return neutral;
		}
	}

	function tag () {
		if ( source[i] === '/' ) {
			return closingTag;
		}

		const name = getName();

		const element = {
			name,
			attributes: {},
			children: []
		};

		if ( currentElement ) {
			currentElement.children.push( element );
		} else {
			root = element;
		}

		let attribute;
		while ( attribute = getAttribute() ) {
			element.attributes[ attribute.name ] = attribute.value;
		}

		let selfClosing = false;

		if ( source[i] === '/' ) {
			i += 1;
			selfClosing = true;
		}

		if ( source[i] !== '>' ) {
			error( 'Expected >' );
		}

		if ( !selfClosing ) {
			currentElement = element;
			stack.push( element );
		}

		return neutral;
	}

	function closingTag () {
		const name = getName();

		if ( name !== currentElement.name ) {
			error( `Expected closing tag </${name}> to match opening tag <${currentElement.name}>` );
		}

		if ( source[i] !== '>' ) {
			error( 'Expected >' );
		}

		i += 1;

		stack.pop();
		currentElement = stack[ stack.length - 1 ];

		return neutral;
	}

	function openingTag () {
		const name = getName();
	}

	function getName () {
		let name = '';
		while ( validNameCharacters.test( source[i] ) ) name += source[ i++ ];

		return name;
	}

	function getAttribute () {
		if ( !whitespace.test( source[i] ) ) return null;
		allowSpaces();

		const name = getName();

		allowSpaces();
		if ( source[i] === '=' ) {
			i += 1;
			allowSpaces();
			return { name, value: getAttributeValue() };
		}

		return { name, value: true };
	}

	function getAttributeValue () {
		return quotemark.test( source[i] ) ?
			getQuotedAttributeValue() :
			getUnquotedAttributeValue();
	}

	function getUnquotedAttributeValue () {
		let value = '';
		while ( source[i] !== ' ' ) value += source[ i++ ];

		return value;
	}

	function getQuotedAttributeValue () {
		const quotemark = source[ i++ ];

		let value = '';
		let escaped = false;

		while ( i < source.length ) {
			const char = source[ i++ ];
			if ( char === quotemark && !escaped ) {
				return value;
			}

			if ( char === '\\' && !escaped ) {
				escaped = true;
			}

			value += escaped ? `\\${char}` : char;
			escaped = false;
		}
	}

	function allowSpaces () {
		while ( whitespace.test( source[i] ) ) i += 1;
	}

	for ( i = 0; i < source.length; i += 1 ) {
		if ( !state ) error( 'Unexpected character' );
		state = state();
	}

	root.metadata = metadata;
	return root;
}

function getLocation ( source, charIndex ) {
	const lines = source.split( '\n' );
	const len = lines.length;

	for ( let i = 0, lineStart = 0; i < len; i += 1 ) {
		var line = lines[i];
		var lineEnd =  lineStart + line.length + 1; // +1 for newline

		if ( lineEnd > charIndex ) {
			return { line: i + 1, column: charIndex - lineStart };
		}

		lineStart = lineEnd;
	}

	throw new Error( `Could not determine location of character ${charIndex}` );
}
