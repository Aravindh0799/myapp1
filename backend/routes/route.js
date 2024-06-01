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
const bcrypt = require('bcrypt')
const multer = require('multer')
const bonafides = require('../schema/bonafides');
const QRCode = require('qrcode');
const verify = require("../schema/verify")
const fs = require('fs');
const { PDFDocument, rgb } = require('pdf-lib');
const { Buffer } = require('buffer');
const nodemailer = require('nodemailer');
const OTP = require("../schema/otp");
const { fail } = require('assert');
const admin = require('../schema/admin')

const frontEndIp = "http://172.20.10.4:3000/"

router.post('/registerStudents', async (req, res) => {

    const { data } = req.body
    let oldUsers = []
    let failed = []
    await Promise.all(data.map(async (record) => {
        let password = null

        try {
            const { name, email, rollno, resiStatus, dob, dept, prog, year, section, religion, nationality, address } = record

            password = dob

            const encryptedPassword = await bcrypt.hash(password, 10);
            try {
                // console.log(req.body, encryptedPassword)

                const otheruser = await student.findOne({ email: email })

                if (otheruser) {
                    oldUsers.push(email)
                    console.log("user exists")
                    console.log(oldUsers)
                }
                else {
                    const data = await new student({
                        name: name,
                        email: email,
                        rollno: rollno,
                        password: encryptedPassword,
                        resiStatus: resiStatus,
                        dob: dob,
                        dept: dept,
                        prog: prog,
                        year: year,
                        section: section,
                        religion: religion,
                        nationality: nationality,
                        address: address
                    }

                    )

                    const result = await data.save()

                    if (!result) {
                        failed.push(email)
                    }
                }
            }
            catch (e) {
                console.log(e)
                return res.json({
                    staus: 401,
                    message: "registration failed with an error"
                })
            }
        }

        catch (err) {
            return res.json({
                status: 405,
                message: "Unsupported Data format",
                arr: record
            })
        }
    }
    )
    )

    // console.log(oldUsers)

    if (oldUsers.length === 0 && failed.length === 0) {
        return res.json({
            status: 200,
            message: "success"
        })
    }
    else {
        return res.json({
            status: 403,
            exisitingUsers: oldUsers,
            regFailed: failed
        })
    }

})

router.post('/registerTutors', async (req, res) => {

    const { data } = req.body
    let oldUsers = []
    let failed = []

    if (data[0].rollno || data[0].address) {
        return res.json({
            status: 405,
            message: "Unsupported Data format",

        })
    }

    await Promise.all(data.map(async (record) => {
        let password = null

        const { name, email, dept, prog, year, section } = record

        password = "staff@123"

        const encryptedPassword = await bcrypt.hash(password, 10);
        try {
            console.log(req.body, encryptedPassword)

            const otheruser = await faculty.findOne({ email: email })

            if (otheruser) {
                oldUsers.push(email)
            }
            else {
                const data = await new faculty({
                    name: name,
                    email: email,
                    password: encryptedPassword,
                    dept: dept,
                    prog: prog,
                    year: year,
                    section: section,
                }

                )

                const result = await data.save()

                if (!result) {
                    failed.push(email)
                }
            }
        }
        catch (e) {
            console.log(e)
            return res.json({
                staus: 401,
                message: "registration failed with an error"
            })
        }


    })
    )

    if (oldUsers.length == 0 && failed.length == 0) {
        return res.json({
            status: 200,
            message: "success"
        })
    }
    else {
        return res.json({
            status: 403,
            exisitingUsers: oldUsers,
            regFailed: failed,
            message: "failed"
        })
    }

})


router.post('/registerHods', async (req, res) => {

    const { data } = req.body
    let oldUsers = []
    let failed = []

    if (data[0].rollno || data[0].year) {
        return res.json({
            status: 405,
            message: "Unsupported Data format",

        })
    }

    await Promise.all(data.map(async (record) => {
        let password = null

        try {
            const { name, email, dept, prog } = record

            password = "hod@123"

            const encryptedPassword = await bcrypt.hash(password, 10);
            try {
                console.log(req.body, encryptedPassword)

                const otheruser = await hod.findOne({ email: email })

                if (otheruser) {
                    oldUsers.push(email)
                }
                else {
                    const data = await new hod({
                        name: name,
                        email: email,
                        password: encryptedPassword,
                        dept: dept,
                        prog: prog
                    }

                    )

                    const result = await data.save()

                    if (!result) {
                        failed.push(email)
                    }
                }
            }
            catch (e) {
                console.log(e)
                return res.json({
                    staus: 401,
                    message: "registration failed with an error"
                })
            }
        }
        catch (err) {
            return res.json({
                status: 405,
                message: "Unsupported Data format",
                arr: record
            })
        }

    })
    )

    if (oldUsers.length == 0 && failed.length == 0) {
        return res.json({
            status: 200,
            message: "success"
        })
    }
    else {
        return res.json({
            status: 403,
            exisitingUsers: oldUsers,
            regFailed: failed,
            message: "failed"
        })
    }

})


router.post('/registerPrincipal', async (req, res) => {

    const { data } = req.body
    let oldUsers = []
    let failed = []

    if (data[0].rollno || data[0].year || data[0].dept) {
        return res.json({
            status: 405,
            message: "Unsupported Data format",

        })
    }

    await Promise.all(data.map(async (record) => {
        let password = null
        try {
            const { name, email } = record

            password = "prc@123"

            const encryptedPassword = await bcrypt.hash(password, 10);
            try {
                console.log(req.body, encryptedPassword)

                const otheruser = await principal.findOne({ email: email })

                if (otheruser) {
                    oldUsers.push(email)
                }
                else {
                    const data = await new principal({
                        name: name,
                        email: email,
                        password: encryptedPassword,
                    }

                    )

                    const result = await data.save()

                    if (!result) {
                        failed.push(email)
                    }
                }
            }
            catch (e) {
                console.log(e)
                return res.json({
                    staus: 401,
                    message: "registration failed with an error"
                })
            }
        }
        catch (err) {
            return res.json({
                status: 405,
                message: "Unsupported Data format",
                arr: record
            })
        }

    })
    )

    if (oldUsers.length == 0 && failed.length == 0) {
        return res.json({
            status: 200,
            message: "success"
        })
    }
    else {
        return res.json({
            status: 403,
            exisitingUsers: oldUsers,
            regFailed: failed,
            message: "failed"
        })
    }

})


router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    console.log(req.body)
    try {
        const user = await student.findOne({ email: email })
        const fac_user = await faculty.findOne({ email: email })
        const hod_user = await hod.findOne({ email: email })
        const prc_user = await principal.findOne({ email: email })
        console.log(user, "from try")
        if (user) {
            if (await bcrypt.compare(password, user.password)) {
                console.log(user.password)
                return res.json({
                    status: 200,
                    message: "user",
                    dept: user.dept,
                    name: user.name
                })
            }
            else {
                console.log("error")
                return res.json({
                    status: 300
                })
            }
        }
        else if (fac_user) {
            if (await bcrypt.compare(password, fac_user.password)) {
                // if (password === fac_user.password) {
                console.log(fac_user.password)
                return res.json({
                    status: 200,
                    message: "fac",
                    dept: fac_user.dept,
                    year: fac_user.year,
                    prog: fac_user.prog,
                    name: fac_user.name,
                    section: fac_user.section
                })
            }
            else {
                console.log("error")
                return res.json({
                    status: 300
                })
            }
        }

        else if (hod_user) {
            if (await bcrypt.compare(password, hod_user.password)) {
                // if (password === hod_user.password) {
                console.log(hod_user.password)
                return res.json({
                    status: 200,
                    message: "hod",
                    dept: hod_user.dept,
                    prog: hod_user.prog,
                    name: hod_user.name
                })
            }
            else {
                console.log("error")
                return res.json({
                    status: 300
                })
            }
        }

        else if (prc_user) {
            if (await bcrypt.compare(password, prc_user.password)) {
                // if (password === prc_user.password) {
                console.log(prc_user.password)
                return res.json({
                    status: 200,
                    message: "prc",
                    dept: prc_user.dept,
                    name: prc_user.name
                })
            }
            else {
                console.log("error")
                return res.json({
                    status: 300
                })
            }
        }

        else {
            console.log("error")
            return res.json({
                status: 400
            })
        }


    }
    catch (err) {
        console.log(err)
    }
})




router.post('/applyBonafide', async (req, res) => {
    const { email, reason } = req.body
    console.log("from apply api", reason)
    if (reason === "") {
        return res.json({
            message: "empty_reason"
        })
    }
    try {
        const user = await student.findOne({ email: email })

        if (user) {
            console.log("from applyBonafide", user)
            const { name, email, rollno, password, resiStatus, dob, dept, prog, year, section, religion, nationality, address } = user;

            const currentDate = new Date();

            // Extract day, month, and year from the date object
            const day = currentDate.getDate(); // Get the day as a number (1-31)
            const month = currentDate.getMonth() + 1; // Get the month (0-11, add 1 to get actual month)
            const yr = currentDate.getFullYear(); // Get the four-digit year

            // Pad day and month with leading zeros if needed
            const formattedDay = day < 10 ? `0${day}` : day;
            const formattedMonth = month < 10 ? `0${month}` : month;

            // Create the formatted date string in dd/mm/yyyy format
            const formattedDate = `${formattedDay}/${formattedMonth}/${yr}`;


            const buffer = require('stream-buffers').WritableStreamBuffer;
            const PDFDocument = require('pdfkit');
            const doc = new PDFDocument();
            const pdfBuffer = new buffer();



            doc.pipe(pdfBuffer)

            doc.image('./images/Logo.png', 30, 0, { height: 130, width: 550 });
            doc.moveDown(7);
            doc.font(regularFontPath).text('TO WHOMSOEVER IT MAY CONCERN', { align: 'center', underline: true });
            doc.moveDown(1);
            doc.font(regularFontPath).text(`Date: ${formattedDate}`, { align: 'right' });
            doc.moveDown(4);
            const firstLineIndentation = 20;
            doc.text(' '.repeat(firstLineIndentation), { continued: true });
            doc.font(regularFontPath).text(`This is to certify that Mr./Ms. ${name} Roll.no ${rollno}, is a bonafide student of our college and currently studying in ${dept}, ${prog} ${year} year. As Per our records, the following are his personal details. `);

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
            doc.font(regularFontPath).text(`He resides in ${resiStatus}`);

            doc.moveDown(2);
            doc.font(regularFontPath).text(`The Certificate is issued on his/her request to enable him/her to apply for ${reason}`);
            doc
                .save()

            doc.end();



            pdfBuffer.on('finish', () => {
                const pdfContents = pdfBuffer.getContents();
                // const content = atob(pdfContents)
                content = pdfContents.toString('base64')
                // console.log(content);
                // console.log(pdfContents.toString('base64'));
                //getting back the pdf from the buffer
                //fs.writeFileSync('./temppdf/original1.pdf', pdfContents);


                //bonfide part
                // Date object
                const date = new Date();

                let currentDay = String(date.getDate()).padStart(2, '0');

                let currentMonth = String(date.getMonth() + 1).padStart(2, "0");

                let currentYear = date.getFullYear();

                let hours = date.getHours();
                let minutes = date.getMinutes();
                let seconds = date.getSeconds();

                // we will display the date as DD-MM-YYYY 

                let currentDate = `${currentYear}-${currentMonth}-${currentDay}_${hours}:${minutes}:${seconds}`;

                //console.log("The current date is " + currentDate); 
                let date1 = new Date(currentDate)
                const bfname = reason + "_bonafide_" + currentDate

                console.log(bfname)


                // Set up Multer for handling file uploads
                const storage = multer.memoryStorage(); // Store files in memory
                const upload = multer({ storage: storage });

                try {
                    // console.log("existing else")
                    const bfide = new bonafides({
                        name: bfname,
                        stud: name,
                        email: email,
                        dept: dept,
                        prog: prog,
                        year: year,
                        section: section,
                        b_type: reason,
                        data_file: content
                    })
                    const result = bfide.save()
                    if (result) {
                        return res.json({

                            message: "created"
                        })
                    }
                    else {
                        return res.json({
                            message: "failure"
                        })
                    }
                } catch (error) {
                    console.log(error)
                    return res.json({
                        message: "failure"
                    })
                }


            });
        }
    }
    catch (err) {
        console.log("from applyBonafide", err)
    }

})


router.post("/checkBonafide", async (req, res) => {
    const { email, reason } = req.body
    console.log(req.body)
    const existing = await bonafides.find({ email: email, b_type: reason })

    let p_flag = false         // pending flag

    console.log(existing.length)

    if (existing.length > 0) {


        existing.forEach(
            (item, index) => {
                console.log(item.name, index)
                if (item.status.toLowerCase().startsWith("pending")) {
                    p_flag = true
                }
            }
        )

        console.log(p_flag)

        if (p_flag) {
            return res.json({
                message: "pending"
            })
        }

        else {
            return res.json({
                message: "success"
            })
        }
    }
    else {
        return res.json({
            message: "success"
        })
    }

    // return res.json({
    //     message:"pending"
    // })

})

router.post("/getBonafides", async (req, res) => {
    const email = req.body.email
    const mode = req.body.mode
    const dept = req.body.dept
    const projection = { _id: 1, name: 1, stud: 1, email: 1, dept: 1, year: 1, tutor: 1, hod: 1, principal: 1, b_type: 1, dwnd: 1, apd_date: 1, status: 1, verificationNum: 1, timestamps: 1 }
    let bfs = await bonafides.find({ email: email }).select('name email status')
    bfs = bfs.reverse()

    if (bfs) {
        console.log(bfs)
        return res.json({ message: "success", data: bfs })
    }
    else {
        return res.json({ message: "failed" })
    }
})

router.post("/getBonafidesFac", async (req, res) => {
    const email = req.body.email
    const mode = req.body.mode
    const dept = req.body.dept
    const prog = req.body.prog
    const year = req.body.year
    const section = req.body.section

    const projection = { _id: 1, name: 1, stud: 1, email: 1, dept: 1, prog: 1, section: 1, year: 1, tutor: 1, hod: 1, principal: 1, b_type: 1, dwnd: 1, apd_date: 1, status: 1, verificationNum: 1, createdAt: 1 }

    console.log(req.body)
    let bfs = await bonafides.find({ dept: dept, prog: prog, year: year, section: section }, projection)
    bfs = bfs.reverse()

    if (bfs) {
        console.log("from fac", bfs)
        return res.json({ message: "success", data: bfs })
    }
    else {
        return res.json({ message: "failed" })
    }
})

router.post("/getBonafidesHod", async (req, res) => {
    const email = req.body.email
    const mode = req.body.mode
    const dept = req.body.dept
    const prog = req.body.prog
    const projection = { _id: 1, name: 1, stud: 1, email: 1, dept: 1, prog: 1, year: 1, tutor: 1, hod: 1, principal: 1, b_type: 1, dwnd: 1, apd_date: 1, status: 1, verificationNum: 1, createdAt: 1 }


    let bfs = null
    if (prog !== "") {

        bfs = await bonafides.find({ dept: dept, prog: prog }, projection)
    }
    else {
        bfs = await bonafides.find({ dept: dept }, projection)
    }

    bfs = bfs.reverse()

    if (bfs) {
        console.log("from hod", bfs)
        return res.json({ message: "success", data: bfs })
    }
    else {
        return res.json({ message: "failed" })
    }
})

router.post("/getBonafidesPrc", async (req, res) => {
    const email = req.body.email
    const mode = req.body.mode
    const projection = { _id: 1, name: 1, stud: 1, email: 1, dept: 1, year: 1, tutor: 1, hod: 1, principal: 1, b_type: 1, dwnd: 1, apd_date: 1, status: 1, verificationNum: 1, createdAt: 1 }

    let bfs = await bonafides.findAll(projection)
    bfs = bfs.reverse()

    if (bfs) {
        console.log("from prc", bfs)
        return res.json({ message: "success", data: bfs })
    }
    else {
        return res.json({ message: "failed" })
    }
})



router.post('/getpdf', async (req, res) => {
    const reqid = req.body.id
    console.log(reqid)
    try {
        const pdf = await bonafides.findOne({ '_id': reqid })
        if (pdf.status == "success") {
            const data = pdf.data_file
            const base64String = Buffer.from(data).toString()
            // console.log(pdf)
            if (pdf.status == "success") {
                return res.json({
                    message: "download",
                    name: pdf.name,
                    content: base64String
                })
            }
        }
        else {
            return res.json({
                message: "failed"
            })
        }
    } catch (err) {
        console.log(err)
    }

})

// Function to generate a QR code
async function generateQRCode(data) {
    return new Promise((resolve, reject) => {
        QRCode.toFile('qrcode.png', data, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve(Buffer.from(fs.readFileSync('qrcode.png')).toString('base64'));
            }
        });
    });
}

async function AddandUpdateQrPDF(base64Pdf, qrCodeImageBuffer, id) {
    try {
        const pdfDoc = await PDFDocument.load(Buffer.from(base64Pdf, 'base64'));
        const qrCodeImage = await pdfDoc.embedPng(Buffer.from(qrCodeImageBuffer, 'base64'));
        const pages = pdfDoc.getPages();
        const firstPage = pages[0];

        // 4. Add text to the page.
        firstPage.drawImage(qrCodeImage, {
            x: 100,
            y: 480,
            size: 5,
            color: rgb(0, 0, 0),
        });

        const modifiedBase64Pdf = Buffer.from(await pdfDoc.save()).toString('base64');

        await bonafides.findOneAndUpdate({ _id: id }, { data_file: modifiedBase64Pdf })

        // 7. Return the modified Base64 PDF.
        return modifiedBase64Pdf;
    } catch (error) {
        throw error;
    }
}




router.post("/approveBonafide", async (req, res) => {
    const { id, mode } = req.body
    const bonafideDetail = await bonafides.findOne({ _id: id });
    const studentDetail = await student.findOne(({ email: bonafideDetail.email }))

    let numbers = [];
    //creating random id for bonafides
    function generateUniqueSixDigitNumbers(num) {
        if (!numbers.includes(num)) {
            numbers.push(num);
            console.log("num generated", num)
            return num;
        }
        else {
            let temp = generateRandomSixDigitNumber()
            generateUniqueSixDigitNumbers(temp)
        }

    }

    function generateRandomSixDigitNumber() {
        return Math.floor(100000 + Math.random() * 900000); // Generates a random number between 100000 and 999999
    }


    if (mode === "fac") {
        const temp = await bonafides.findOneAndUpdate({ _id: id }, { tutor: "true", status: "Pending - HOD" })
        if (temp.modifiedCount != 0) {
            console.log("updated")
        }
    }

    else if (mode === "hod") {
        if (bonafideDetail.b_type === 'Competition' || bonafideDetail.b_type === 'Bank application' || bonafideDetail.b_type === 'Scholarship') {
            const details = `\nName : ${studentDetail.name}  \nReason : ${bonafideDetail.b_type} \nApproved by : HoD \nApplied (Date & Time) : ${bonafideDetail.createdAt} \nApproved (Date & Time) : ${bonafideDetail.updatedAt}`;
            let tempNum = generateRandomSixDigitNumber()
            const formattedData = "bf" + (generateUniqueSixDigitNumbers(tempNum)).toString()

            const qrCodeImageBuffer = await generateQRCode(frontEndIp + "verify/" + formattedData);

            const record = await new verify({
                verificationNum: formattedData,
                details: details
            })

            const result = record.save()

            if (!result) {
                console.log("error in saving bonafide number and details")
                return res.json({
                    status: 400,
                    message: "failed"
                })
            }

            await bonafides.findOneAndUpdate({ _id: id }, { hod: "true", dwnd: "true", status: "success", verificationNum: formattedData })

            AddandUpdateQrPDF(Buffer.from(bonafideDetail.data_file).toString(), qrCodeImageBuffer, bonafideDetail._id)
                .then((modifiedBase64Pdf) => {
                    console.log('Successly Modified the PDF');
                })
                .catch((error) => {
                    console.error('Error:', error);
                });
        } else {
            await bonafides.findOneAndUpdate({ _id: id }, { hod: "true", status: "Pending - Principal" });
        }
        // if(temp.modifiedCount!=0){
        //     const temp = await bonafides.find({_id:id})
        //     if(temp[0].b_type==="Competition"){
        //         console.log("inside comp")
        //         const temp1 = await bonafides.findOneAndUpdate({_id:id},{dwnd:"true",status:"success"})
        //         if(temp1.modifiedCount==0){
        //             return res.json({message: "failed"})
        //         }
        //     }
        // }
    }

    else if (mode === "prc") {
        const details = `\nName : ${studentDetail.name}  \nReason : ${bonafideDetail.b_type} \nApproved by : Principal \nApplied (Date & Time) : ${bonafideDetail.createdAt} \nApproved (Date & Time) : ${bonafideDetail.updatedAt}`;
        let tempNum = generateRandomSixDigitNumber()
        const formattedData = "bf" + (generateUniqueSixDigitNumbers(tempNum)).toString()

        const qrCodeImageBuffer = await generateQRCode(formattedData);

        const record = await new verify({
            verificationNum: formattedData,
            details: details
        })

        const result = record.save()

        if (!result) {
            console.log("error in saving bonafide number and details")
            return res.json({
                status: 400,
                message: "failed"
            })
        }


        await bonafides.findOneAndUpdate({ _id: id }, { hod: "true", dwnd: "true", status: "success" })
        AddandUpdateQrPDF(Buffer.from(bonafideDetail.data_file).toString(), qrCodeImageBuffer, bonafideDetail._id)
            .then((modifiedBase64Pdf) => {
                console.log('Successly Modified the PDF');
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }
    else {
        return res.json({
            message: "failed"
        })
    }

    return res.json({
        message: "success"
    })
})


router.post('/rejectBonafide', async (req, res) => {
    console.log(req.body)
    const { id, mode, reason } = req.body
    let designation = ""

    if (mode === "fac") {
        designation = "Tutor"
    }
    else if (mode === "hod") {
        designation = "HOD"
    }
    else {
        designation = "Principal"
    }
    var temp = "Rejected by " + designation + " for " + reason
    const result = await bonafides.findOneAndUpdate({ _id: id }, { status: temp })

    if (result.modifiedCount != 0) {
        return res.json({
            message: "success"
        })
    }
    else {
        return res.json({
            message: "failed"
        })
    }
})

router.post('/changePassword', async (req, res) => {
    const { email, mode, cPwd, nPwd } = req.body
    console.log(req.body)
    let user = null
    if (mode === "fac") {
        user = await faculty.findOne({ email: email })
    }
    else if (mode === "hod") {
        user = await hod.findOne({ email: email })
    }
    else if (mode === "prc") {
        user = await principal.findOne({ email: email })
    }
    else if (mode === "stud") {
        user = await student.findOne({ email: email })
    }
    else {
        return res.json({
            status: 400,
            message: "no user found"
        })
    }

    const temp = await bcrypt.compare(cPwd, user.password)

    if (temp) {
        const newHashedPwd = await bcrypt.hash(nPwd, 10)

        let result = null

        if (mode === "fac") {
            result = await faculty.findOneAndUpdate({ email: email }, { password: newHashedPwd })
        }
        else if (mode === "hod") {
            result = await hod.findOneAndUpdate({ email: email }, { password: newHashedPwd })
        }
        else if (mode === "prc") {
            result = await principal.findOneAndUpdate({ email: email }, { password: newHashedPwd })
        }
        else if (mode === "stud") {
            result = await student.findOneAndUpdate({ email: email }, { password: newHashedPwd })
        }


        if (result) {
            return res.json({
                status: 200,
                message: "success"
            })
        }

        else {
            return res.json({
                status: 401,
                message: "failed updating"
            })
        }
    }
    else {
        return res.json({
            status: 402,
            message: "Current password incorrect"
        })
    }

})

router.post("/sendOtp", async (req, res) => {
    const { email } = req.body
    const user = await student.findOne({ email: email })
    const fac_user = await faculty.findOne({ email: email })
    const hod_user = await hod.findOne({ email: email })
    const prc_user = await principal.findOne({ email: email })

    const sendOTP = async (email, otp) => {

        let transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: '22mx105@psgtech.ac.in',
                pass: '#@ravindh09'
            }
        });

        // Email message options
        let mailOptions = {
            from: '22mx105@psgtech.ac.in',
            to: email,
            subject: 'OTP Code',
            text: `Your OTP code for changing password is ${otp}.`,

        };

        try {
            // Send mail with defined transport object
            let info = await transporter.sendMail(mailOptions);
            console.log('Message sent: %s', info.messageId);
        } catch (error) {
            console.log('Error occurred:', error);
        }
    };

    if (user || fac_user || hod_user || prc_user) {

        let otp = Math.floor(100000 + Math.random() * 900000);

        sendOTP(email, otp);

        const temp = await OTP.findOneAndUpdate({ email: email }, { otp: otp })
        if (!temp) {
            const obj = await new OTP({
                email: email,
                otp: otp
            })

            const result = await obj.save()

            if (!result) {
                return res.json({
                    status: 400,
                    message: "error occured while creating otp record"
                })
            }

            return res.json({
                status: 200,
                message: "success"
            })
        }
        else {
            return res.json({
                status: 200,
                message: "success"
            })
        }

    }
    else {
        return res.json({
            status: 400,
            message: "No user found"
        })
    }
})

router.post("/verifyOtp", async (req, res) => {
    const { email, otp, password } = req.body
    const record = await OTP.findOne({ email: email, otp: otp })

    if (record) {
        const hashedPwd = await bcrypt.hash(password, 10)
        const updatedStd = await student.findOneAndUpdate({ email: email }, { password: hashedPwd })
        const updatedFac = await faculty.findOneAndUpdate({ email: email }, { password: hashedPwd })
        const updatedHod = await hod.findOneAndUpdate({ email: email }, { password: hashedPwd })
        const updatedPrc = await principal.findOneAndUpdate({ email: email }, { password: hashedPwd })

        if (updatedFac || updatedHod || updatedPrc || updatedStd) {
            await OTP.deleteOne({ email: email })
            return res.json({
                status: 200,
                message: "success"
            })
        }
        else {
            return res.json({
                status: 402,
                message: "No user found"
            })
        }

    }
    else {
        return res.json({
            status: 403,
            message: "No OTP record found in the DB"
        })
    }
})


router.post("/getDepts", async (req, res) => {
    const users = await faculty.find({})

    let deptArr = []
    await users.forEach((ele) => {
        let temp = null

        temp = ele.dept + " - " + ele.prog

        if (!deptArr.includes(temp)) {
            deptArr.push(temp)
        }
    })


    return res.json({
        status: 200,
        message: "success",
        depts: deptArr
    })

})

router.post("/getPrcs", async (req, res) => {
    const users = await principal.find({})


    return res.json({
        status: 200,
        message: "success",
        prcs: users
    })
})

router.post("/getDeptInfo", async (req, res) => {
    const { dept, prog } = req.body

    try {
        const stds = await student.find({ dept: dept, prog: prog })
        const tuts = await faculty.find({ dept: dept, prog: prog })
        let hodz
        if (dept === "MSc") {
            hodz = await hod.find({ dept: dept })
        }
        else {
            hodz = await hod.find({ dept: dept, prog: prog })
        }

        console.log(hodz)
        return (res.json({
            status: 200,
            message: "success",
            students: stds,
            tutors: tuts,
            hods: hodz
        }))
    }
    catch (err) {
        return res.json({
            status: 400,
            message: err
        })
    }
})

router.post("/getHod", async (req, res) => {
    const { email } = req.body

    const user = await hod.findOne({ email: email })

    if (user) {
        return res.json({
            status: 200,
            data: user
        })
    }
    else {
        return res.json({
            status: 400
        })
    }
})

router.post("/getTutor", async (req, res) => {
    const { email } = req.body

    const user = await faculty.findOne({ email: email })

    if (user) {
        return res.json({
            status: 200,
            data: user
        })
    }
    else {
        return res.json({
            status: 400
        })
    }
})

router.post("/getStudent", async (req, res) => {
    const { email } = req.body

    const user = await student.findOne({ email: email })

    if (user) {
        return res.json({
            status: 200,
            data: user
        })
    }
    else {
        return res.json({
            status: 400
        })
    }
})

router.post("/getPrc", async (req, res) => {
    const { email } = req.body

    const user = await principal.findOne({ email: email })

    if (user) {
        return res.json({
            status: 200,
            data: user
        })
    }
    else {
        return res.json({
            status: 400
        })
    }
})

router.post("/editStudent", async (req, res) => {
    const { name, email, rollno, password, resiStatus, dob, dept, prog, year, section, religion, nationality, address } = req.body.data

    const result = await student.findOneAndUpdate({ email: email }, { name: name, rollno: rollno, resiStatus: resiStatus, dob: dob, dept: dept, prog: prog, year: year, section: section, religion: religion, nationality: nationality, address: address })

    if (result) {
        return res.json({
            status: 200,
            message: "success"
        })
    }
    else {
        return res.json({
            status: 400
        })
    }
})

router.post("/editTutor", async (req, res) => {
    const { name, email, password, dept, prog, year, section } = req.body.data

    const result = await faculty.findOneAndUpdate({ email: email }, { name: name, dept: dept, prog: prog, year: year, section: section })

    if (result) {
        return res.json({
            status: 200,
            message: "success"
        })
    }
    else {
        return res.json({
            status: 400
        })
    }
})

router.post("/editHod", async (req, res) => {
    const { name, email, password, dept, prog } = req.body.data
    console.log(req.body.data)
    const result = await hod.findOneAndUpdate({ email: email }, { name: name, dept: dept, prog: prog }, { new: true })
    console.log("result", result)
    if (result) {
        return res.json({
            status: 200,
            message: "success"
        })
    }
    else {
        return res.json({
            status: 400
        })
    }
})

router.post("/editPrc", async (req, res) => {
    const { name, email, password } = req.body.data

    const result = await principal.findOneAndUpdate({ email: email }, { name: name })

    if (result) {
        return res.json({
            status: 200,
            message: "success"
        })
    }
    else {
        return res.json({
            status: 400
        })
    }
})

router.post('/deleteUser', async (req, res) => {
    const { email, mode } = req.body
    let user
    if (mode === "student") {
        user = await student.deleteOne({ email: email })
    }
    else if (mode === "tutor") {
        user = await faculty.deleteOne({ email: email })
    }
    else if (mode === "hod") {
        user = await hod.deleteOne({ email: email })
    }
    else if (mode === "prc") {
        user = await principal.deleteOne({ email: email })
    }

    console.log("deleted: ", user.deletedCount)
    if (user.deletedCount !== 0) {
        return res.json({
            status: 200
        })
    }
    else {
        return res.json({
            status: 400
        })
    }
})

router.post("/signinAdmin", async (req, res) => {
    const { email, pass } = req.body
    const result = await admin.findOne({ email: email, password: pass })
    console.log("result", result)
    if (result) {
        // console.log("result")
        return res.json({
            status: 200,
            message: "success"
        })
    }
    else {
        return res.json({
            status: 400,
            message: "failed"
        })
    }
})


router.post("/verifyBonafide/:id", async (req, res) => {
    const id = req.params.id
    console.log("id", id)
    const result = await verify.findOne({ verificationNum: id })

    if (result) {
        console.log("verify", result)
        return res.json({
            status: 200,
            data: result
        })
    }
    else {
        return res.json({
            status: 400
        })
    }
})

module.exports = router
