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
            res.status(200).send("Student update successful");
        } else {
            res.status(404).send("Student not found!");
        }
    } catch (error) {
        res.status(500).send(error);
    }
});



module.exports = router