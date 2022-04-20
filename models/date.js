const mongoose = require('mongoose')
const Schema = mongoose.Schema

const dateSchema = new Schema({
    date: Date
})

module.exports = mongoose.model('Date', dateSchema)