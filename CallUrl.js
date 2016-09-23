var util = require('util');
var url = require('url');
var rsvp = require('rsvp');
var request = require('request');
var u = require('underscore');
var config = require('./config');

module.exports = (function () {
    function CallUrl(limiter) {
        this.limiter = limiter;
    }

    function getOriginServer(self) {
        var availableOrigins = u.filter(config.origins, function (origin) { return origin.enabled; });
        return availableOrigins[Math.floor(Math.random() * availableOrigins.length)];
    }

    CallUrl.prototype.run = function () {
        var self = this;
        return new rsvp.Promise(function (resolve, reject) {
            self.limiter.removeTokens(1, function (err, remainingRequests) {
                var origin = getOriginServer(self);
                var baseUrl = util.format('http://%s:%s@%s:8080/', origin.username, origin.password, origin.server);
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
        }, 'call-url-promise');
    };

    return CallUrl;
}());