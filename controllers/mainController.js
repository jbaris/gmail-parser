const googleService = require('../services/googleService')
const gmailService = require('../services/gmailService')
const parserService = require('../services/parserService')
const config = require('config')

exports.run = async (req, res, next) => {
  try {
    const code = req.query.code
    if (code) {
      const result = {}
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
        result[parser.id] = parserService.parseEmails(emails, parser)
      })
      res.json(result)
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
