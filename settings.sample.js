/* rename to settings.js and fill with credentials */

module.exports = {
    BASE_PATH: "http://placeez-api.wip/",
    JWT_SECRET: 'abc123',
    DB_INFO: {
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'locme',
        charset: 'utf8mb4',
        multipleStatements: true
    },
    PORT: 3022,
    crypto: {
        algorithm: 'aes-256-ctr',
        password: 'xyz789'
    },
    places_api: {
        key: "noKey"
    },
    mapbox: {
        rescuekey: "sk.ey",
        key: "sk.ey"
    },
    foursquare: {
        client_id: "T1",
        client_secret: "LL",
        api_version: "20190101"     
    }
}
