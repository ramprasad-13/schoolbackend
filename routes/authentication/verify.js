const express = require('express');
const User = require('../../models/SchemaforUser');
const router = express.Router();
const jwt = require('jsonwebtoken');
require('dotenv').config();

router.post('/verify', async (req, res) => {

    const secretKey = process.env.JWT_SECRET;

    const { email, otp} = req.body;
    // Convert isStudent to a boolean

    const verifyOTP = async (email, otp) => {
        const findUser = await User.findOne({email});
        if(findUser.otp===undefined){
            return { isValid:false, message: "No otp is requested"};
        }
        if (!findUser) {
            return { isValid: false, message: "User not found" };
        }
        if (findUser.otpExpiration < new Date()) {
            return { isValid: false, message: "OTP expired" };
        }
        return { isValid: findUser.otp == otp, message:findUser.otp == otp?"OTP verified":"Invalid OTP"};
    }

    try {
        const { isValid, message } = await verifyOTP(email, otp);

        if (isValid) {
            const findUser = await User.findOne({ email });
            findUser.otp = undefined;
            findUser.otpExpiration = undefined;
            findUser.isverified = true;
            await findUser.save();

            function generateAccessToken(user){
                return jwt.sign(user,secretKey,{ expiresIn :'1h'});
            }

            //send a session here to frontent to store and access protected routes. 
            const user = {id:findUser.id,email:findUser.email};
            const accessToken = generateAccessToken(user);

            //or res.send({accessToken})
            return res.status(200).json({token:accessToken});
            //in frontend if response is 200 make request to /dashboard route
        } else {
            return res.status(400).json({ message: message });
        }
    } catch (error) {
        console.error("Error while verifying", error);
        return res.status(500).json({ message: "An error occurred while processing your request." });
    }
});


module.exports = router;
