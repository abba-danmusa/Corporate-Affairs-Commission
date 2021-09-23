const Business = require('../models/business')
const User = require('../models/user')
const { promisify } = require('es6-promisify')

exports.changePasswordForm = (req, res) => {
    res.render('changePassword', { title: 'Change Password' })
}

exports.loginForm = (req, res) => {
    res.render('login', { title: 'Login' })
}

exports.back = (req, res) => {
    res.redirect('back')
}

exports.entryForm = async(req, res) => {

    if (req.user.userType == 'headAdmin') {

        const users = await User.find({ userType: 'headUser' })
        res.render('headAdmin', { title: 'Admin', users })

    } else if (req.user.userType == 'zonalAdmin') {

        const users = await User.find({ userType: 'zonalUser' })
        res.send('hello world')

    } else if (req.user.userType == 'headUser') {

        const page = req.params.page || 1
        const limit = 10
        const skip = (page * limit) - limit

        const businessesPromise = await Business
            .find({ queuedTo: req.user._id })
            .sort({ _id: -1 })
            .skip(skip)
            .limit(limit)

        const totalBusinessesPromise = Business
            .find({ queuedTo: req.user._id })
            .countDocuments()

        const [businesses, total] = await Promise.all([businessesPromise, totalBusinessesPromise])

        const pages = Math.ceil(total / limit)

        if (!businesses.length && skip) {
            req.flash('info', `Page ${page} does not exist only page ${pages}`)
            res.redirect(`/businesses/page/${pages}`)
            return
        }

        const userPendingTasks = Business.getPendingTasks(req.user._id)
        const userTreatedTasks = Business.getTreatedTasks(req.user._id)
        const [pendingTasks, treatedTasks] = await Promise.all([userPendingTasks, userTreatedTasks])

        res.render('taskQueue', { title: 'Home', businesses, page, pages, total, pendingTasks, treatedTasks })

    } else if (req.user.userType == 'zonalUser') {

        res.render('entryForm', { title: 'New Registration Entry' })

    } else if (req.user.userType == 'headSupervisor') {

        const todayTreatsPromise = Business.getTreatedToday()
        const pendingsTodayPromise = Business.getPendingsToday()
        const totalTodayPromise = Business.getTotalDailySent()

        const usersPromise = User.find({ userType: 'headUser' })

        const [todayTreats, totalReceived, users, pendingsToday] = await Promise.all([todayTreatsPromise, totalTodayPromise, usersPromise, pendingsTodayPromise])

        res.render('supervisor', { title: 'Home', users, totalReceived, todayTreats, pendingsToday })

    } else if (req.user.userType == 'zonalSupervisor') {

        // get all the users registered in the same state as the supervisor
        const usersPromise = User.find({ userType: 'zonalUser', state: req.user.state })

        // get the total of data sent by each of the users
        const businessesPromise = Business.getTotalSentByEachAuthor()

        // get the total sent in 24 hours
        const dailyPromise = Business.getTotalDailySent()

        // destructure the resolved promise
        const [users, businesses, daily] = await Promise.all([usersPromise, businessesPromise, dailyPromise])

        res.render('stateSupervisor', { title: 'Home', users, businesses, daily })

    }
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

exports.getAllStateHistory = async(req, res) => {
    const page = req.params.page || 1
    const limit = 10
    const skip = (page * limit) - limit

    const businessesPromise = await Business
        .find({})
        .sort({ _id: -1 })
        .skip(skip)
        .limit(limit)

    const totalBusinessesPromise = Business
        .find({})
        .countDocuments()

    const [businesses, total] = await Promise.all([businessesPromise, totalBusinessesPromise])

    const pages = Math.ceil(total / limit)

    if (!businesses.length && skip) {
        req.flash('info', `Page ${page} does not exist only page ${pages}`)
        res.redirect(`/businesses/page/${pages}`)
        return
    }

    res.render('TotalStateBusinesses', { title: `Businesses, ${businesses.state } branch`, businesses, page, pages, total })
}

exports.getHistory = async(req, res) => {
    const page = req.params.page || 1
    const limit = 10
    const skip = (page * limit) - limit

    const businessesPromise = await Business
        .find({ author: req.user })
        .sort({ _id: -1 })
        .skip(skip)
        .limit(limit)

    const totalBusinessesPromise = Business
        .find({ author: req.user })
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

    // console.log(req.query.search)
    let regex = new RegExp(req.query.search)
    const q = {
        author: req.user,
        $or: [
            { businessName: { $regex: regex, $options: "gi" } },
            { regNumber: { $regex: regex, $options: "gi" } }
        ]
    }
    const business = await Business
        .find(q)
        // .sort({
        //     score: { $meta: 'textscore' }
        // })
        .limit(100)

    res.json(business)
}

exports.searchByState = async(req, res) => {

    // console.log(req.query.search)
    let regex = new RegExp(req.query.search)
    const q = {
        state: req.user.state,
        $or: [
            { businessName: { $regex: regex, $options: "gi" } },
            { regNumber: { $regex: regex, $options: "gi" } }
        ]
    }
    const business = await Business
        .find(q)
        // .sort({
        //     score: { $meta: 'textscore' }
        // })
        .limit(100)

    res.json(business)
}

exports.getSearchedData = async(req, res) => {
    const page = req.params.page || 1
    const limit = 10
    const skip = (page * limit) - limit

    const businessesPromise = Business
        .find({
            state: req.user.state,
            $text: { $search: req.query.search }
        }, {
            score: { $meta: 'textScore' }
        })
        .sort({
            score: { $meta: 'textScore' }
        })

    totalBusinessesPromise = Business
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
        const author = req.user._id
        const { regNumber, businessName, businessAddress, state, dateOfReg, natureOfBusiness } = req.body

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

        const { regNumber, businessName, businessAddress, state, dateOfReg, natureOfBusiness } = req.body

        const [proprietors] = [req.body.proprietors]
        const author = req.user._id

        const business = await Business.findOneAndUpdate({ _id: req.params.id }, { regNumber, businessName, businessAddress, state, dateOfReg, natureOfBusiness, proprietors, author, file, fileType }, { new: true, runValidators: true }).exec()

        req.flash('success', `Successfully updated ${business.businessName}`)
        res.redirect(`/${business.state}/business/${business._id}`)
    }
}

exports.superviseUser = async(req, res) => {

    const userPromise = User.find({ _id: req.params.id })

    const userTotalTasks = Business.getUserTotalTasks(req.params.id)
    const userPendingTasks = Business.getPendingTasks(req.params.id)
    const userTreatedTasks = Business.getTreatedTasks(req.params.id)
    const [
        [user], totalTasks, pendingTasks, treatedTasks
    ] = await Promise.all([userPromise, userTotalTasks, userPendingTasks, userTreatedTasks])

    res.render('user', { title: req.params.user, user, totalTasks, pendingTasks, treatedTasks })
}

exports.deactivateUser = async(req, res) => {

    // deactivate the user
    await User.findOneAndUpdate({ _id: req.params.id }, { isActive: false }, { runValidators: true, new: true }).exec()

    const [user] = await User.find({ _id: req.params.id })

    // find the next users
    let nextUser = await User.find({ userType: 'headUser', isActive: true })

    // if no other users, null the current user else take the first user
    nextUser.length < 1 ? nextUser = null : [nextUser] = nextUser

    // if users and the initial user is task-flagged, task-flag next user and deactivate the initial user
    if (user.taskFlag === true && nextUser !== null) {

        // untask-flag user
        await User.findOneAndUpdate({ _id: req.params.id }, { taskFlag: false }, { runValidators: true, new: true }).exec()

        // task-flag next user
        const serialNumber = nextUser.serialNumber
        await User.findOneAndUpdate({ serialNumber: serialNumber, isActive: true }, { taskFlag: true }, { runValidators: true, new: true }).exec()

        req.flash('success', 'The User has been deactivated successfully')
        res.redirect('back')
    }
    // if user is not task-flagged and next user is not null
    else if (user.taskFlag === false && nextUser !== null) {
        // just task-flag the next user
        const serialNumber = nextUser.serialNumber
        await User.findOneAndUpdate({ serialNumber: serialNumber, isActive: true }, { taskFlag: true }, { runValidators: true, new: true }).exec()

        req.flash('success', 'The User has been deactivated successfully')
        res.redirect('back')

    } else {

        // reactivates the user since no other users
        await User.findOneAndUpdate({ _id: req.params.id }, { isActive: true }, { runValidators: true, new: true }).exec()

        req.flash('info', 'This is the last active user; cannot be deactivated')
        res.redirect('back')
    }

}

exports.activateUser = async(req, res) => {

    await User.findOneAndUpdate({ _id: req.params.id }, { isActive: true }, { runValidators: true, new: true }).exec()

    req.flash('success', 'The User has been activated successfully')
    res.redirect('back')
}

exports.shareTaskQueue = async(req, res) => {

    // get all the businesses that are assigned to the user and are untreated
    const usersTaskQueuePromise = Business.find({ queuedTo: req.params.id, treated: false })

    // get the user
    const userPromise = User.find({ _id: req.params.id })

    // destructure the resolved promise array
    const [
        [user], usersTaskQueue
    ] = await Promise.all([userPromise, usersTaskQueuePromise])

    if (user.isActive == true) {
        req.flash('info', 'Please deactivate the user to share his/her task queue')
        res.redirect('back')
        return
    }

    // loop through all the user's task queue and reassign to others
    for (let i = 0; i < usersTaskQueue.length; i++) {

        // get the task-flagged user and the serial number
        const [taskFlaggedUser] = await User.getTaskFlaggedUser()
        const userSerialNumber = taskFlaggedUser.serialNumber

        // get the next users to be task-flagged
        let nextTaskFlaggedUser = await User.find({ serialNumber: { $gt: userSerialNumber }, isActive: true })

        // if users exist, get the first active user after the task-flagged user, if not, get the first active user before the task-flagged user
        nextTaskFlaggedUser.length ? nextTaskFlaggedUser = nextTaskFlaggedUser[0] : [nextTaskFlaggedUser] = await User.find({ serialNumber: { $lt: userSerialNumber }, isActive: true })

        // reassign the task to the task-flagged user
        await Business.findOneAndUpdate({ _id: usersTaskQueue[i]._id }, { queuedTo: taskFlaggedUser._id }, { runValidators: true, new: true }).exec()

        // find the task-flagged user and update the taskFlag field to false 
        await User.findOneAndUpdate({ _id: taskFlaggedUser._id }, { taskFlag: false }, { new: true, runValidators: true }).exec()

        // if exist, find the next user to be task-flagged and update the taskFlag field to true
        if (nextTaskFlaggedUser) {
            await User.findOneAndUpdate({ _id: nextTaskFlaggedUser._id }, { taskFlag: true }, { new: true, runValidators: true }).exec()
        }
        // if doesn't exist, task-flag the previous user
        else {
            await User.findOneAndUpdate({ _id: taskFlaggedUser._id }, { taskFlag: true }, { new: true, runValidators: true }).exec()
        }
    }

    req.flash('success', 'Successfully distributed to other users')
    res.redirect('back')
}

exports.userTasks = async(req, res) => {

    const page = req.params.page || 1
    const limit = 10
    const skip = (page * limit) - limit

    const userTasks = await Business
        .find({ queuedTo: req.params.id })
        .sort({ _id: 1 })
        .skip(skip)
        .limit(limit)

    // const businessesPromise = await Business
    //     .find({ state: req.params.state })
    //     .sort({ _id: -1 })
    //     .skip(skip)
    //     .limit(limit)

    const totalUserTasksPromise = Business
        .find({ state: req.params.state })
        .countDocuments()

    const [userTask, total] = await Promise.all([userTasks, totalUserTasksPromise])
    const pages = Math.ceil(total / limit)

    if (!userTask.length && skip) {
        req.flash('info', `Page ${page} does not exist only page ${pages}`)
        res.redirect(`/tasks/${pages}`)
        return
    }

    res.render('tasks', { title: 'User Tasks', userTask, page, pages, total })
}

exports.getStats = async(req, res) => {
    if (req.user.userType == 'headSupervisor') {

        const businessesPromise = Business.find({})
        const usersPromise = User.find({ userType: 'headUser' })
        const [businesses, users] = await Promise.all([businessesPromise, usersPromise])
        res.render('stats', { title: 'Stats', businesses, users })

    } else if (req.user.userType == 'zonalSupervisor') {

        const businessesPromise = Business.getTotalSentByEachState()
        const dailySentsPromise = Business.getTotalDailySent()

        const [dailySents, businesses] = await Promise.all([dailySentsPromise, businessesPromise])

        res.render('stats', { title: 'Stats', businesses, dailySents })

    } else {
        req.flash('info', 'You are not privileged to view that page')
        res.redirect('back')
    }
}

exports.viewUser = async(req, res) => {
    const stateUserPromise = User.find({ _id: req.params.id })
    const authoredByUserPromise = Business.getAuthor(req.params.id)
    const [stateUser, authoredByUser] = await Promise.all([stateUserPromise, authoredByUserPromise])
    res.render('viewUser', { title: `${stateUser.userName}`, stateUser, authoredByUser })
}

exports.acknowledge = async(req, res) => {

    if (req.user.userType != 'headUser') {
        req.flash('info', 'Your are not allowed to Acknowledge any business')
        res.redirect('back')
        return
    }
    await Business.findOneAndUpdate({ _id: req.params.id }, { treated: true, dateTreated: Date.now() }, { runValidators: true, new: true })
    req.flash('success', 'Acknowledged Successfully')
    res.redirect('back')
}

exports.getBusinesses = async(req, res) => {
    if (req.user.userType == 'headSupervisor' || 'headUser') {
        const page = req.params.page || 1
        const limit = 10
        const skip = (page * limit) - limit

        const businessesPromise = Business
            .find()
            .sort({ _id: -1 })
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: 'desc' })

        const totalBusinessesPromise = Business.countDocuments()
        const [businesses, total] = await Promise.all([businessesPromise, totalBusinessesPromise])
        const pages = Math.ceil(total / limit)

        if (!businesses.length && skip) {
            req.flash('info', `Page ${page} does not exist only page ${pages}`)
            res.redirect(`/stores/page/${pages}`)
            return
        }

        // res.render('businesses', { title: 'Businesses', businesses, page, pages, total })

        res.render('allBusinesses', { title: `Businesses`, businesses, page, pages, total })
    }
}

exports.headRegister = (req, res) => {
    res.render('headAdminRegisterForm', { title: 'Register' })
}