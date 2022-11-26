import fs from 'fs';

// read gcc.trace, read01.trace, and swim.trace from static folder
const gcc = fs.readFileSync('./static/gcc.trace', 'utf8');
const read01 = fs.readFileSync('./static/read01.trace', 'utf8');
const swim = fs.readFileSync('./static/swim.trace', 'utf8');

/** @type {import('./$types').PageServerLoad} */
export function load({ params }) {
	return {
		props: {
			gcc,
			read01,
			swim
		}
	};
}
