const jsonLogic = require('json-logic-js')
const config = require('config')
const path = require('path')
const Handlebars = require('handlebars')
const fs = require('fs')

Handlebars.registerHelper('decimal', (number) => {
  return number.replace('.', ',')
})

Handlebars.registerHelper('json', (object) => {
  return JSON.stringify(object)
})

Handlebars.registerHelper('ifNotIn', (arg1, ...args) => {
  const options = args.pop()
  return (!args.includes(arg1)) ? options.fn(this) : options.inverse(this)
})

jsonLogic.add_operation('replace', function (value, replacements) {
  let result = value
  for (const replacement of replacements) {
    const regex = new RegExp(replacement[0], 'g')
    result = result.replace(regex, replacement[1])
  }
  return result
})

const transformValue = (value, jsonLogicExp) => {
  if (jsonLogicExp) {
    return jsonLogic.apply(jsonLogicExp, { value })
  } else {
    return value
  }
}

const transformResult = (result, transformerId) => {
  const transformers = config.get('transformers')
  let transformer
  if (transformerId) {
    transformer = transformers.filter(t => t.id === transformerId)
  } else {
    transformer = transformers[0]
  }
  const templateFile = path.join(__dirname, '../templates', transformer.template)
  const templateContent = fs.readFileSync(templateFile, 'utf8')
  const template = Handlebars.compile(templateContent)
  const htmlResult = template(result)
  return htmlResult
}

module.exports = {
  transformValue,
  transformResult
}
