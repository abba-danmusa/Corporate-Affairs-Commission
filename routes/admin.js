const express = require('express')
const router = express.Router()
const { catchErrors } = require('../handlers/errorHandlers')
const adminController = require('../controllers/adminController')
const authController = require('../controllers/authController')

// Get routes
router.get('/admin', adminController.loginForm)
router.get('/admin/register-user', adminController.registerForm)
router.get('/admin/register-admin', adminController.registerAdminForm)

// Post routes
router.post('/admin', authController.login)
router.post('/admin/register-user', catchErrors(adminController.validateRegister), catchErrors(adminController.register))
router.post('/admin/register-admin', catchErrors(adminController.validateAdminRegister), catchErrors(adminController.registerAdmin))

module.exports = router