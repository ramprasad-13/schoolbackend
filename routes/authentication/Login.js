const express = require('express');
const nodemailer = require('nodemailer');
const User = require('../../models/SchemaforUser');
const router = express.Router();

router.post('/login',async(req,res)=>{
    const {email} = req.body;
    const findUser = await User.findOne({email,isverified:true});
    if(!findUser){
        return res.status(400).json({message:"Email not exist, User not found!"});
    }

    //sendOtp
    
    const event="Login"

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
    

    const saveOTP = async(findUser,otp)=>{
        const otpExpiration = new Date(Date.now()+ 5*60*1000);
        findUser.otp = otp;
        findUser.otpExpiration = otpExpiration;
        await findUser.save();
    }


    try {
        saveOTP(findUser,otp)
        transpoter.sendMail(mailOptions)
        .then(()=>{
            res.status(200).json({message:"Otp sent Sucessfully"})
        })
        .catch((error)=>{
            res.status(500).json({message:"Sending Otp Failed"});
            console.error(error)})
    } catch (error) {
        console.error("Error in sending Otp mail",error);
    }

})

module.exports = router;