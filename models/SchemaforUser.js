const mongoose = require('mongoose');


const userOtpSchema = mongoose.Schema({
    email:{
        type: String,
        required: true
    },
    otp:{
        type: Number,
        required: false
    },
    otpExpiration:{
        type:Date,
        required: false
    },
    isverified:{
        type:Boolean,
        required: true
    }
})


const User = mongoose.model('user',userOtpSchema)

module.exports = User;