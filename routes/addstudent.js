const express = require('express')
const router = express.Router()
const multer = require('multer')
const cloudinary = require("cloudinary").v2
require('../connection');
const nodemailer = require('nodemailer');



// multer configuration
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 1 * 1024 * 1024 // limit to 5MB
  }
})

// cloudinary configuration
cloudinary.config({ 
  cloud_name: process.env.CLOUD_NAME, 
  api_key: process.env.API_KEY, 
  api_secret: process.env.API_SECRET 
})

// importing model
const students = require('../models/student_model')

router.post('/addstudent', async (req, res) => {
  try {
    // parse the request with multer
    upload.single('profilepic')(req, {}, async function(err) {
      if (err) {
        return res.status(500).json(err)
      }

      // Check if file was uploaded
      if (!req.file || !req.file.buffer) {
        return res.status(400).send('No file uploaded')
      }

      const { std_name, father_name, std_class, campus, ph_number, email, filename } = req.body
      const result = await cloudinary.uploader.upload_stream({ resource_type: 'image', public_id: filename }, (error, result) => {
        if (error) {
          return res.status(500).json(error)
        }

        let current_student = new students({
          std_name,
          father_name,
          std_class,
          campus,
          ph_number,
          email,
          profilepic: result.secure_url, // use secure_url to get the https version of the URL
          approved: false
        })
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
          <p>You have successfully sent a request to join Saint Joseph's family. Upon successful verification, you will be added to our Alumni.</p>
          <h5>Stay Connected</h5>
          `}

        current_student.save()
          .then((student) => {
            //send mail here
            transpoter.sendMail(mailOptions)
            .then(() => {
                return res.status(200).json({student});
            })
            .catch((error) => {
                console.error(error);
                return res.status(500).json({ message: "Sending Otp Failed" });
            });
          })
          .catch(error => res.status(500).json(error))
      }).end(req.file.buffer)
    })
  } catch (error) {
    console.error(error)
    res.status(500).send(error)
  }
})

module.exports = router
