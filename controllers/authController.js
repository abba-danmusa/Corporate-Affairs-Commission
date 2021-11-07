const passport = require('passport')
const User = require('../models/user')

exports.mustChangePassword = (req, res, next) => {
    if (req.user.mustChangePassword === false) {
        return next()
    } else if (req.user.mustChangePassword === true) {
        req.flash('success', 'Please go ahead and Change your password to continue')
        res.redirect('/change-password')
    }
}

exports.confirmPasswords = (req, res, next) => {
    if (req.body['newPassword'] === req.body['confirmNewPassword'] && req.body['newPassword'] !== req.body['oldPassword']) {
        next()
        return
    }
    req.flash('error', 'Passwords doesn\'t match or is the same with the old password')
    res.redirect('back')
}

exports.resetPassword = async(req, res) => {
    const user = await User.findOne({
        userName: req.body.userName
    })

    if (!user) {
        req.flash('error', 'User Name cannot be found')
        return res.redirect('back')
    }

    await user.setPassword(req.body.newPassword)
    user.mustChangePassword = false
    const updatedUser = await user.save()
    await req.login(updatedUser)
    req.flash('success', `${user.userName}'s password has been reset successfully`)
    res.redirect('/registered-users')
}

exports.adminResetPassword = async(req, res) => {
    const user = await User.findOne({
        userName: req.body.userName
    })

    if (!user) {
        req.flash('error', 'User Name cannot be found')
        return res.redirect('back')
    }

    await user.setPassword(req.body.newPassword)
    user.mustChangePassword = false
    const updatedUser = await user.save()
    await req.login(updatedUser)
    req.flash('success', `${user.userName}'s password has been reset successfully`)
    res.redirect('/admin/registered-users')
}

exports.changePassword = async(req, res) => {
    const user = await User.findOne({
        userName: req.body.userName
    })

    if (!user) {
        req.flash('error', 'User Name cannot be found')
        return res.redirect('back')
    }

    await user.setPassword(req.body.newPassword)
    user.mustChangePassword = false
    const updatedUser = await user.save()
    await req.login(updatedUser)
    req.flash('success', 'Your password has been changed successfully and you\'re now logged in')
    res.redirect('/')
}

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
    req.flash('info', 'You must login to Enter any Business Info.')
    res.redirect('/login')
}