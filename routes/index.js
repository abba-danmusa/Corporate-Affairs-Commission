const express = require('express')
const router = express.Router()
const { catchErrors } = require('../handlers/errorHandlers')
const userController = require('../controllers/userController')
const authController = require('../controllers/authController')
const adminController = require('../controllers/adminController')

// Get routes
router.get('/', authController.isLoggedIn, authController.mustChangePassword, userController.entryForm)
router.get('/change-password', userController.changePasswordForm)
router.get('/login', authController.hasSession, userController.loginForm)
router.get('/:state/saved-entries', authController.isLoggedIn, catchErrors(userController.getHistory))
router.get('/:state/business/:id', catchErrors(userController.getBusiness))
router.get('/logout', authController.isLoggedIn, authController.logout)
router.get('/search/results', authController.isLoggedIn, userController.getSearchedData)
router.get('/register-user', userController.createUserForm)
router.get('/edit', userController.editForm)

// Post routes
// router.post('/', catchErrors(userController.saveEntry))
router.post('/posts', userController.post)
router.post('/register-user', catchErrors(adminController.validateAdminRegister), catchErrors(userController.createUser))
router.get('/post', userController.view)
router.post('/login', authController.login)
router.post('/change-password', authController.confirmPasswords, authController.changePassword)

// API's
router.get('/api/search', catchErrors(userController.searchByBusinessName))


module.exports = router