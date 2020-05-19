const swaggerJsdoc = require('swagger-jsdoc')
const options = {
  apis: ['./models/*.js', './routes/*.js'],
  basePath: '/',
  swaggerDefinition: {
    openapi: '3.0.1',
    components: {
      securitySchemes: {
        /* bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        } */
      }
    },
    info: {
      description: 'The GmailParser API',
      swagger: '2.0',
      title: 'GmailParser API',
      version: '1.0.0'
    }
  }
}
const swaggerSpecs = swaggerJsdoc(options)
const swaggerOptions = {
  swaggerOptions: {
    defaultModelsExpandDepth: -1
  }
}

module.exports = { swaggerSpecs, swaggerOptions }
