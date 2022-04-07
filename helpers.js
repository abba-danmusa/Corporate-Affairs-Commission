const fs = require('fs')

exports.moment = require('moment')

// helps in debugging when using templates
exports.dump = (obj) => JSON.stringify(obj, null, 2)

// Icons directory (inserting an svg)
exports.icon = (name) => fs.readFileSync(`./public/images/icons/${name}.svg`)

//images directory (inserting a png image)
exports.img = (name) => fs.readFileSync(`./public/images/${name}.png`)

// site info
exports.siteName = `Corporate Affairs Commission`

exports.menu = [

]