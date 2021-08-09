const { text } = require('body-parser')
const mongoose = require('mongoose')

const Schema = mongoose.Schema

const businessSchema = new Schema({
    regNumber: {
        type: String,
        trim: true,
        required: 'You must enter a registration number',
        unique: 'Registration Number already exist'
    },
    businessName: {
        type: String,
        trim: true,
        required: 'You must enter a business name',
        unique: 'Business Name already exist'
    },
    businessAddress: {
        type: String,
        trim: true,
        required: 'You must provide an address'
    },
    dateOfReg: {
        type: Date,
        required: 'You must supply the date of registration'
    },
    state: {
        type: String,
        required: 'You must select a state'
    },
    natureOfBusiness: {
        type: String,
        trim: true,
        required: 'You must supply the nature of the business'
    },
    proprietors: [{
        type: String
    }],
    dateEntered: {
        type: Date,
        default: Date.now()
    },
    author: {
        type: String
    },
    file: {
        type: Buffer,
        required: 'You must supply a pdf file'
    },
    fileType: {
        type: String,
        required: 'Only pdf files are allowed'
    },
    slug: String
})

businessSchema.index({
    regNumber: 'text',
    businessName: 'text',
    state: 'text'
})

businessSchema.virtual('fileSrc').get(function() {
    if (this.file != null) {
        return `data:${this.fileType};charset=utf-8;base64,${this.file.toString('base64')}`
    }
})

businessSchema.pre('save', async function(next) {
    if (!this.isModified('name')) {
        next()
        return
    }
    this.slug = slug(this.businessName)

    const slugRegEx = new RegExp(`^(${this.slug})((-[0-9]*$)?)$`, 'i')
    const storeWithSlug = await this.constructor.find({ slug: slugRegEx })
    if (storeWithSlug.length) {
        this.slug = `${this.slug}-${storeWithSlug.length + 1}`
    }

    next()
})

module.exports = mongoose.model('Business', businessSchema)