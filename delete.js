#!/usr/bin/env node
'use strict';

const Redis = require('@adexchange/aeg-redis').default;
//noinspection JSUnresolvedFunction
const argv = require('yargs')
	.usage('Usage: $0 pattern')
	.demand(1)
	.argv;

const pattern = argv._[0];
const client = new Redis({host: 'localhost', port: 6381});

client.on('info', (event) => {
	console.log(event);
});

client.scanDel(pattern, (err) => {
	if (err) {
		console.log(err);
	}
	console.log('done');
	process.exit(0);
});