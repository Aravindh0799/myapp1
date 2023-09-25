const mongoose = require('mongoose')


const Principal = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    dept:{
        type:String,
        required:true
    },
     
    
},)


const principals = new mongoose.model('principal', Principal)
module.exports = principals