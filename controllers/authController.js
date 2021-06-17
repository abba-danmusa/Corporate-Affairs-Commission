const passport = require('passport')

exports.login = passport.authenticate('local', {
    failureRedirect: '/',
    failureFlash: 'Failed login',
    successRedirect: '/new-entry',
    successFlash: 'You\'re now logged in'
})

exports.logout = (req, res) => {
    req.logout()
    req.flash('success', 'You\'re now logged out')
    res.redirect('/')
}

exports.isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        next()
        return
    }
    req.flash('error', 'You must login to Enter any Business Info.')
    res.redirect('/')
}