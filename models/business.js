const mongoose = require('mongoose')

const Schema = mongoose.Schema

const businessSchema = new Schema({
    regNumber: {
        type: String,
        trim: true,
        required: 'You must enter a registration number',
        unique: true
    },
    businessName: {
        type: String,
        trim: true,
        required: 'You must enter a business name',
        unique: true
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
        type: String,
        required: 'You must atleast supply one proprietor'
    }],
    dateEntered: {
        type: Date,
        default: Date.now()
    },
    author: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    }
})

businessSchema.index({
    regNumber: 'text',
    // businessName: 'text',
    // state: 'text'
})

module.exports = mongoose.model('Business', businessSchema)