const mongoose = require('mongoose')
const passportLocalMongoose = require('passport-local-mongoose')
const mongodbErrorHandler = require('mongoose-mongodb-errors')
const slug = require('slug')

const Schema = mongoose.Schema

const userSchema = new Schema({
    name: {
        type: String,
        required: 'Please supply a name',
        trim: true
    },
    userName: {
        type: String,
        required: 'Please supply a user name',
        trim: true,
        unique: 'A user with that user name already exist'
    },
    userType: {
        type: String,
        required: true,
        trim: true
    },
    // hasPrivilege: String,
    mustChangePassword: {
        type: Boolean,
        default: true
    },
    state: {
        type: String,
        required: 'You must supply a state',
        trim: true
    },
    isActive: Boolean,
    taskFlag: Boolean,
    serialNumber: {
        type: Number,
        unique: true
    },
    isRegular: Boolean,
    task: Number,
    slug: String,
})

userSchema.pre('save', async function(next) {
    if (!this.isModified('userName')) {
        next()
        return
    }
    if (this.userType !== 'headUser') {
        const users = await this.constructor.find({ userType: { '$in': ['headSupervisor', 'zonalAdmin', 'zonalUser', 'zonalSupervisor'] } }).countDocuments()
        this.serialNumber = users * 5000000
        return next()
    }
    const users = await this.constructor.find({ userType: 'headUser' }).countDocuments()

    if ((this.userType == 'headUser') && (this.isRegular === false)) {
        this.isRegular = false
        this.task = 0
        this.serialNumber = users + 1
        this.isActive = true
        return next()
    }

    this.isActive = true
    this.serialNumber = users + 1
    this.isRegular = true
    if (this.serialNumber == 1) {
        this.taskFlag = true
    } else this.taskFlag = false
        // } else {
        // return next()
        // this.isActive = false
        // this.taskFlag = false
        // this.serialNumber = 0
        // }
        // next()
})

userSchema.statics.getTaskFlaggedUser = function() {
    return this.find({ taskFlag: true, isActive: true })
        // return this.aggregate([
        //     { $match: { userType: 'headUser', isActive: true, taskFlag: true } }
        // ])
}

userSchema.statics.getUser = function() {
    // this.users = await this.find({userType: 'headUser'})
    return this.aggregate([
        { $match: { userType: 'headUser', isActive: true } },
        { $sort: { userName: 1 } }
    ])
}

userSchema.statics.getStates = function() {
    return this.aggregate([
        { $unwind: '$state' },
        { $group: { _id: '$state', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
    ])
}

// userSchema.pre('save', async function(next) {
//     if (this.userType == 'admin' || 'supervisor') {
//         this.hasPrivilege = this.userType
//     } else {
//         this.hasPrivilege = null
//     }
//     next()
// })

userSchema.pre('save', async function(next) {
    if (!this.isModified('name')) {
        next()
        return
    }
    this.slug = slug(this.name)

    const slugRegEx = new RegExp(`^(${this.slug})((-[0-9]*$)?)$`, 'i')

    const nameWithSlug = await this.constructor.find({ slug: slugRegEx })

    if (nameWithSlug.length) {
        this.slug = `${this.slug}-${nameWithSlug.length + 1}`
    }
    next()
})

userSchema.plugin(passportLocalMongoose, {
    usernameField: 'userName'
})

// userSchema.plugin(mongodbErrorHandler)

module.exports = mongoose.model('User', userSchema)