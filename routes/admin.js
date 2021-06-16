const express = require('express')
const router = express.Router()
const { catchErrors } = require('../handlers/errorHandlers')
const adminController = require('../controllers/adminController')

// Get routes
router.get('/admin', adminController.loginForm)
router.get('/register-new-user', adminController.registerForm)

// Post routes
router.post('/register-new-user', catchErrors(adminController.validateRegister), catchErrors(adminController.register))
router.post('/admin', )

module.exports = router