// https://dev.to/nedsoft/central-error-handling-in-express-3aej

module.exports = class ErrorHandler extends Error {
  constructor (statusCode, message) {
    super()
    this.statusCode = statusCode
    this.message = message
  }
}
