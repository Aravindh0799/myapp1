const mongoose = require('mongoose')


const Bonafide = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    stud: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    dept: {
        type: String,
        required: true
    },
    prog: {
        type: String,
        default: ""
    },
    year: {
        type: String,
        required: true
    },
    section: {
        type: String,
        required: false
    },
    tutor: {
        type: Boolean,
        required: true,
        default: false
    },
    hod: {
        type: Boolean,
        required: true,
        default: false
    },
    principal: {
        type: Boolean,
        required: true,
        default: false
    },
    b_type: {
        type: String,
        required: true
    },

    dwnd: {
        type: Boolean,
        required: true,
        default: false
    },
    data_file: {
        type: Buffer,
        required: true
    },
    apd_date: {
        type: Date,
    },
    status: {
        type: String,
        required: true,
        default: "Pending - Tutor"
    },
    verificationNum: {
        type: String,
    }

}, {
    timestamps: true
})


const bonafides = new mongoose.model('bonafide', Bonafide)
module.exports = bonafides