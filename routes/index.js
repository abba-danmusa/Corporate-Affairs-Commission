const express = require('express')
const router = express.Router()
const { catchErrors } = require('../handlers/errorHandlers')
const userController = require('../controllers/userController')
const authController = require('../controllers/authController')

// Get routes
router.get('/', authController.isLoggedIn, userController.entryForm)
router.get('/login', userController.loginForm)
router.get('/:state/saved-entries', authController.isLoggedIn, catchErrors(userController.getHistory))
router.get('/logout', authController.isLoggedIn, authController.logout)

// Post routes
router.post('/', catchErrors(userController.saveEntry))
router.post('/login', authController.login)

// API's
router.get('/api/search', catchErrors(userController.searchByBusinessName))


module.exports = router