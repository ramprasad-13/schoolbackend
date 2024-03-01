const mongoose = require('mongoose');

//schema
const std_schema =mongoose.Schema({
    std_name:String,
    father_name:String,
    std_class:String,
    campus:String,
    ph_number:Number,
    email:String,
    profilepic:String,
    approved:Boolean
})


module.exports=mongoose.model("student",std_schema)
