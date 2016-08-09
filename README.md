# pathologist

Flatten (almost) everything in an SVG document to `<path>` elements without transforms. [See the demo at pathologist.surge.sh.](https://pathologist.surge.sh)


## Why?

You want to create artwork in Illustrator or Inkscape, but you need a flat list of paths so that you can, I don't know, easily render it to `<canvas>`. To be honest it's probably a bit niche. But I needed it, and I've been surprised in the past to learn that other people share my esoteric requirements, so here it is. Make of it what you will.


## Installation

`npm install pathologist` (with the `--global` flag if you want to use the command line interface), or grab it from [npmcdn.com](https://npmcdn.com/pathologist).


## Usage

### Command line

```bash
pathologist input.svg > output.svg
pathologist -i input-files -o output-fils
```

### JavaScript API

```js
const { parse, transform } = require( 'pathologist' ); // or `import`, etc

const svg = `
<svg>
	<g transform='scale(2)'>
		<path d='M0,0 L10,0 L10,10 L0,10Z' transform='translate(10,10)'/>
	</g>
</svg>
`.trim();

const parsed = parse( svg );

parsed.toString();
// <svg>
//   <path d="M20 20L40 20 40 40 20 40Z"/>
// </svg>

parsed.paths;
// [
//   { "d": "M20 20L40 20 40 40 20 40Z" }
// ]


// `transform(...)` is shorthand for `parse(...).toString()`
const transformed = transform( svg );
// <svg>
//   <path d="M20 20L40 20 40 40 20 40Z"/>
// </svg>
```


## Caveats and limitations

* Not battle-tested
* Attempts to inherit properties etc sensibly, but doesn't understand CSS precedence. Styles may not look exactly like you intended
* Things like `<text>` are not converted to paths


## License

MIT
