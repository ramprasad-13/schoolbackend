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

            //send mail to student who added to alumini
            //send mail to approved student
        const transpoter = nodemailer.createTransport({
          service:'gmail',
          auth:{
            user:process.env.APP_USER,
            pass:process.env.APP_PASSWORD
          }
        })
        
        const mailOptions = {
          from:process.env.APP_USER,
          to:`${current_student.email}`,
          subject:`Great!,you are now part of saint Joseph's Alumini.`,
          html:`
          <h3>Hello, ${current_student.std_name}</h3>
          <p>You have been added to Saint Joseph's Alumni. Now you are able to receive updates from us.</p>
          <h5>Stay Connected</h5>
          `}

            //send mail here
            transpoter.sendMail(mailOptions)
            .then(() => {
                return res.status(200).send(studentsData);
            })
            .catch((error) => {
                console.error(error);
                return res.status(500).json({ message: "Failed to send mail to User [ verified sucessfully ]!" });
            });
        
        } else {
            res.status(404).send("Student not found!");
        }
    } catch (error) {
        res.status(500).send(error);
    }
});



module.exports = router
