const User = require("../models/user")
const { promisify } = require('es6-promisify')
const { check, validationResult } = require('express-validator')
const Business = require("../models/business")
const Admin = require("../models/admin")


exports.passwordProtected = (req, res, next) => {
    res.set('WWW-Authenticate', 'Basic realm="Corporate Affairs Commission"')
    if (req.headers.authorization == 'Basic Y2FjYWRtaW46bG92ZQ==') {
        next()
    } else {
        res.status(401).send('Authentication Required')
    }
}

exports.loginForm = (req, res) => {
    res.render('loginAdmin', { title: 'Admin Login' })
}

exports.registerAdminForm = (req, res) => {
    res.render('registerAdmin', { title: 'Register new Admin' })
}

exports.registerForm = (req, res, next) => {
    res.render('registerUser', { title: 'Register New User' })
}

exports.validateAdminRegister = async(req, res, next) => {
    await check('name').run(req)
    await check('name', 'You must supply a name').notEmpty().run(req)
        // await check('email').normalizeEmail({
        //     remove_dots: false,
        //     remove_extension: false,
        //     gmail_remove_subaddress: false
        // }).run(req)
    await check('password', 'Password cannot be blank').notEmpty().run(req)
    await check('confirm-password', 'Confirm-password cannot be empty').notEmpty().run(req)
    await check('confirm-password', 'Oops\! passwords must be equal').equals(req.body.password).run(req)

    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        req.flash('error', errors.array().map(err => err.msg))
        res.render('registerAdmin', { title: 'Register', body: req.body, flashes: req.flash() })
        return
    }
    next()
}

exports.validateRegister = async(req, res, next) => {
    await check('name').run(req)
    await check('name', 'You must supply a name').notEmpty().run(req)
    await check('userName', 'You must supply a user name').notEmpty().run(req)
    await check('userName').run(req)
    await check('state').run(req)
    await check('state', 'You must supply a state').notEmpty().run(req)
        // await check('email').normalizeEmail({
        //     remove_dots: false,
        //     remove_extension: false,
        //     gmail_remove_subaddress: false
        // }).run(req)
    await check('password', 'Password cannot be blank').notEmpty().run(req)
    await check('confirm-password', 'Confirm-password cannot be empty').notEmpty().run(req)
    await check('confirm-password', 'Oops\! passwords must be equal').equals(req.body.password).run(req)

    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        req.flash('error', errors.array().map(err => err.msg))
        res.render('register', { title: 'Register', body: req.body, flashes: req.flash() })
        return
    }
    next()
}

exports.register = async(req, res) => {
    const user = new User(req.body)
    const register = promisify(User.register.bind(User))
    await register(user, req.body.password)
    req.flash('success', 'A new User Account has been created')
    res.redirect('back')
}

exports.registerAdmin = async(req, res) => {
    const admin = new Admin(req.body)
    const register = promisify(Admin.register.bind(Admin))
    await register(admin, req.body.password)
    req.flash('success', 'A new Admin Account has been created')
    res.redirect('back')
}

exports.live = (req, res) => {
    res.render('live', { title: 'Live Data' })
}

exports.getBusinesses = async(req, res) => {
    const page = req.params.page || 1
    const limit = 10
    const skip = (page * limit) - limit

    const businessesPromise = Business
        .find()
        .sort({ _id: -1 })
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: 'desc' })

    const totalBusinessesPromise = Business.countDocuments()
    const [businesses, total] = await Promise.all([businessesPromise, totalBusinessesPromise])
    const pages = Math.ceil(total / limit)

    if (!businesses.length && skip) {
        req.flash('info', `Page ${page} does not exist only page ${pages}`)
        res.redirect(`/stores/page/${pages}`)
        return
    }

    res.render('businesses', { title: 'Businesses', businesses, page, pages, total })
}

exports.getBusiness = async(req, res) => {
    const business = await Business.findOne({ _id: req.params.id })
    res.render('business', { title: business.businessName, business })
}