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
const { saveEntry } = require('./controllers/userController')
const Business = mongoose.model('Business')
require('./handlers/passport')

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

app.use('/', userRoutes, adminRoutes)

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

io.use(function(socket, next) {
    sessionOptions(socket.request, socket.request.res, next)
})

io.on('connection', function(socket) {

    console.log(socket.request.session)

    if (socket.request.session.passport.user) {
        console.log('connected')

        let user = socket.request.session.passport.user
        console.log(user)

        // Creats a function to send staus
        sendStatus = function(s) {
            socket.emit('status', s)
        }

        socket.emit('welcome', { userName: user })
        if (user == 'abba-danmusa') {
            socket.join('admin')
        }

        Business.find({}).sort({ _id: 1 }).then(data => {
            socket.emit('output', data)

        }).catch(err => {
            throw err
        })

        socket.on('input', data => {
            console.log(data)
            let business = new Business(data)
            business.save().then(() => {
                socket.to('admin').emit('document', [data])

                // Send status object
                // sendStatus({
                //     message: 'Details saved successfully',
                //     clear: true
                // })
            }).catch(err => {
                console.log(err)
                    // socket.emit('error', err)
            })
        })
    }
})




module.exports = server