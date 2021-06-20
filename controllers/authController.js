const passport = require('passport')

exports.login = passport.authenticate('local', {
    failureRedirect: '/login',
    failureFlash: 'Invalid user name or password',
    successRedirect: '/',
    successFlash: 'You\'re now logged in'
})

exports.loginAdmin = passport.authenticate('local', {
    failureRedirect: '/admin',
    failureFlash: 'Invalid user name or password',
    successRedirect: '/admin/saved-history',
    successFlash: 'You\'re now logged in'
})

exports.hasSession = (req, res, next) => {
    if (req.user) {
        res.redirect('/')
        return
    }
        next()
}

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
    res.redirect('/login')
}