const transformService = require('./transformService')
const xpath = require('xpath')
const DOM = require('xmldom').DOMParser
var jp = require('jsonpath')

const parsers = {
  // XML Parser
  xml: (entry, field, target) => {
    const doc = new DOM({ errorHandler: { warning: function (w) { } } }).parseFromString(target)
    let nodes
    for (const path of field.paths) {
      nodes = xpath.select(path, doc)
      if (nodes && nodes.length) break
    }
    const value = (nodes instanceof Array ? nodes[0] : nodes)
      .toString()
      .trim()
      .replace(/(\r\n|\n|\r)/gm, ' ')
    entry[field.name] = transformService.transform(value, field.transform)
    console.log(field.name)
  },
  // JSON Parser
  json: (entry, field, target) => {
    let result
    for (const path of field.paths) {
      result = jp.query(target, path, 1)
      if (result && result.length > 0) break
    }
    entry[field.name] = transformService.transform(result[0], field.transform)
  }
}

const parseEmails = (emails, parser) => {
  const result = []
  const parserFn = parsers[parser.format]
  const total = emails.length
  let current = 1
  for (const email of emails) {
    console.log(`[${parser.id}] Parsing email ${current} of ${total}`)
    const entry = {}
    for (const field of parser.fields) {
      parserFn(entry, field, email)
    }
    result.push(entry)
    current++
  }
  return result
}

module.exports = {
  parseEmails
}
