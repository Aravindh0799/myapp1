const mongoose = require('mongoose')

const Verify = new mongoose.Schema({
    verificationNum: {
        type: String,
        required: true
    },
    details: {
        type: String,
    }
})

const verify = new mongoose.model("Verify", Verify)
module.exports = verify