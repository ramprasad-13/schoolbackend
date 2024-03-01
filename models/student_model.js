const mongoose = require('mongoose');

//schema
const std_schema =mongoose.Schema({
    std_name:String,
    father_name:String,
    class:String,
    campus:String,
    ph_number:String,
    email:String,
    profilepic:String,
    approved:Boolean
})


module.exports=mongoose.model("student",std_schema)