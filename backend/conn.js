const mongoose = require('mongoose')

console.log("hi")
mongoose.connect('mongodb+srv://Aravindh:Aravindh@cluster0.y3bdjjk.mongodb.net/myapp1').then(()=>{
    console.log('DB connection succesfull')
}).catch((e)=>{
    console.log('error occured', e)
})

// mongoose.connect('mongodb+srv://Ramanathan:SaiGanesh@cluster1.wsxnmgk.mongodb.net/getbonafide').then(()=>{
//     console.log('DB connection succesfull')
// }).catch((e)=>{
//     console.log('error occured', e)
// })
