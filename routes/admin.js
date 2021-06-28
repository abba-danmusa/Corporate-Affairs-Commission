const express = require('express')
const router = express.Router()
const { catchErrors } = require('../handlers/errorHandlers')
const adminController = require('../controllers/adminController')
const authController = require('../controllers/authController')
const admin = require('../models/admin')

// Get routes
router.get('/admin', adminController.passwordProtected, adminController.live)
    // router.get('/admin/live', )
router.get('/admin/businesses', adminController.passwordProtected, catchErrors(adminController.getBusinesses))
router.get('/admin/businesses/page/:page', adminController.passwordProtected, catchErrors(adminController.getBusinesses))
router.get('/admin/business/:name/:id', adminController.passwordProtected, catchErrors(adminController.getBusiness))
router.get('/admin/register-user', adminController.passwordProtected, adminController.registerForm)
router.get('/admin/register-admin', adminController.passwordProtected, adminController.registerAdminForm)

// Post routes
router.post('/admin', authController.loginAdmin)
router.post('/admin/register-user', catchErrors(adminController.validateRegister), catchErrors(adminController.register))
router.post('/admin/register-admin', catchErrors(adminController.validateAdminRegister), catchErrors(adminController.registerAdmin))

module.exports = router