module.exports = {
    totalCallsCount: 400,
    callsPerSecond: 10,
    origins: [
        {
            server: '104.193.20.18',
            enabled: true,
            username: 'freeswitch',
            password: 'works',
            weight: 30
        },
        {
            server: '10.0.82.91',
            enabled: true,
            username: 'freeswitch',
            password: 'works',
            weight: 10
        },
        {
            server: '10.0.82.92',
            enabled: true,
            username: 'freeswitch',
            password: 'works',
            weight: 10
        },
        {
            server: '104.193.20.11',
            enabled: true,
            username: 'freeswitch',
            password: 'works',
            weight: 10
        },
        {
            server: '104.193.20.12',
            enabled: true,
            username: 'freeswitch',
            password: 'works',
            weight: 10
        }
    ],
    destination: {
        server: '104.193.20.18',
        number: '6463500992',
        conferencePin: '9047'
    }
};