const jsonLogic = require('json-logic-js')

jsonLogic.add_operation('replace', function (value, replacements) {
  let result = value
  for (const replacement of replacements) {
    const regex = new RegExp(replacement[0], 'g')
    result = result.replace(regex, replacement[1])
  }
  return result
})

const transform = (value, jsonLogicExp) => {
  if (jsonLogicExp) {
    return jsonLogic.apply(jsonLogicExp, { value })
  } else {
    return value
  }
}

module.exports = {
  transform
}
