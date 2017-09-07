'use strict';

/**
 * Benchmark related modules.
 */
var benchmark = require('benchmark');

/**
 * Preparation code.
 */
var Master = require('../../');

var MAX_LISTENERS = Math.pow(2, 32) - 1;

function handle() {
    if (arguments.length > 100) console.log('damn');
}

/**
 * Instances.
 */
var master = new Master();

master.setMaxListeners(MAX_LISTENERS);

for (var i = 0; i < 25; i++) {
    master.on('event', handle);
}

new benchmark.Suite()
    .add('EventEmitter3(master)', function() {
        master
            .onceAny(['foo'], handle)[0].emit('foo');
    })
    .on('cycle', function cycle(e) {
        console.log(e.target.toString());
    })
    .on('complete', function completed() {
        console.log('Fastest is %s', this.filter('fastest').map('name'));
    })
    .run({ async: true });
