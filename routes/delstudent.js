const express = require('express')
const cloudinary = require("cloudinary").v2;
const router = express.Router()
require('../connection')

//importing model
const students= require('../models/student_model')

//cloudinary config
cloudinary.config({ 
    cloud_name: process.env.CLOUD_NAME, 
    api_key: process.env.API_KEY, 
    api_secret: process.env.API_SECRET 
  });

router.delete("/delete/:id", async (req, res) => {
    try {
        let { id } = req.params;
        let find_student = await students.findOne({ _id: id });
        if (find_student) {
            // Extract public_id from the image url
            let public_id = find_student.profilepic.split('/').pop().split('.')[0];

            // Delete image from Cloudinary
            await cloudinary.uploader.destroy(public_id, function(error, result) {
                console.log(result, error);
            });

            // Delete student from database
            await students.deleteOne({ _id: id });
            res.status(203).send("Deleted successfully");
        } else {
            res.send("Student not found!");
        }
    } catch (error) {
        res.status(500).send(error);
    }
});


module.exports = router;