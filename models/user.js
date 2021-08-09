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
        trim: true
    },
    userType: {
        type: String,
        required: true,
        trim: true
    },
    hasPrivilege: String,
    mustChangePassword: {
        type: Boolean,
        default: true
    },
    state: {
        type: String,
        required: 'You must supply a state',
        trim: true
    },
    slug: String,
})

userSchema.pre('save', async function(next) {
    if (this.userType == 'administrator') {
        this.hasPrivilege = this.userType
    } else {
        this.hasPrivilege = null
    }
    next()
})

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
userSchema.plugin(mongodbErrorHandler)

module.exports = mongoose.model('User', userSchema)