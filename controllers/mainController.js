const googleService = require('../services/googleService')
const gmailService = require('../services/gmailService')
const parserService = require('../services/parserService')
const transformerService = require('../services/transformService')
const config = require('config')

exports.run = async (req, res, next) => {
  try {
    const code = req.query.code
    if (code) {
      const result = []
      const parsers = config.get('parsers')
      const token = await googleService.getToken(code)
      const promises = []
      for (const parser of parsers) {
        console.log(`[${parser.id}] Parser start`)
        promises.push(gmailService.parseEmails(token, parser))
      }
      const results = await Promise.all(promises.values())
      results.map((emails, idx) => {
        const parser = parsers[idx]
        const parserResult = parserService.parseEmails(emails, parser)
        result.push({
          parser: parser.id,
          result: parserResult
        })
      })
      const resultTransformed = transformerService.transformResult({ results: result }, req.query.transformer)
      res.status(200).send(resultTransformed)
    } else {
      // Redirect to login
      const url = await googleService.getLoginURL()
      res.redirect(url)
    }
  } catch (err) {
    console.log(err)
    return res.status(500).send({
      status: 'ERROR',
      errorMessage: 'UNKNOWN'
    })
  }
}
