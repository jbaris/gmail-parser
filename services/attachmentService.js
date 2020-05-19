const ErrorHandler = require('../common/error')
const PDFExtract = require('pdf.js-extract').PDFExtract

const parseEmailAttachments = async (attachmentType, attachments) => {
  if (!attachments || attachments.length !== 1) {
    throw new ErrorHandler(400, 'Attachment not valid: ' + attachments)
  }
  const attachment = attachments[0]
  if (attachmentType === 'pdf') {
    const pdfExtract = new PDFExtract()
    const options = {}
    const promise = new Promise(function (resolve, reject) {
      const buffer = Buffer.from(attachment.content, 'base64')
      pdfExtract.extractBuffer(buffer, options, (err, data) => {
        if (err) return reject(err)
        resolve(data)
      })
    })
    return promise
  } else {
    throw new ErrorHandler(400, 'Attachment not supported: ' + attachmentType)
  }
}

module.exports = {
  parseEmailAttachments: parseEmailAttachments
}
