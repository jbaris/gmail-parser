const express = require('express')
const handleError = require('../middleware/error')
const morgan = require('morgan')
const cors = require('cors')
const swaggerUi = require('swagger-ui-express')
const { swaggerSpecs, swaggerOptions } = require('./swagger')

const app = express()

// Use the middlewares
app.use(express.json({ extended: true }))
app.use(morgan('combined'))
app.use(cors())

// Create all the endpoints
app.use('/', require('../routes/main'))

// Swagger config
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs, swaggerOptions))

// Error middleware
app.use(handleError)

module.exports = app
