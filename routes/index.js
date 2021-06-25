const express = require('express')
const router = express.Router()
const { catchErrors } = require('../handlers/errorHandlers')
const userController = require('../controllers/userController')
const authController = require('../controllers/authController')

// Get routes
router.get('/', userController.loginForm)
router.get('/logout', authController.logout)
router.get('/new-entry', authController.isLoggedIn, userController.entryForm)
router.get('/:state/saved-entries', authController.isLoggedIn, catchErrors(userController.getHistory))

// Post routes
router.post('/', authController.hasSession, authController.login)
router.post('/new-entry', catchErrors(userController.saveEntry))

// API's
router.get('/api/search', catchErrors(userController.searchByBusinessName))


module.exports = router