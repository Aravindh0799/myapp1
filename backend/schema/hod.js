const mongoose = require('mongoose')


const Hod = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    dept:{
        type:String,
        required:true
    },
     
    
},)


const hods = new mongoose.model('hod', Hod)
module.exports = hods