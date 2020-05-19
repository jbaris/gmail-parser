const googleClient = require('../common/google')
const SCOPES = ['https://www.googleapis.com/auth/gmail.readonly']

const getToken = async (code) => {
  const oauth2Client = googleClient.build()
  const token = (await oauth2Client.getToken(code)).tokens
  return token
}

const getLoginURL = async () => {
  const oAuth2Client = googleClient.build()
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES
  })
  return authUrl
}

module.exports = {
  getToken,
  getLoginURL
}
