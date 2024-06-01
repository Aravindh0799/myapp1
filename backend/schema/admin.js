const mongoose = require("mongoose")

const Admin = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
})

const admin = new mongoose.model("admin", Admin)
module.exports = admin