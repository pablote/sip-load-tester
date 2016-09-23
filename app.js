/*globals module, require */
var util = require('util');
var url = require('url');
var RateLimiter = require('limiter').RateLimiter;
var rsvp = require('rsvp');
var request = require('request');
var config = require('./config');

var indexes = Array.apply(null, {length: config.totalCallsCount}).map(Number.call, Number);
var limiter = new RateLimiter(config.callsPerSecond, 'second');
var requestPromises = [];

indexes.forEach(function (index) {
    requestPromises.push(new rsvp.Promise(function (resolve, reject) {
        limiter.removeTokens(1, function (err, remainingRequests) {
            var baseUrl = util.format('http://freeswitch:works@%s:8080/', config.origins[0].server);
            var urlPath = util.format('webapi/bgapi?lua summondialer.lua robot %s@%s 123 sleep:8000|dtmf:%s',
                config.destination.number,
                config.destination.server,
                config.destination.conferencePin);

            request(url.resolve(baseUrl, encodeURIComponent(urlPath)), function (error, response, body) {
                if (error) {
                    reject(error);
                } else if (response.statusCode !== 200) {
                    reject(new Error('Unexpected statusCode=' + response.statusCode));
                } else {
                    console.log(body);
                    resolve();
                }
            });
        });
    }));
});

var start = new Date();
rsvp.allSettled(requestPromises)
    .then(function () {
        console.log('all done duration=' + (new Date() - start));
    })
    .catch(function (error) {
        console.error(error);
    });

