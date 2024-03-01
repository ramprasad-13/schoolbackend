const express = require('express')
const router = express.Router()
require('../connection')

//importing model
const students= require('../models/student_model')

router.get("/student/:id",async(req,res)=>{
    let {id}=req.params
    let std_found=await students.findOne({_id:id})
    if(std_found){
        res.status(203).send(std_found)
    }
    else{
        res.send("Invalid roll number")
    }
})

module.exports = router;