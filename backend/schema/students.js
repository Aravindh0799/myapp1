const mongoose = require('mongoose')

const student = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        require: true
    },
    rollno: {
        type: String,
        require: true
    },
    password: {
        type: String,
        required: true
    },
    resiStatus: {
        type: String,
        required: true
    },
    dob: {
        type: String,
        required: true
    },
    dept: {
        type: String,
        required: true
    },
    prog: {
        type: String,
        required: true
    },
    year: {
        type: String,
        require: true
    },
    section: {
        type: String,
        require: false,
        default: ""
    },
    religion: {
        type: String,
        required: true
    },
    nationality: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    }

})


const students = new mongoose.model('student', student)
module.exports = students