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

exports.back = (req, res) => {
    res.redirect('back')
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
    let regex = new RegExp(req.query.search)
    const q = {
        state: req.user.state,
        $or: [{
                businessName: { $regex: regex, $options: "gi" }
            },
            { regNumber: { $regex: regex, $options: "gi" } }
        ],
    }
    const business = await Business
        .find(q)
        .limit(100)
        // .sort({
        //     score: { $meta: 'textscore' }
        // })
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

function saveImage(business, fileEncoded) {

    if (fileEncoded == null || undefined) return
    const file = JSON.parse(fileEncoded)
    if (file != null && fileMimeType.includes(file.type)) {
        business.file = new Buffer.from(file.data, 'base64')
        business.fileType = file.type
    }
}

exports.edit = async(req, res) => {
    const fileMimeType = ['application/pdf']
    if (req.body.file == '' || null || undefined) {
        const [proprietors] = [req.body.proprietors]
        const { regNumber, businessName, businessAddress, state, dateOfReg, natureOfBusiness, author } = req.body

        const business = await Business.findOneAndUpdate({ _id: req.params.id }, { regNumber, businessName, businessAddress, state, dateOfReg, natureOfBusiness, proprietors, author }, { new: true, runValidators: true }).exec()

        req.flash('success', `Successfully updated ${business.businessName}`)
        res.redirect(`/${business.state}/business/${business._id}`)
    }
    if (req.body.file !== '' || null || undefined) {
        let file = req.body.file
        let fileType = null
        const fileEncoded = JSON.parse(file)
        if (fileEncoded != null && fileMimeType.includes(fileEncoded.type)) {
            file = new Buffer.from(fileEncoded.data, 'base64')
            fileType = fileEncoded.type
        }

        const { regNumber, businessName, businessAddress, state, dateOfReg, natureOfBusiness, author } = req.body

        const [proprietors] = [req.body.proprietors]

        const business = await Business.findOneAndUpdate({ _id: req.params.id }, { regNumber, businessName, businessAddress, state, dateOfReg, natureOfBusiness, proprietors, author, file, fileType }, { new: true, runValidators: true }).exec()

        req.flash('success', `Successfully updated ${business.businessName}`)
        res.redirect(`/${business.state}/business/${business._id}`)
    }
}