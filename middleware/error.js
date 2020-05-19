module.exports = (err, req, res, next) => {
  let { statusCode, message } = err
  if (!statusCode) {
    if (err.name === 'UnauthorizedError') {
      statusCode = 401
    } else {
      statusCode = 500
    }
  }
  message = message || 'Unexpected error'
  // TODO improve logs
  console.log(err)
  console.log('Error occured: statusCode [' + statusCode + '] message [' + message + ']')
  res.status(statusCode).json({
    status: 'error',
    statusCode,
    message
  })
}
