const mongoose = require('mongoose')
mongoose.Promise = global.Promise

const taskSchema = new mongoose.Schema({
    dateSent: {
        type: Date,
        default: Date.now()
    },
    queuedTo: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: 'You must supply an author'
    },
    business: {
        type: mongoose.Schema.ObjectId,
        ref: 'Business',
        required: 'You must supply a business'
    },
    treated: {
        type: Boolean
    },
    dateTreated: {
        type: Date
    }
})

function autoPopulate(next) {
    this.populate('queuedTo')
    next()
}

taskSchema.pre('find', autoPopulate)
taskSchema.pre('findOne', autoPopulate)

module.exports = mongoose.model('Task', taskSchema)