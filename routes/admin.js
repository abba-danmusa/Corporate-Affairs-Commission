const express = require('express')
const router = express.Router()
const { catchErrors } = require('../handlers/errorHandlers')
const adminController = require('../controllers/adminController')
const authController = require('../controllers/authController')

// Get routes
router.get('/admin', adminController.passwordProtected)
router.get('/admin/live', adminController.live)
router.get('/admin/businesses', catchErrors(adminController.getBusinesses))
router.get('/business/page/:page', catchErrors(adminController.getBusinesses))
router.get('/admin/register-user', adminController.registerForm)
router.get('/admin/register-admin', adminController.registerAdminForm)

// Post routes
router.post('/admin', authController.loginAdmin)
router.post('/admin/register-user', catchErrors(adminController.validateRegister), catchErrors(adminController.register))
router.post('/admin/register-admin', catchErrors(adminController.validateAdminRegister), catchErrors(adminController.registerAdmin))

module.exports = router