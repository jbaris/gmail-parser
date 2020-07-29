const { google } = require('googleapis')
const ErrorHandler = require('../common/error')
const googleClient = require('../common/google')
var MailParser = require('mailparser-mit').MailParser
const attachmentService = require('./attachmentService')

const parseEmails = async (token, parser) => {
  const oauth2Client = googleClient.build()
  try {
    oauth2Client.credentials = token
  } catch (err) {
    throw new ErrorHandler(401, 'Forbidden')
  }
  try {
    const promises = []
    var gmail = google.gmail({ version: 'v1', auth: oauth2Client })
    const currentDate = new Date()
    const currentYear = currentDate.getFullYear() // this year
    const currentMonth = currentDate.getMonth() // past month
    const listResp = await gmail.users.messages.list({
      userId: 'me',
      q: parser.filter + ` after: ${currentYear}/${currentMonth}/01`
    })
    console.log(`Parser ${parser.id} resultSizeEstimate = ${listResp.data.resultSizeEstimate}`)
    const messages = listResp.data.messages || []
    for (const message of messages) {
      const getResp = await gmail.users.messages.get({
        userId: 'me',
        id: message.id,
        format: 'raw'
      })
      const buff = Buffer.from(getResp.data.raw, 'base64')
      const base64data = buff.toString()
      var mailparser = new MailParser()
      const promise = new Promise(function (resolve, reject) {
        mailparser.on('end', function (mailObject) {
          if (parser.target === 'body') {
            resolve(mailObject.html)
          } else if (parser.target.startsWith('attachment')) {
            const attachmentType = parser.target.substring(11)
            resolve(attachmentService.parseEmailAttachments(attachmentType, mailObject.attachments))
          } else {
            throw new ErrorHandler(500, 'Invalid parser target: ' + parser.target)
          }
        })
        mailparser.write(base64data)
        mailparser.end()
      })
      promises.push(promise)
    }
    return Promise.all(promises)
  } catch (err) {
    console.log(err)
    throw new ErrorHandler(500, 'Unexpected error')
  }
}

module.exports = {
  parseEmails
}
