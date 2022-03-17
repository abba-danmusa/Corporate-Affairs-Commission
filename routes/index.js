const express = require('express')
const router = express.Router()
const { catchErrors } = require('../handlers/errorHandlers')
const userController = require('../controllers/userController')
const authController = require('../controllers/authController')
const adminController = require('../controllers/adminController')

// Get routes
router.get('/', authController.isLoggedIn, authController.mustChangePassword, userController.entryForm)
router.get('/login', authController.hasSession, userController.loginForm)
router.get('/businesses', authController.isLoggedIn, catchErrors(userController.getBusinesses))
router.get('/businesses/page/:page', authController.isLoggedIn, catchErrors(userController.getBusinesses))
router.get('/registered-users', authController.isLoggedIn, catchErrors(userController.registeredUsers))
    // router.get('/head-office', authController.isLoggedIn, authController.mustChangePassword, userController.taskQueue)
    // router.get('/head-office/login', authController.hasSession, userController.loginForm)
router.get('/back', userController.back)
router.get('/change-password', userController.changePasswordForm)
router.get('/reset-password/:id', userController.resetPassword)
router.get('/:state/:user/history/:id', authController.isLoggedIn, catchErrors(userController.getHistory))
router.get('/:state/history', authController.isLoggedIn, catchErrors(userController.getAllStateHistory))

router.get('/:state/business/:id', authController.isLoggedIn, catchErrors(userController.getBusiness))
router.get('/logout', authController.isLoggedIn, authController.logout)
    // router.get('/search/results', authController.isLoggedIn, userController.getSearchedData)
router.get('/register-user', authController.isLoggedIn, userController.createUserForm)
router.get('/edit/:id', authController.isLoggedIn, catchErrors(userController.editForm))

router.get('/:user/:id', authController.isLoggedIn, catchErrors(userController.superviseUser))
router.get('/history/tasks/:user/:id', authController.isLoggedIn, catchErrors(userController.userTasks))
router.get('/stats', authController.isLoggedIn, catchErrors(userController.getStats))
router.get('/:state/stats', authController.isLoggedIn, userController.getStats)
router.get('/user/:state/:user/:id', authController.isLoggedIn, catchErrors(userController.viewUser))
router.get('/business/:name/:id', authController.isLoggedIn, catchErrors(adminController.getBusiness))
router.get('/treat/:slug/:id', authController.isLoggedIn, catchErrors(userController.treat))
    // router.get('/history', authController.isLoggedIn, catchErrors(userController.getBusinesses))
    // router.get('/history/page/:page', catchErrors(userController.getBusinesses))
router.get('/register', authController.isLoggedIn, userController.headRegister)
    // router.get('/history/total/:user/:id', authController.isLoggedIn, userController.)

// Post routes

router.post('/register-user', authController.isLoggedIn, catchErrors(adminController.validateAdminRegister), catchErrors(userController.createUser))
router.post('/login', authController.login)
router.post('/change-password', authController.isLoggedIn, authController.confirmPasswords, authController.changePassword)
router.post('/reset-password/:id', authController.isLoggedIn, authController.confirmPasswords, authController.resetPassword)
    // router.post('/edit/:id', authController.isLoggedIn, catchErrors(userController.edit))
router.post('/deactivate/:user/:id', authController.isLoggedIn, catchErrors(userController.deactivateUser))
router.post('/activate/:user/:id', authController.isLoggedIn, catchErrors(userController.activateUser))
router.post('/share/:user/:id', authController.isLoggedIn, catchErrors(userController.shareTaskQueue))
router.post('/:state/:business/:id', authController.isLoggedIn, catchErrors(userController.acknowledge))

// API's
router.get('/api/v1/users/history/search', catchErrors(userController.searchByBusinessName))
router.get('/api/v1/state/search', catchErrors(userController.searchByState))


module.exports = router