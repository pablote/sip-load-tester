/*globals module, require */
var util = require('util');
var RateLimiter = require('limiter').RateLimiter;
var rsvp = require('rsvp');
var request = require('request');

var n = 20;
var cps = 2;
var indexes = Array.apply(null, {length: n}).map(Number.call, Number);
var limiter = new RateLimiter(cps, 'second');
var requestPromises = [];

indexes.forEach(function (index) {
    requestPromises.push(new rsvp.Promise(function (resolve, reject) {
        limiter.removeTokens(1, function (err, remainingRequests) {
            var url = util.format('http://freeswitch:works@%s:8080/webapi/bgapi?lua%20summondialer.lua%20robot%20%s%40%s%20123%20sleep%3A8000%7Cdtmf%3A%s',
                '104.193.20.18', '6463500992', '104.193.20.18', '3438');
            request(url, function (error, response, body) {
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

