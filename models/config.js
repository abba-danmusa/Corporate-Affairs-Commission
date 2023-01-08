const mongoose = require('mongoose')
const Schema = mongoose.Schema

const configSchema = new Schema({
    isPaid: Boolean
})

module.exports = mongoose.model('Config', configSchema)