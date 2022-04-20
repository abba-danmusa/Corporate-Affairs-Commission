const express = require('express')
const router = express.Router()
const { catchErrors } = require('../handlers/errorHandlers')
const adminController = require('../controllers/adminController')
const authController = require('../controllers/authController')
const admin = require('../models/admin')

// Get routes
router.get('/admin', adminController.passwordProtected, adminController.live)
router.get('/admin/businesses', catchErrors(adminController.getBusinesses))
router.get('/admin/businesses/page/:page', catchErrors(adminController.getBusinesses))
router.get('/admin/business/:name/:id', catchErrors(adminController.getBusiness))
router.get('/admin/register-user', adminController.passwordProtected, adminController.registerForm)
router.get('/admin/registered-users', adminController.passwordProtected, catchErrors(adminController.getUsers))
router.get('/admin/register-admin', adminController.passwordProtected, adminController.registerAdminForm)
router.get('/admin/reset-user/:id', adminController.passwordProtected, catchErrors(adminController.resetUser))
router.get('/admin/update-user/:id', adminController.passwordProtected, catchErrors(adminController.updateUser))
    // router.get('/admin/search/results', adminController.getSearchedData)
    // router.param('/admin/search/results?search=q/page/:page', adminController.getSearchedData)

// Post routes
router.post('/admin/update-user/:id', adminController.passwordProtected, catchErrors(adminController.updatedUser))
router.post('/admin', authController.loginAdmin)
router.post('/admin/register-user', adminController.passwordProtected, catchErrors(adminController.validateRegister), catchErrors(adminController.register))
    // router.post('/admin/', adminController.passwordProtected, adminController.resetUser)
router.post('/admin/business/:name/:id', catchErrors(adminController.deleteBusiness))
router.post('/admin/register-admin', adminController.passwordProtected, catchErrors(adminController.validateAdminRegister), catchErrors(adminController.registerAdmin))
router.post('/admin/reset-user/:id', adminController.passwordProtected, authController.confirmPasswords, catchErrors(authController.adminResetPassword))

// API's
router.get('/admin/api/search', catchErrors(adminController.searchByBusinessName))

module.exports = router