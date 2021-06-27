const express = require('express')
const router = express.Router()
const { catchErrors } = require('../handlers/errorHandlers')
const userController = require('../controllers/userController')
const authController = require('../controllers/authController')

// Get routes
router.get('/', userController.loginForm)
router.get('/new-entry', userController.entryForm)
router.get('/logout', authController.isLoggedIn, authController.logout)
router.get('/:state/saved-entries', authController.isLoggedIn, catchErrors(userController.getHistory))
router.get('/business/:id', catchErrors(userController.getBusinessDetails))

// Post routes
router.post('/', authController.login)
router.post('/new-entry', catchErrors(userController.saveEntry))

// API's
router.get('/api/search', catchErrors(userController.searchByBusinessName))


module.exports = router