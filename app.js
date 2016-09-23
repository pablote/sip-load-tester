/*globals module, require */
var util = require('util');
var url = require('url');
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
            var conferencePin = '9047';
            var originServer = '104.193.20.18';
            var destinationServer = '104.193.20.18';
            var destinationNumber = '6463500992';
            var baseUrl = util.format('http://freeswitch:works@%s:8080/', originServer);
            var urlPath = util.format('webapi/bgapi?lua summondialer.lua robot %s@%s 123 sleep:8000|dtmf:%s',
                destinationNumber, destinationServer, conferencePin);

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

