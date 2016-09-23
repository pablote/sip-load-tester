module.exports = {
    totalCallsCount: 400,
    callsPerSecond: 10,
    origins: [{
            server: '1.1.1.1',
            enabled: true,
            username: 'username',
            password: 'password',
            weight: 10
        }
    ],
    destination: {
        server: '104.193.20.18',
        number: '6463500992',
        conferencePin: '9047'
    }
};