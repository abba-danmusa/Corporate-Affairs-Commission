const express = require('express')
const session = require('express-session')
const mongoose = require('mongoose')
const MongoStore = require('connect-mongo')
const path = require('path')
const passport = require('passport')
const { promisify } = require('es6-promisify')
const flash = require('connect-flash')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const userRoutes = require('./routes/index')
const adminRoutes = require('./routes/admin')
const helpers = require('./helpers')
const errorHandlers = require('./handlers/errorHandlers')
const { catchErrors } = require('./handlers/errorHandlers')
const Business = mongoose.model('Business')
const User = mongoose.model('User')
require('./handlers/passport')
const multer = require('multer')
const jimp = require('jimp')
const uuid = require('uuid')
const fs = require('fs')
const Day = require('./models/date')
const authController = require('./controllers/authController')


// create express app 
const app = express()

// view engine setup
app.use(express.static('public'))
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

// Takes the raw requests and turns them into usable properties on req.body
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// populates req.cookies with any cookies that came along with the request
app.use(cookieParser())


// Sessions allow us to store data on visitors from request to request
// This keeps users logged in and allows us to send flash messages
let sessionOptions = session({
    store: new MongoStore({ mongoUrl: process.env.DATABASE }),
    secret: process.env.SECRET,
    key: process.env.KEY,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24, httpOnly: true }
})

app.use(sessionOptions)

// Passport JS is what we use to handle our logins
app.use(passport.initialize())
app.use(passport.session())

// use flash to pass message to the next page the user request
app.use(flash())

// pass variables to all of the templates and all request
app.use((req, res, next) => {
    res.locals.h = helpers
    res.locals.flashes = req.flash()
    res.locals.user = req.user || null
    res.locals.currentPath = req.path
    next()
})

// promisify some callback based APIs
app.use((req, res, next) => {
    req.login = promisify(req.login, req)
    next()
})

const multerOptions = multer.diskStorage({
    destination: function(req, file, cb) {

        fs.mkdirSync(`./public/uploads/${req.body.regNumber}`, { recursive: true }, (err) => { if (err) throw (err) })

        // save the file to this dir 
        cb(null, `./public/uploads/${req.body.regNumber}`)
    },
    filename: function(req, file, cb) {
        const extension = file.mimetype.split('/')[1]
        req.body.file = `${uuid.v4()}.${extension}`
        cb(null, req.body.file)
    },
    fileFilter(req, file, next) {
        const isPDF = file.mimetype.startsWith('application/pdf')
        if (isPDF) {
            next(null, true)
        } else {
            next({ message: 'That file type isn\'t allowed' }, false)
        }
    }
})

const upload = multer({ storage: multerOptions }).single('file')

const save = async(req, res) => {

    try {

        // get the flagged user
        const flaggedUser = await User.findOne({ userType: 'headUser', taskFlag: true })
            // console.log(flaggedUser)

        const serialNum = flaggedUser.serialNumber // get the flagged user's serial number

        // get the next user to be task flagged
      let nextUser = await User.findOne({
        userType: 'headUser',
        isActive: true,
        $or: [
          { serialNumber: { $gt: serialNum } },
          { serialNumber: { $lt: serialNum } }
        ],
        $or: [{ task: { $lt: 5 } }, { task: null }]
      })

        // if no next user, get the first user
        // !nextUser ? [nextUser] = await User.find({ userType: 'headUser', isActive: true, serialNumber: { $lt: serialNum }, $or: [{ task: { $lt: 5 } }, { task: null }] }) : null

        // if next user does not exist at all; only one user exist, flagged user is next user
            !nextUser ? nextUser = flaggedUser : null

        const todaysDate = new Date() // get today's date
        const [getDate] = await Day.find({}) // get the last saved date

        // if today's date does not equal saved date
        if ((getDate) && (todaysDate.getDate() !== getDate.date.getDate())) {

            // update the date
            await Day.findOneAndUpdate({ _id: getDate._id }, { date: new Date() }, { runValidators: true, new: true })

            // reset all the user's tasks number to 0
            await User.updateMany({ isRegular: false }, { task: 0 }, { runValidators: true, new: true })
        }
        // no saved date
        if (!getDate) {
            // save a date for the first time into the database
            await new Day({ date: todaysDate }).save()
        }

        // add some necessary properties to the req.body object
        const [proprietors] = [req.body.proprietors]
        const author = req.user._id
        const fileDir = `/uploads/${req.body.regNumber}/${req.body.file}`
        req.body.proprietors = proprietors
        req.body.author = author
        req.body.queuedTo = flaggedUser._id // assign the task to the flagged user
        req.body.fileDir = fileDir

        // save the business to the database
        const business = new Business(req.body)
        business.save()

        // unflag the flagged user
        if (flaggedUser.isRegular) {
            // if user is regular
            await User.findOneAndUpdate({ _id: flaggedUser._id }, { taskFlag: false }, { runValidators: true, new: true }).exec()
        } else {
            // if user is non regular
            await User.findOneAndUpdate({ _id: flaggedUser._id }, { task: flaggedUser.task + 1, taskFlag: false }, { runValidators: true, new: true }).exec()
        }

        // flag the next user
        await User.findOneAndUpdate({ _id: nextUser._id }, { taskFlag: true }, { runValidators: true, new: true })

        // send to the flagged user's task queue
        io.emit('document', [business])

        req.flash('success', 'Sent Successfully')
        res.redirect('back')

    } catch (error) {

        if (error.keyValue) {
            const [duplicateValue] = Object.values(error.keyValue)
            req.flash('error', `<strong>${duplicateValue}</strong> already exist. Please cross check and try again`)
        } else {
            req.flash('error', 'Something went wrong. Please try again')
        }
        res.redirect('back')
    }
}

const error = async(req, res) => {
    req.flash('error', 'Something went wrong, Please try again')
    res.redirect('back')
}

const edit = async(req, res) => {
    if (req.body.file == '' || null || undefined) {

        const [proprietors] = [req.body.proprietors]

        const { regNumber, businessName, businessAddress, dateOfReg, natureOfBusiness } = req.body

        const business = await Business.findOneAndUpdate({ _id: req.params.id }, { regNumber, businessName, businessAddress, dateOfReg, natureOfBusiness, proprietors, treated: false }, { new: true }).exec()

        req.flash('success', `Successfully updated ${business.businessName}`)
        res.redirect(`/${business.state}/business/${business._id}`)
    }
    if (req.body.file !== '' || null || undefined) {

        const [proprietors] = [req.body.proprietors]
        const dir = `/uploads/${req.body.regNumber}/${req.body.file}`
        req.body.fileDir = dir

        const { regNumber, businessName, businessAddress, dateOfReg, natureOfBusiness, file, fileDir } = req.body

        const business = await Business.findOneAndUpdate({ _id: req.params.id }, { regNumber, businessName, businessAddress, dateOfReg, natureOfBusiness, proprietors, file, fileDir, treated: false }, { new: true, runValidators: true }).exec()

        req.flash('success', `Successfully updated ${business.businessName}`)
        res.redirect(`/${business.state}/business/${business._id}`)
    }
}

const assignTask = async(req, flaggedUser, nextUser) => {

    const todaysDate = new Date() // get today's date
    const [getDate] = await Day.find({}) // get the last saved date

    let feedback

    // if today's date does not equal saved date
    if ((getDate) && (todaysDate.getDate() !== getDate.date.getDate())) {

        // update the date
        await Day.findOneAndUpdate({ _id: getDate._id }, { date: new Date() }, { runValidators: true, new: true })

        // reset all the user's tasks number to 0
        await User.updateMany({ isRegular: false }, { task: 0 }, { runValidators: true, new: true })
    }
    // no saved date
    if (!getDate) {
        // save a date for the first time into the database
        await new Day({ date: todaysDate }).save()
    }

    // if flagged user is none regular
    if (flaggedUser.isRegular === false) {

        // and flagged user's task is less than 5
        if (flaggedUser.task < 5) {

            // add some necessary properties to the req.body object
            const [proprietors] = [req.body.proprietors]
            const author = req.user._id
            const fileDir = `/uploads/${req.body.regNumber}/${req.body.file}`
            req.body.proprietors = proprietors
            req.body.author = author
            req.body.queuedTo = flaggedUser._id // assign the task to the flagged user
            req.body.fileDir = fileDir

            // save the business to the database
            const business = new Business(req.body)
            await business.save()

            // unflag the flagged user
            await User.findOneAndUpdate({ _id: flaggedUser._id }, { task: flaggedUser.task + 1, taskFlag: false }, { runValidators: true, new: true })

            // flag the next user
            await User.findOneAndUpdate({ _id: nextUser._id }, { taskFlag: true }, { runValidators: true, new: true })

            // send to the flagged user's task queue
            io.emit('document', [business])

            // send feedback successful since a user has been assigned to the task
            feedback = 'successful'

            // if the task number is greater than 5
        } else {

            // unflag the flagged user
            await User.findOneAndUpdate({ _id: flaggedUser._id }, { taskFlag: false }, { runValidators: true, new: true })

            // flag the next user
            await User.findOneAndUpdate({ _id: nextUser._id }, { taskFlag: true }, { runValidators: true, new: true })

            // send feedback unsuccessful since no user has been assigned to the task
            feedback = 'unsuccessful'
        }

        // user is regular
    }
    if (flaggedUser.isRegular) {

        // add some necessary properties to the req.body object
        const [proprietors] = [req.body.proprietors]
        const author = req.user._id
        const fileDir = `/uploads/${req.body.regNumber}/${req.body.file}`
        req.body.proprietors = proprietors
        req.body.author = author
        req.body.queuedTo = flaggedUser._id // assign the task to the flagged user
        req.body.fileDir = fileDir

        // save the business to the database
        const business = new Business(req.body)
        await business.save()

        // unflag the flagged user
        await User.findOneAndUpdate({ _id: flaggedUser._id }, { taskFlag: false }, { runValidators: true, new: true })

        // flag the next user
        await User.findOneAndUpdate({ _id: nextUser._id }, { taskFlag: true }, { runValidators: true, new: true })

        // send to the flagged user's task queue
        io.emit('document', [business])

        // send feedback successful since a user has been assigned to the task
        feedback = 'successful'
    }
    return feedback
}

const shareTaskQueue = async(req, res) => {

    try {

        // get all the businesses that are assigned to the user and are untreated
        const usersTaskQueue = await Business.find({ queuedTo: req.params.id, isTreated: false }).limit(parseInt(req.body.number))

        // deactivate user so that user gets none
        await User.findOneAndUpdate({ _id: req.params.id }, { isActive: false }, { runValidators: true, new: true })

        // if share to users is not 'all'
        const shareUsers = typeof(req.body.shareTo) == 'string' ? [req.body.shareTo] : req.body.shareTo

        let shareUsersIndex = 0

        if (shareUsers.length && shareUsers[0] !== 'all') {
            for (let i = 0; i < usersTaskQueue.length; i++) {
                await Business.findOneAndUpdate({ _id: usersTaskQueue[i]._id }, { queuedTo: shareUsers[shareUsersIndex], dateShared: Date.now() }, { runValidators: true, new: true })
                shareUsersIndex++
                shareUsersIndex >= shareUsers.length ? shareUsersIndex = 0 : null
            }
        } else {

            // loop through all the user's task queue and reassign to others
            for (let i = 0; i < usersTaskQueue.length; i++) {

                let feedback = ''

                while (feedback !== 'successful') {

                    // get the flagged user
                    const [flaggedUser] = await User.find({ userType: 'headUser', taskFlag: true })

                    const serialNum = flaggedUser.serialNumber // get the flagged user's serial number

                    // get the next user to be task flagged 
                    let [nextUser] = await User.find({ userType: 'headUser', isActive: true, serialNumber: { $gt: serialNum } })

                    // update nextUser if user does not exist
                    !nextUser ? [nextUser] = await User.find({ userType: 'headUser', isActive: true, serialNumber: { $lt: serialNum } }) : null

                    // if next user does not exist at all; only one user exist, flagged user is next user
                        !nextUser ? nextUser = flaggedUser : null

                    // update the feedback value
                    feedback = await reAssignTask(flaggedUser, nextUser, usersTaskQueue[i])
                }

            }

        }


        // reactivate the user
        await User.findOneAndUpdate({ _id: req.params.id }, { isActive: true }, { runValidators: true, new: true })

        req.flash('success', 'Successfully distributed to other users')
        res.redirect('back')

    } catch (err) {

        req.flash('error', 'Oops! Something went wrong. Please try again later')
        res.redirect('back')
    }

}

const reAssignTask = async(flaggedUser, nextUser, business) => {

    const todaysDate = new Date() // get today's date
    const [getDate] = await Day.find({}) // get the last saved date

    let feedback

    // if today's date does not equal saved date
    if ((getDate) && (todaysDate.getDate() !== getDate.date.getDate())) {

        // update the date
        await Day.findOneAndUpdate({ _id: getDate._id }, { date: new Date() }, { runValidators: true, new: true })

        // reset all the user's tasks number to 0
        await User.updateMany({ isRegular: false }, { task: 0 }, { runValidators: true, new: true })
    }
    // no saved date
    if (!getDate) {
        // save a date for the first time into the database
        await new Day({ date: todaysDate }).save()
    }

    // if flagged user is none regular
    if (flaggedUser.isRegular === false) {

        // and flagged user's task is less than 5
        if (flaggedUser.task < 5) {

            // find the business and update the queued field
            await Business.findOneAndUpdate({ _id: business._id }, { queuedTo: flaggedUser._id, dateShared: Date.now() }, { runValidators: true, new: true })

            // unflag the flagged user
            await User.findOneAndUpdate({ _id: flaggedUser._id }, { task: flaggedUser.task + 1, taskFlag: false }, { runValidators: true, new: true })

            // flag the next user
            await User.findOneAndUpdate({ _id: nextUser._id }, { taskFlag: true }, { runValidators: true, new: true })

            // send to the flagged user's task queue
            io.emit('document', [business])

            // send feedback successful since a user has been assigned to the task
            feedback = 'successful'

            // if the task number is greater than 5
        } else {

            // unflag the flagged user
            await User.findOneAndUpdate({ _id: flaggedUser._id }, { taskFlag: false }, { runValidators: true, new: true })

            // flag the next user
            await User.findOneAndUpdate({ _id: nextUser._id }, { taskFlag: true }, { runValidators: true, new: true })

            // send feedback unsuccessful since no user has been assigned to the task
            feedback = 'unsuccessful'
        }

        // user is regular
    }
    if (flaggedUser.isRegular) {

        // find the business and update the queued field
        await Business.findOneAndUpdate({ _id: business._id }, { queuedTo: flaggedUser._id, dateShared: Date.now() }, { runValidators: true, new: true })

        // unflag the flagged user
        await User.findOneAndUpdate({ _id: flaggedUser._id }, { taskFlag: false }, { runValidators: true, new: true })

        // flag the next user
        await User.findOneAndUpdate({ _id: nextUser._id }, { taskFlag: true }, { runValidators: true, new: true })

        // send to the flagged user's task queue
        io.emit('document', [business])

        // send feedback successful since a user has been assigned to the task
        feedback = 'successful'
    }
    return feedback
}

// app.use('/admin', adminRoutes)
// app.use(authController.isPaid)
app.use(authController.isPaid, adminRoutes, userRoutes)
app.post('/', upload, catchErrors(save))
app.post('/share/user/:user/:id', authController.isLoggedIn, catchErrors(shareTaskQueue))
app.post('/edit/:id', upload, catchErrors(edit))

// if that above routes didnt work, 404 them and forward to error handler
app.use(errorHandlers.notFound)

// one of the error handlers will see if these errors are just validation errors
app.use(errorHandlers.flashValidationErrors)

// otherwise 
if (app.get('env') === 'development') {
    /* Development Error Handler - Prints stack trace */
    app.use(errorHandlers.developmentErrors)
}

// production error handler
app.use(errorHandlers.productionErrors)

const server = require('http').createServer(app)
const io = require('socket.io')(server)

const fileMimeType = ['application/pdf']

function saveImage(business, fileEncoded) {

    if (fileEncoded == null || undefined) return
    const file = JSON.parse(fileEncoded)
    if (file != null && fileMimeType.includes(file.type)) {
        business.file = new Buffer.from(file.data, 'base64')
        business.fileType = file.type
    }
}

io.use(function(socket, next) {
    sessionOptions(socket.request, socket.request.res, next)
})

// io.use((socket, next) => {
//     if (socket.request.user) {
//         next()
//     } else {
//         next(new Error(unauthorized))
//     }
// })

io.on('connection', async function(socket) {
    Business.find({ dateEntered: { $gt: new Date(Date.now() - 24 * 60 * 60 * 1000) } })
        .sort({ _id: -1 })
        .limit(50)
        .then(data => {
            socket.emit('output', data)

        }).catch(err => {
            socket.emit('error', err)
        })

    if (socket.request.session.passport) {
        let userName = socket.request.session.passport.user
        let [userID] = await User.find({ userName })

        socket.emit('welcome', { user: socket.id })
        if (userID) {

        }

    }

    // Creates a function to send staus
    sendStatus = function(s) {
        socket.emit('status', s)
    }


    socket.on('input', data => {

        // data.file = JSON.parse(data.file)
        // data.file = new Buffer.from(data.file, 'base64')

        // console.log(data.file)

        let business = new Business(data)
            // saveImage(business, data.file)

        business.save()
            .then(() => {
                io.emit('document', [data])
            })
            .then(() => {
                // Sends a success message
                io.emit('success', 'Details Saved Successfully')
            })
            .catch(errors => {
                // Sends an error message
                io.emit('error', errors)
            })
    })
})

module.exports = server