const express = require('express')
const router = express.Router()
const { catchErrors } = require('../handlers/errorHandlers')
const userController = require('../controllers/userController')
const authController = require('../controllers/authController')
const adminController = require('../controllers/adminController')

// Get routes
router.get('/', authController.isLoggedIn, authController.mustChangePassword, userController.entryForm)
router.get('/login', authController.hasSession, userController.loginForm)
    // router.get('/head-office', authController.isLoggedIn, authController.mustChangePassword, userController.taskQueue)
    // router.get('/head-office/login', authController.hasSession, userController.loginForm)
router.get('/back', userController.back)
router.get('/change-password', userController.changePasswordForm)
router.get('/:state/saved-entries', authController.isLoggedIn, catchErrors(userController.getHistory))
router.get('/:state/:slug/:id', authController.isLoggedIn, catchErrors(userController.getBusiness))
router.get('/logout', authController.isLoggedIn, authController.logout)
    // router.get('/search/results', authController.isLoggedIn, userController.getSearchedData)
router.get('/register-user', authController.isLoggedIn, userController.createUserForm)
router.get('/edit/:id', authController.isLoggedIn, catchErrors(userController.editForm))

router.get('/:user/:id', authController.isLoggedIn, catchErrors(userController.superviseUser))
router.get('/history/tasks/:user/:id', authController.isLoggedIn, catchErrors(userController.userTasks))
router.get('/stats', authController.isLoggedIn, catchErrors(userController.getStats))
    // router.get('/history/total/:user/:id', authController.isLoggedIn, userController.)

// Post routes
// router.post('/', catchErrors(userController.saveEntry))
// router.post('/posts', userController.post)
router.post('/register-user', authController.isLoggedIn, catchErrors(adminController.validateAdminRegister), catchErrors(userController.createUser))
router.post('/login', authController.login)
router.post('/change-password', authController.confirmPasswords, authController.changePassword)
router.post('/edit/:id', authController.isLoggedIn, catchErrors(userController.edit))

router.post('/deactivate/:user/:id', authController.isLoggedIn, catchErrors(userController.deactivateUser))
router.post('/activate/:user/:id', authController.isLoggedIn, catchErrors(userController.activateUser))
router.post('/share/:user/:id', authController.isLoggedIn, catchErrors(userController.shareTaskQueue))

// API's
router.get('/api/search', catchErrors(userController.searchByBusinessName))


module.exports = router