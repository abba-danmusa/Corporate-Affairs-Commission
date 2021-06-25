const Business = require('../models/business')

exports.loginForm = (req, res) => {
    res.render('login', { title: 'Login' })
}

exports.entryForm = (req, res) => {
    res.render('entryForm', { title: 'New Registration Entry' })
}

exports.saveEntry = async(req, res) => {
    // const business = 
    const business = new Business(req.body)
    await business.save(function(err, document) {
        if (err) console.log(err)
        io.on('connection', function(socket) {
            socket.to('admin').emit({
                regNumber: document.regNumber,
                businessName: document.businessName,
                natureOfBusiness: document.natureOfBusiness,
                state: document.state,
                dataOfReg: document.dataOfReg
            })
        })
    })

    req.flash('success', 'Business Details have been saved successfully')
    res.redirect('back')
}

exports.searchByBusinessName = async(req, res) => {
    const business = await Business.
    find({
            $text: { $search: req.query.q }
        }, {
            score: { $meta: 'textScore' }
        })
        .sort({
            score: { $meta: 'textScore' }
        })
        .limit(5)
    res.json(business)
}