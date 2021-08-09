const Business = require('../models/business')
const User = require('../models/user')
const multer = require('multer')
const { promisify } = require('es6-promisify')
const { check, validationResult } = require('express-validator')
const business = require('../models/business')

exports.changePasswordForm = (req, res) => {
    res.render('changePassword', { title: 'Change Password' })
}

exports.loginForm = (req, res) => {
    res.render('login', { title: 'Login' })
}

exports.entryForm = (req, res) => {
    res.render('entryForm', { title: 'New Registration Entry' })
}

const multerOptions = {
    storage: multer.memoryStorage(),
    fileFilter(req, file, next) {
        const isPDF = file.mimetype.startsWith('application/pdf')
        if (isPDF) {
            next(null, true)
        } else {
            next({ message: 'That file type isn\'t allowed' }, false)
        }
    }
}

exports.upload = multer(multerOptions).single('photo')

exports.resize = async(req, res, next) => {
    if (!req.file) {
        next()
        return
    }
    // const photo = await jimp.read(req.file.buffer)
    // await photo.resize(800, jimp.AUTO)
    // const extension = req.file.mimetype.split('/')[1]
    // req.body.photo = `${uuid.v4()}.${extension}`
    // await photo.write(`./public/uploads/${req.body.photo}`)
    // next()
}

exports.post = (req, res) => {
    res.json(req.body)
}
exports.view = (req, res) => {
    res.render('post')
}

exports.createUserForm = async(req, res) => {
    res.render('registerForm')
}

exports.createUser = async(req, res) => {
    const user = new User(req.body)
    const register = promisify(User.register.bind(User))
    await register(user, req.body.password)
    req.flash('success', 'A new User Account has been created')
    res.redirect('back')
}

exports.getHistory = async(req, res) => {
    const page = req.params.page || 1
    const limit = 10
    const skip = (page * limit) - limit

    const businessesPromise = await Business
        .find({ state: req.params.state })
        .sort({ _id: -1 })
        .skip(skip)
        .limit(limit)

    const totalBusinessesPromise = Business
        .find({ state: req.params.state })
        .countDocuments()
    const [businesses, total] = await Promise.all([businessesPromise, totalBusinessesPromise])
    const pages = Math.ceil(total / limit)

    if (!businesses.length && skip) {
        req.flash('info', `Page ${page} does not exist only page ${pages}`)
        res.redirect(`/businesses/page/${pages}`)
        return
    }

    res.render('stateBusinesses', { title: `Businesses, ${businesses.state } branch`, businesses, page, pages, total })
}

exports.getBusiness = async(req, res) => {
    const business = await Business.find({ _id: req.params.id })

    res.render('stateBusiness', { business })
}

exports.searchByBusinessName = async(req, res) => {
    const business = await Business.
    find({
        businessName: { $regex: req.query.search, $options: "i" }
    })

    // .sort({
    //     score: { $meta: 'textScore ' }
    // })
    // .limit(5)
    res.json(business)
}

exports.getSearchedData = async(req, res) => {
    const page = req.params.page || 1
    const limit = 10
    const skip = (page * limit) - limit

    const businessesPromise = await Business
        .find({
            state: req.user.state,
            $text: { $search: req.query.search }
        }, {
            score: { $meta: 'textScore' }
        })
        .sort({
            score: { $meta: 'textScore' }
        })

    totalBusinessesPromise = await Business
        .find({
            state: req.user.state,
            $text: { $search: req.query.search }
        })
        .countDocuments()

    const [businesses, total] = await Promise.all([businessesPromise, totalBusinessesPromise])
    const pages = Math.ceil(total / limit)

    if (!businesses.length && skip) {
        req.flash('info', `Page ${page} does not exist only page ${pages}`)
        res.redirect(`/businesses/page/${pages}`)
        return
    }

    res.render('searchedResult', { title: 'Result', businesses, page, pages, searchQuery: req.query.search, total })
}

exports.editForm = async(req, res) => {
    const business = await Business.find({ _id: req.params.id })
    res.render('editForm', { title: `edit ${business.businessName}`, business })
}