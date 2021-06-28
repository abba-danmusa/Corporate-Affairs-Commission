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
    const businesses = await Business.find({ state: req.params.state })
    res.render('businesses', { title: `Businesses, ${businesses.state } branch`, businesses })
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