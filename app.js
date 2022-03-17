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
        cb(null, './public/uploads')
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

    // get the task-flagged user and the serial number
    // const [taskFlaggedUser] = await User.getTaskFlaggedUser()
    // const userSerialNumber = taskFlaggedUser.serialNumber

    // get the next users to be task-flagged
    // let nextTaskFlaggedUser = await User.find({ serialNumber: { $gt: userSerialNumber }, isActive: true })

    // if users exist, get the first active user after the task-flagged user, if not, get the first active user before the task-flagged user
    // nextTaskFlaggedUser.length ? nextTaskFlaggedUser = nextTaskFlaggedUser[0] : [nextTaskFlaggedUser] = await User.find({ serialNumber: { $lt: userSerialNumber }, isActive: true })

    // add some necessary properties to the req.body object
    const [proprietors] = [req.body.proprietors]
    const author = req.user._id
    req.body.proprietors = proprietors
    req.body.author = author
        // req.body.queuedTo = taskFlaggedUser._id

    // save to the database
    const business = new Business(req.body)
    await business.save()

    // find the task-flagged user and update the taskFlag field to false 
    // await User.findOneAndUpdate({ _id: taskFlaggedUser._id }, { taskFlag: false }, { new: true, runValidators: true }).exec()

    // find the task-flagged user and update the taskFlag field to false 
    // await User.findOneAndUpdate({ _id: taskFlaggedUser._id }, { taskFlag: false }, { new: true, runValidators: true }).exec()

    // // if exist, find the next user to be task-flagged and update the taskFlag field to true
    // if (nextTaskFlaggedUser) {
    //     await User.findOneAndUpdate({ _id: nextTaskFlaggedUser._id }, { taskFlag: true }, { new: true, runValidators: true }).exec()
    // }
    // // if doesn't exist, task-flag the previous user
    // else {
    //     await User.findOneAndUpdate({ _id: taskFlaggedUser._id }, { taskFlag: true }, { new: true, runValidators: true }).exec()
    // }

    // emit the saved data
    io.emit('document', [business])

    req.flash('success', 'Sent Successfully')
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

        const { regNumber, businessName, businessAddress, dateOfReg, natureOfBusiness, file } = req.body

        const business = await Business.findOneAndUpdate({ _id: req.params.id }, { regNumber, businessName, businessAddress, dateOfReg, natureOfBusiness, proprietors, file, treated: false }, { new: true, runValidators: true }).exec()

        req.flash('success', `Successfully updated ${business.businessName}`)
        res.redirect(`/${business.state}/business/${business._id}`)
    }
}

// app.use('/admin', adminRoutes)
app.use('/', adminRoutes, userRoutes)
app.post('/', upload, catchErrors(save))
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
    Business.find({ isTreated: false || null })
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