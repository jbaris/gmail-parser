const config = require('config')
const googleServicesConfig = config.get('google_services')
// eslint-disable-next-line camelcase
const { client_secret, client_id, redirect_uris } = googleServicesConfig
const { google } = require('googleapis')

const build = () => new google.auth.OAuth2(client_id, client_secret, redirect_uris[0])

module.exports = {
  build
}
