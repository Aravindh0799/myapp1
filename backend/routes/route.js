const express = require('express')
const router = express.Router()
// const bcrypt  = require('bcrypt')
// const nodemailer = require('nodemailer');
// const jwt = require('jsonwebtoken')
// const otp = require('otp-generator')
// const JWT_SECRET = "ciwbuconciwevccwu1229238c/idb871cb91383hc}28vwrgbw8b748{62[]()69cwv";
const student = require('../schema/students');
const bcrypt  = require('bcrypt')
const multer = require('multer')
const bonafides = require('../schema/bonafides');
router.post('/register',async(req,res)=>{
    const{name,email,password,resiStatus,dob,dept,year,religion,nationality,address} = req.body;
    const encryptedPassword = await bcrypt.hash(password,10);
    try{
    console.log(req.body,encryptedPassword)

    const otheruser = await student.findOne({email:email})

    if(otheruser){
        return res.json({
            status:409, 
            message:"user already registered"
        })
    }
    else{
    const data = await new student({
        name:name,
        email:email,
        password:encryptedPassword,
        resiStatus:resiStatus,
        dob:dob,
        dept:dept,
        year:year,
        religion:religion,
        nationality:nationality,
        address:address
    }
        
    )

    const result = await data.save()

    if(result){
        res.json({
            message:"success",
            status:200
        })
    }
    else{
        res.json({
            message:"reg failure",
            status:300
        })
    }
    }
}
    catch(e){
        console.log(e)
    }

})


router.post('/login',async(req,res)=>{
    const{email,password}=req.body;

    console.log(req.body)
    try{
        const user = await student.findOne({email:email})
        console.log(user,"from try")
        if(user){
            if(await bcrypt.compare(password, user.password)){
                console.log(user.password)
                return res.json({
                    status:200,
                })
            }
            else{
                console.log("error")
                return res.json({
                    status:300
                })
            }
        }
        else{
            console.log("error")
                return res.json({
                    status:400
                })
        }


    }
    catch(err){
        console.log(err)
    }
})


router.post('/applyBonafide',async(req,res)=>{
    const{email,reason}=req.body
    console.log("from apply api",reason)
    if(reason===""){
        return res.json({
            message:"empty_reason"
        })
    }
    try{
        const user = await student.findOne({email:email})

        if(user){
            console.log("from applyBonafide",user)
            const{name,email,password,resiStatus,dob,dept,year,religion,nationality,address} = user;
            
            //pdf creation
            const PDFDocument = require('pdfkit');
            const fs = require('fs');
            const buffer = require('stream-buffers').WritableStreamBuffer;
            const doc = new PDFDocument();

            // doc.pipe(fs.createWriteStream('./temppdf/output.pdf'));

            const pdfBuffer = new buffer();

            doc.pipe(pdfBuffer)
            
            doc
                .fontSize(25)
                .text(name, 100, 100)
                .text(email, 100, 150);

            doc
                .save()
            
            doc.end();

            
            
            pdfBuffer.on('finish', () => {
                const pdfContents = pdfBuffer.getContents();
                content = pdfContents.toString('base64')
                console.log(content);
                // console.log(pdfContents.toString('base64'));
                //getting back the pdf from the buffer
                // fs.writeFileSync('./temppdf/original.pdf', pdfContents);


                //bonfide part
                // Date object
                const date = new Date();

                let currentDay= String(date.getDate()).padStart(2, '0');

                let currentMonth = String(date.getMonth()+1).padStart(2,"0");

                let currentYear = date.getFullYear();

                let hours = date.getHours();
                let minutes = date.getMinutes();
                let seconds = date.getSeconds();

                // we will display the date as DD-MM-YYYY 

                let currentDate = `${currentYear}-${currentMonth}-${currentDay}_${hours}:${minutes}:${seconds}`;

                //console.log("The current date is " + currentDate); 
                let date1 = new Date(currentDate)
                const bfname = reason+"_bonafide_"+currentDate

                console.log(bfname)


                // Set up Multer for handling file uploads
                const storage = multer.memoryStorage(); // Store files in memory
                const upload = multer({ storage: storage });

                try{
                // console.log("existing else")
                const bfide = new bonafides({
                    name:bfname,
                    email:email,
                    dept:dept,
                    year:year,
                    b_type:reason,
                    data_file:content 
                })
                const result = bfide.save()
                if(result){
                return res.json({

                    message:"created"
                })
                }
                else{
                    return res.json({
                        message:"failure"
                    })
                }
                }catch(error){
                    console.log(error)
                    return res.json({
                        message:"failure"
                    })
                }


              });
        }
    }
    catch(err){
        console.log("from applyBonafide",err)
    }

})


router.post("/checkBonafide",async(req,res)=>{
    const{email,reason} = req.body
    const existing = await bonafides.findOne({email:email,b_type:reason})

    if(existing){
        console.log("already existing")
        return res.json({
            message:"existing"
        })
    }
    else{
        return res.json({
            message:"success"
        })
    }
})

router.post("/getBonafides",async(req,res)=>{
    const email = req.body.email

    const bfs = await bonafides.find({email:email}).select('name email status')

    if(bfs){
        console.log(bfs)
        return res.json({message:"success",data:bfs})
    }
    else{
        return res.json({message:"failed"})
    }
})



module.exports=router
