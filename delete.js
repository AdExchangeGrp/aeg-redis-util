#!/usr/bin/env node
'use strict';

const _ = require('lodash');
const redis = require('redis');
//noinspection JSUnresolvedFunction
const argv = require('yargs')
	.usage('Usage: $0 pattern')
	.demand(1)
	.argv;

const LIMIT = 1000;
const pattern = argv._[0];
const client = redis.createClient({host: '127.0.0.1', port: 6391});

scan(pattern,
	(keys, callback) => {
		del(keys, callback);
	},
	(err) => {
		if (err) {
			console.log(err);
		}
		console.log('done');
		process.exit(0);
	});

function del(keys, callback) {
	console.log('deleting keys', keys.count);
	_.each(keys, (key) => {
		console.log('deleting', key);
	});
	//noinspection JSUnresolvedFunction
	client.del(keys, callback);
}

function scan(pattern, delegate, callback) {

	let cursor = '0';
	let cycle = 0;

	_scan(callback);

	function _scan(callback) {
		//noinspection JSUnresolvedFunction
		client.scan(
			cursor,
			'MATCH', pattern,
			'COUNT', LIMIT,
			(err, res) => {

				if (err) {
					return callback(err);
				}

				cursor = res[0];
				cycle++;

				const keys = res[1];

				if (keys.length > 0) {
					delegate(keys, (err) => {
						if (err) {
							callback(err);
						} else {
							processCycle();
						}
					});
				} else {
					processCycle();
				}

				function processCycle() {
					console.log('scan cycle', cycle, 'keys', cycle * LIMIT);
					if (cursor === '0') {
						callback();
					} else {
						_scan(callback);
					}
				}
			}
		);
	}
}

