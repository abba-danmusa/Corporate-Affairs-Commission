const User = require("../models/user")
const { promisify } = require('es6-promisify')
const { check, validationResult } = require('express-validator')
const Business = require("../models/business")


exports.passwordProtected = (req, res, next) => {
    res.set('WWW-Authenticate', 'Basic realm="Corporate Affairs Commission"')
    if (req.headers.authorization == 'Basic Y2FjYWRtaW46bG92ZQ==') {
        next()
    } else {
        res.status(401).send('Authentication Required')
    }
}

exports.loginForm = (req, res) => {
    res.render('login', { title: 'Admin Login' })
}

exports.registerForm = (req, res, next) => {
    res.render('register', { title: 'Register New User' })
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
    const user = new User({
        name: req.body.name,
        userName: req.body.userName,
        state: req.body.state
    })
    const register = promisify(User.register.bind(User))
    await register(user, req.body.password)
    req.flash('success', 'A new User Account has been created')
    res.redirect('back')
}

exports.inComingEntries = async(req, res) => {
    res.render('test')
        // const businesses = await Business.find({})
        // res.render('businessLog', { title: 'Dashbord', businesses })
}