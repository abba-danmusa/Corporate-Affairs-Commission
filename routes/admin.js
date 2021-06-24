const express = require('express')
const router = express.Router()
const { catchErrors } = require('../handlers/errorHandlers')
const adminController = require('../controllers/adminController')

// Get routes
router.get('/admin', adminController.passwordProtected, catchErrors(adminController.inComingEntries))
router.get('/admin/register-user', adminController.passwordProtected, adminController.registerForm)

// Post routes
router.post('/admin/register-user', adminController.passwordProtected, catchErrors(adminController.validateRegister), catchErrors(adminController.register))

module.exports = router