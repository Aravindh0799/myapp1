const mongoose = require('mongoose')

const Otp = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    otp: {
        type: String,
        required: true
    },

})

const otp = new mongoose.model("otp", Otp)
module.exports = otp