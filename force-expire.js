#!/usr/bin/env node
'use strict';

const Redis = require('@adexchange/aeg-redis').default;
//noinspection JSUnresolvedFunction
const argv = require('yargs')
	.usage('Usage: $0 pattern')
	.demand(1)
	.argv;

const pattern = argv._[0];
const client = new Redis({host: '127.0.0.1', port: 6379});

client.on('info', (event) => {
	console.log(event);
});

client.scan(pattern, (keys, callback) => {
	callback();
}, (err) => {
	if (err) {
		console.log(err);
	}
	console.log('done');
	process.exit(0);
});