const express = require('express')
const router = express.Router()
// const bcrypt  = require('bcrypt')
// const nodemailer = require('nodemailer');
// const jwt = require('jsonwebtoken')
// const otp = require('otp-generator')
// const JWT_SECRET = "ciwbuconciwevccwu1229238c/idb871cb91383hc}28vwrgbw8b748{62[]()69cwv";
const regularFontPath = './Times New Roman/times new roman.ttf';
const student = require('../schema/students');
const faculty = require('../schema/faculty')
const hod = require('../schema/hod')
const principal = require('../schema/principal')
const bcrypt  = require('bcrypt')
const multer = require('multer')
const bonafides = require('../schema/bonafides');
const qrcode =require('qrcode');
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
        const fac_user = await faculty.findOne({email:email})
        const hod_user = await hod.findOne({email:email})
        const prc_user = await principal.findOne({email:email})
        console.log(user,"from try")
        if(user){
            if(await bcrypt.compare(password, user.password)){
                console.log(user.password)
                return res.json({
                    status:200,
                    message:"user",
                    dept:user.dept
                })
            }
            else{
                console.log("error")
                return res.json({
                    status:300
                })
            }
        }
        else if(fac_user){
            // if(await bcrypt.compare(password, fac_user.password))
            if(password===fac_user.password)
            {
                console.log(fac_user.password)
                return res.json({
                    status:200,
                    message:"fac",
                    dept:fac_user.dept,
                    year:fac_user.year
                })
            }
            else{
                console.log("error")
                return res.json({
                    status:300
                })
            }
        }
        
        else if(hod_user){
            // if(await bcrypt.compare(password, hod_user.password))
            if(password===hod_user.password)
            {
                console.log(hod_user.password)
                return res.json({
                    status:200,
                    message:"hod",
                    dept:hod_user.dept
                })
            }
            else{
                console.log("error")
                return res.json({
                    status:300
                })
            }
        }

        else if(prc_user){
            // if(await bcrypt.compare(password, prc_user.password))
            if(password===prc_user.password)
            {
                console.log(prc_user.password)
                return res.json({
                    status:200,
                    message:"prc",
                    dept:prc_user.dept
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

// Function to generate a QR code and return it as a data URL
async function generateQRCode(data) {
    try {
      const qrCodeDataURL = await qrcode.toDataURL(data); // Generate the QR code
      return qrCodeDataURL;
    } catch (error) {
      console.error('Error generating QR code:', error);
      return null;
    }
  }



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
            
            // doc
            //     .fontSize(25)
            //     .text(name, 100, 100)
            //     .text(email, 100, 150);

            // doc.image('./images/bonafide_template.png', 0, 0, { width: 800, height:600  });

            // doc.fontSize(19).font(regularFontPath).text(name,300,235);
            // doc.fontSize(15).font(regularFontPath).text(dob,141,272);
            // doc.fontSize(15).font(regularFontPat).text(year,140,300);
            
            doc.image('./images/Logo.png',0,0,{height:100,width:600  });
            doc.moveDown(3);
            doc.font(regularFontPath).text('TO WHOMSOEVER IT MAY CONCERN',{align:'center',underline: true});
            doc.moveDown(1);
            doc.font(regularFontPath).text(`Date: 17/07/2023`,{align:'right'});
            doc.moveDown(3);
            const firstLineIndentation = 20;
            doc.text(' '.repeat(firstLineIndentation), { continued: true });
            doc.font(regularFontPath).text(`This is to certify that ${name} (), S/o ,is a bonafidestudent of our college and currently studying in second year ${dept} branch. As Per our records, the following are his personal details. `);

            doc.moveDown(2);
            const secondLineIndentation = 10;
            doc.text(' '.repeat(secondLineIndentation), { continued: true });
            doc.font(regularFontPath).text(`1. Date of Birth : ${dob}`);
            doc.text(' '.repeat(secondLineIndentation), { continued: true });
            doc.font(regularFontPath).text(`2. Religion : ${religion}`);
            doc.text(' '.repeat(secondLineIndentation), { continued: true });
            doc.font(regularFontPath).text(`3. Nationality : ${nationality}`);
            doc.text(' '.repeat(secondLineIndentation), { continued: true });
            doc.font(regularFontPath).text(`4. Address : ${address}`);

            doc.moveDown(2);
            // const thirdLineIndentation = 10;
            // doc.text(' '.repeat(thirdLineIndentation), { continued: true });
            doc.font(regularFontPath).text(`He is ${resiStatus}`);
        
            doc.moveDown(2);
            doc.font(regularFontPath).text(`The Certificate is issued on his request to enable him to apply for ${reason}`);
            doc
                .save()
            
            doc.end();

            
            
            pdfBuffer.on('finish', () => {
                const pdfContents = pdfBuffer.getContents();
                const content = atob(pdfContents)
                // content = pdfContents.toString('base64')
                console.log(content);
                // console.log(pdfContents.toString('base64'));
                //getting back the pdf from the buffer
                //fs.writeFileSync('./temppdf/original1.pdf', pdfContents);


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
    const mode = req.body.mode
    const dept = req.body.dept
    let bfs = await bonafides.find({email:email}).select('name email status')

    if(bfs){
        console.log(bfs)
        return res.json({message:"success",data:bfs})
    }
    else{
        return res.json({message:"failed"})
    }
})

router.post("/getBonafidesFac",async(req,res)=>{
    const email = req.body.email
    const mode = req.body.mode 
    const dept = req.body.dept
    const year = req.body.year
    console.log(req.body)
    let bfs = await bonafides.find({dept:dept,year:year,dwnd:false,hod:false,principal:false,tutor:false,status:"Pending"})

    if(bfs){
        console.log("from fac",bfs)
        return res.json({message:"success",data:bfs})
    }
    else{
        return res.json({message:"failed"})
    }
})

router.post("/getBonafidesHod",async(req,res)=>{
    const email = req.body.email
    const mode = req.body.mode 
    const dept = req.body.dept
    let bfs = await bonafides.find({dept:dept,tutor:true,hod:false,dwnd:false,status:"Pending"})
    if(bfs){
        console.log("from hod",bfs)
        return res.json({message:"success",data:bfs})
    }
    else{
        return res.json({message:"failed"})
    }
})

router.post("/getBonafidesPrc",async(req,res)=>{
    const email = req.body.email
    const mode = req.body.mode 
    let bfs = await bonafides.find({tutor:true,hod:true,principal:false,dwnd:false,status:"Pending"})
    if(bfs){
        console.log("from prc",bfs)
        return res.json({message:"success",data:bfs})
    }
    else{
        return res.json({message:"failed"})
    }
})
 


router.post('/getpdf',async(req,res)=>{
    const reqid = req.body.id
    console.log(reqid)
    try{
    const pdf = await bonafides.findOne({'_id':reqid})
    const data = pdf.data_file
    const base64String = Buffer.from(data).toString('base64')
    console.log(pdf)
    if(pdf){

        return res.json({
            content : base64String
        })
    }
}catch(err){
    console.log(err)
}

})


router.post("/approveBonafide",async(req,res)=>{
    console.log(req.body)

    const {id,mode}=req.body

    if(mode==="fac"){
        const temp = await bonafides.findOneAndUpdate({_id:id},{tutor:"true"})

        if(temp.modifiedCount!=0){
            console.log(temp)
            console.log("updated")
           
        }
    }

    else if(mode==="hod"){
        const temp = await bonafides.findOneAndUpdate({_id:id},{hod:"true"})
        if(temp.modifiedCount!=0){
            console.log("updated")
            const temp = await bonafides.find({_id:id})
            console.log(temp[0])
            if(temp[0].b_type==="Competition"){
                console.log("inside comp")
                const temp1 = await bonafides.findOneAndUpdate({_id:id},{dwnd:"true",status:"success"})
                if(temp1.modifiedCount==0){
                    return res.json({message: "failed"})
                }
            }
        }
    }

    else if(mode==="prc"){
        const temp = await bonafides.findOneAndUpdate({_id:id},{principal:"true"})
        if(temp.modifiedCount!=0){
            console.log("updated")
            const temp1 = await bonafides.findOneAndUpdate({_id:id},{dwnd:"true",status:"success"})

        }
    }
    else{
        return res.json({
            message:"failed"
        })
    }

    return res.json({
        message:"success"
    })
})


router.post('/rejectBonafide',async(req,res)=>{
    console.log(req.body)
    const{id,mode}=req.body
    var temp = "Rejected by " + mode
    const result = await bonafides.findOneAndUpdate({_id:id},{status:temp})

    if(result.modifiedCount!=0){
        return res.json({
            message:"success"
        })
    }
    else{
        return res.json({
            message:"failed"
        })
    }
})

module.exports=router
