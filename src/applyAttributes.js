import { assign } from './utils/object.js';

export default function applyAttributes ( node, attributes ) {
	node.attributes = assign( attributes, node.attributes );
}
