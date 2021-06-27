const mongoose = require('mongoose')
const passportLocalMongoose = require('passport-local-mongoose')
const mongodbErrorHandler = require('mongoose-mongodb-errors')
const slug = require('slug')

const Schema = mongoose.Schema

const adminSchema = new Schema({
    name: {
        type: String,
        required: 'Please supply a name',
        trim: true
    },
    userName: {
        type: String,
        default: 'admin'
    },
    slug: String,
})

adminSchema.pre('save', async function(next) {
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

adminSchema.plugin(passportLocalMongoose, {
    usernameField: 'userName'
})
adminSchema.plugin(mongodbErrorHandler)

module.exports = mongoose.model('Admin', adminSchema)