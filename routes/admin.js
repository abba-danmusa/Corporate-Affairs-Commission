const express = require('express')
const router = express.Router()
const { catchErrors } = require('../handlers/errorHandlers')
const adminController = require('../controllers/adminController')
const authController = require('../controllers/authController')
const admin = require('../models/admin')

// Get routes
router.get('/admin', adminController.passwordProtected, adminController.live)
router.get('/admin/businesses', adminController.passwordProtected, catchErrors(adminController.getBusinesses))
router.get('/admin/businesses/page/:page', adminController.passwordProtected, catchErrors(adminController.getBusinesses))
router.get('/admin/business/:name/:id', adminController.passwordProtected, catchErrors(adminController.getBusiness))
router.get('/admin/register-user', adminController.passwordProtected, adminController.registerForm)
router.get('/admin/registered-users', adminController.passwordProtected, catchErrors(adminController.getUsers))
router.get('/admin/register-admin', adminController.passwordProtected, adminController.registerAdminForm)

// router.get('/admin/search/results', adminController.getSearchedData)
// router.param('/admin/search/results?search=q/page/:page', adminController.getSearchedData)

// Post routes
router.post('/admin', authController.loginAdmin)
router.post('/admin/register-user', adminController.passwordProtected, catchErrors(adminController.validateRegister), catchErrors(adminController.register))
router.post('/admin/registered-users/delete-user/:id', adminController.passwordProtected, catchErrors(adminController.deleteUser))
router.post('/admin/business/:name/:id', adminController.passwordProtected, catchErrors(adminController.deleteBusiness))
router.post('/admin/register-admin', adminController.passwordProtected, catchErrors(adminController.validateAdminRegister), catchErrors(adminController.registerAdmin))

// API's
router.get('/admin/api/search', adminController.passwordProtected, catchErrors(adminController.searchByBusinessName))

module.exports = router