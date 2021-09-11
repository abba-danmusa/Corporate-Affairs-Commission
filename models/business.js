const mongoose = require('mongoose')
const slug = require('slugs')

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
    slug: String,
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
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: 'You must supply an Author'
    },
    file: {
        type: String,
        required: 'You must supply a pdf file'
    },
    queuedTo: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: 'You must supply an author'
    },
    treated: {
        type: Boolean,
        default: false
    },
    dateTreated: {
        type: Date
    }
})

businessSchema.index({
    regNumber: 'text',
    businessName: 'text',
    state: 'text'
})

// businessSchema.virtual('fileSrc').get(function() {
//     if (this.file != null) {
//         return `data:${this.fileType};charset=utf-8;base64,${this.file.toString('base64')}`
//     }
// })

businessSchema.statics.taskTo = function() {
    return this.aggregate([
        {}
    ])
}

businessSchema.statics.getUserTotalTasks = function(userID) {
    return this.find({ queuedTo: userID })
}

businessSchema.statics.getPendingTasks = function(userID) {
    return this.find({ queuedTo: userID, treated: false })
}

businessSchema.statics.getTreatedTasks = function(userID) {
    return this.find({ queuedTo: userID, treated: true })
}

businessSchema.statics.getTotals = function() {
    return this.aggregate([

        { $unwind: '$queuedTo' },
        { $group: { _id: '$queuedTo', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
    ])
}

businessSchema.statics.getTreatedToday = function() {
    return this.aggregate([

        {
            '$match': {
                'dateTreated': { '$gt': new Date(Date.now() - 24 * 60 * 60 * 1000) },
            }
        },
        { $unwind: '$queuedTo' },
        { $group: { _id: '$queuedTo', count: { $sum: 1 } } },

        { $sort: { count: -1 } }

    ])
}

businessSchema.statics.getPendingsToday = function() {
    return this.aggregate([{
            '$match': {
                'dateEntered': { '$gt': new Date(Date.now() - 24 * 60 * 60 * 1000) },
                'treated': false
            }
        },
        { $unwind: '$queuedTo' },
        { $group: { _id: '$queuedTo', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
    ])
}

businessSchema.statics.getAuthor = function(userID) {
    return this.find({ author: userID })
}

businessSchema.statics.getTotalSentByEachAuthor = function() {
    return this.aggregate([
        { $unwind: '$author' },
        { $group: { _id: '$author', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
    ])
}

businessSchema.statics.getTotalDailySent = function() {
    return this.aggregate([{
            '$match': {
                'dateEntered': { '$gt': new Date(Date.now() - 24 * 60 * 60 * 1000) },
            }
        },
        { $unwind: '$author' },
        { $group: { _id: '$author', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
    ])
}

businessSchema.statics.getTotalSentByEachState = function() {
    return this.aggregate([
        { $unwind: '$author' },
        { $group: { _id: '$state', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
    ])
}

businessSchema.statics.getdailyStatesSents = function() {
    return this.aggregate([
        { $unwind: '$author' },
        {
            $group: {
                _id: '$state',
                count: { $sum: 1 }
            }
        },
        {
            $sort: {
                dateEntered: {
                    $gt: new Date(Date.now() - 24 * 60 * 60 * 1000)
                }
            }
        }
    ])
}

// businessSchema.virtual('task', {
//     ref: 'Task',
//     localField: '_id',
//     foreignField: 'business'
// })

function autoPopulateAuthor(next) {
    this.populate('author')
    next()
}

function autoPopulate(next) {
    this.populate('queuedTo')
    next()
}

function autoPopulateTreatedBy(next) {
    this.populate('treatedBy')
    next()
}

businessSchema.pre('find', autoPopulateAuthor)
businessSchema.pre('findOne', autoPopulateAuthor)

businessSchema.pre('find', autoPopulateTreatedBy)
businessSchema.pre('findOne', autoPopulateTreatedBy)

businessSchema.pre('find', autoPopulate)
businessSchema.pre('findOne', autoPopulate)

businessSchema.pre('save', async function(next) {
    if (!this.isModified('businessName')) {
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