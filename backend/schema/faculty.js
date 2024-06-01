const mongoose = require('mongoose')


const Faculty = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    prog: {
        type: String,
        required: true
    },
    dept: {
        type: String,
        required: true
    },
    year: {
        type: String,
        required: true
    },
    section: {
        type: String,
        default: ""
    }

},)


const faculties = new mongoose.model('faculty', Faculty)
module.exports = faculties