const express = require('express')
const router = express.Router()
require('../connection')

//importing model
const students= require('../models/student_model')

router.patch("/update/:id", async (req, res) => {
    try {
        let { id } = req.params;
        let student_found = await students.findOneAndUpdate(
            { _id: id }, 
            { $set: req.body },
            { new: true, runValidators: true }
        );
        if (student_found) {
            let query = { approved: false }; // Base query
            const studentsData = await students.find(query); //send unapproved students
            res.status(200).send(studentsData);
        } else {
            res.status(404).send("Student not found!");
        }
    } catch (error) {
        res.status(500).send(error);
    }
});



module.exports = router
