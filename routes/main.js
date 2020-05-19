const express = require('express')
const router = express.Router()
const mainController = require('../controllers/mainController')
// const { check } = require('express-validator')
// const validate = require('../middleware/validation.js')

/**
 * @swagger
 * /:
 *   get:
 *     description: Todo
 *     tags: [Users]
 *     produces:
 *       - application/json
 *     requestBody:
 *       description: User object
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NewUser'
 *     responses:
 *       200:
 *         description: No results
 *       400:
 *         description: The user already exists
 *       500:
 *         description: Unexpected server error
 */
router.get('/',
//  validate,
  mainController.run
)

module.exports = router
