const { validationResult } = require('express-validator')

module.exports = (req, res, next) => {
  const errors = validationResult(req)
  if (errors.isEmpty()) {
    return next()
  } else {
    console.log('Validation error')
    return res.status(400).json({
      status: 'error',
      statusCode: 400,
      message: 'Validation error',
      errors: errors.array()
    })
  }
}
