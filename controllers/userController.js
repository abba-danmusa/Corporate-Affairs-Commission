const Business = require("../models/business")
const User = require("../models/user")

exports.loginForm = (req, res) => {
    res.render('login', { title: 'Login' })
}

exports.entryForm = (req, res) => {
    res.render('entryForm', { title: 'New Registration Entry' })
}

exports.saveEntry = async(req, res) => {
    const business = new Business({
        regNumber: req.body.regNumber,
        businessName: req.body.businessName,
        dateOfReg: req.body.dateOfReg,
        state: req.body.state,
        natureOfBusiness: req.body.natureOfBusiness,
        proprietors: [req.body.proprietor1, req.body.proprietor2, req.body.proprietor3]
    })
    await business.save()
    req.flash('success', 'Business Details have been saved successfully')
    res.redirect('back')
}