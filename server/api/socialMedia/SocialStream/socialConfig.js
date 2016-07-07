module.exports = {
  twitter: {
    consumer_key: '0wwpfCwUgKWPfv2GdjBtMMjtz',
    consumer_secret: 'ehh6Kdd23TMW2IYw106G4FgXWRs9A7VFrDGwT5U84BgBMkO28o',
    access_token: '4873289201-g32RVWdcapVPBbLugJGqZKuUHGfTLKi8lI2Ht6x',
    access_token_secret: 'Cv7MgppHa15eu8bQYfCIaRyPVciv7RACVfl1xsqVRdQrb',
  },
  facebook: {
    client_id:      '126507794443463'
    , client_secret:  '540324150fc337db8354f6fda3afbfb7'
    , scope:          'email, user_about_me, user_birthday, user_location, publish_stream'
    , redirect_uri:   'http://localhost:9000/auth/facebook'
  },
  StreamTolerance : 880000, //15min tolerance window for connect/disconnect tolerance,
  mockTweetDelay : 200
};
