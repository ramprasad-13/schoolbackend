const express= require('express')
const router = express.Router()
require('../connection')

//importing model
const students= require('../models/student_model')

router.get("/students",async(req,res)=>{
    try{
        let students_data = await students.find()
        res.send(students_data);
    }
    catch(error){
        res.status(500).send(error)
    }
})

module.exports = router