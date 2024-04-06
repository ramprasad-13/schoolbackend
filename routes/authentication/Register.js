const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
require('dotenv').config();
const User = require('../../models/SchemaforUser');


router.post('/register',async(req,res)=>{
    // email as input and send otp to that email and match them if worng show error else show dashboard

    const event="Registration"
    //get email from input destrucering email from req body
    const {email}= req.body;

    //here generarting an otp of length 6 numbers
    const genarateOtp=async()=>{
        return Math.floor(Math.random()*900000)+100000;
    }
    const otp=await genarateOtp();

    //send otp to mail given by user using nodemailer
    const transpoter = nodemailer.createTransport({
        service:'gmail',
        auth:{
            user:process.env.APP_USER,
            pass:process.env.APP_PASSWORD
        }
    })
    
    const mailOptions = {
        from:process.env.APP_USER,
        to:`${email}`,
        subject:`Otp for ${event}`,
        html:`
        Your Otp is ${otp}.<br>
        <b>This Otp expire in 5 mins.</b>`
    }

    const saveOTP = async(email,otp)=>{
        try {
            const findUser = await User.findOne({email});
            if(findUser){
                return false;
            }
            else{
                const otpExpiration = new Date(Date.now()+ 5*60*1000);
                const newUser= new User({
                    email,
                    otp,
                    otpExpiration,
                    isverified:false
                })
                await newUser.save();
                return true;
            }
        } catch (error) {
            console.error("Error in saving OTP",Error);
            throw error;
        }

    }
    try {
        const out = await saveOTP(email, otp);
        if (out) {
            transpoter.sendMail(mailOptions)
                .then(() => {
                    return res.status(200).json({ message: "Otp sent Sucessfully" });
                })
                .catch((error) => {
                    console.error(error);
                    return res.status(500).json({ message: "Sending Otp Failed" });
                });
        } else {
            return res.status(400).json({ message: "User already Registered" });
        }
    } catch (error) {
        console.error("Error in sending Otp mail", error);
        return res.status(500).json({ message: "An error occurred while processing your request." });
    }
    

})
module.exports = router;