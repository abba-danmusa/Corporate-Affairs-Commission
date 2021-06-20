const Business = require('../models/business')
const User = require('../models/user')

exports.loginForm = (req, res) => {
    res.render('login', { title: 'Login' })
}

exports.entryForm = (req, res) => {
    res.render('entryForm', { title: 'New Registration Entry' })
}

exports.saveEntry = async(req, res) => {
    // const business = 
    const business = new Business(req.body)
    await business.save()

    req.flash('success', 'Business Details have been saved successfully')
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
    const business = await Business.find({_id:req.params.id})
    
    res.render('stateBusiness', { business})
}

exports.searchByBusinessName = async(req, res) => {
    const business = await Business.
    find({
            $text: { $search: req.query.q }
        }, {
            score: { $meta: 'textScore' }
        })
        .sort({
            score: { $meta: 'textScore' }
        })
        .limit(5)
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

    res.render('searchedResult', { title: 'Result', businesses, page, pages, total })
}