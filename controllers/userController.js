const Business = require('../models/business')

exports.loginForm = (req, res) => {
    res.render('login', { title: 'Login' })
}

exports.entryForm = (req, res) => {
    res.render('entryForm', { title: 'New Registration Entry' })
}

exports.saveEntry = async(req, res) => {
    const business = new Business(req.body)
    await business.save()

    req.flash('success', 'Business Details have been saved successfully')
    res.redirect('back')
}