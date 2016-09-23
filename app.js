/*globals module, require */
var util = require('util');
var RateLimiter = require('limiter').RateLimiter;
var rsvp = require('rsvp');
var config = require('./config');
var CallUrl = require('./CallUrl');

var limiter = new RateLimiter(config.callsPerSecond, 'second');
var indexes = Array.apply(null, {length: config.totalCallsCount}).map(Number.call, Number);
var requestPromises = [];

indexes.forEach(function (index) {
    requestPromises.push(new CallUrl(limiter).run());
});

var start = new Date();
rsvp.allSettled(requestPromises, 'all-requests-promise')
    .then(function () {
        console.log('all done duration=' + (new Date() - start));
    })
    .catch(function (error) {
        console.error(error);
    });

