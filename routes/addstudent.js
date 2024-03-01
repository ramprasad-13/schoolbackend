const express = require('express')
const router = express.Router()
const multer = require('multer')
const cloudinary = require("cloudinary").v2
require('../connection')

// multer configuration
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024 // limit to 5MB
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

        current_student.save()
          .then(student => res.status(200).json(student))
          .catch(error => res.status(500).json(error))
      }).end(req.file.buffer)
    })
  } catch (error) {
    console.error(error)
    res.status(500).send(error)
  }
})

module.exports = router
