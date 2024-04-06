const express = require('express');
const router = express.Router();
const students = require('../models/student_model');
const auth = require('../middleware/authenticateToken')

// Define the default page size (number of records per page)
const PAGE_SIZE = 12;

router.get('/validatestudents',auth,async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1; // Get the requested page (default to page 1)
        const skip = (page - 1) * PAGE_SIZE; // Calculate the number of records to skip

        // Handle search by std_name (if provided)
        const stdNameQuery = req.query.name; // Get the std_name from query parameters

        let query = { approved: false }; // Base query

        if (stdNameQuery) {
            query.std_name = new RegExp(stdNameQuery, 'i'); // Case-insensitive std_name search
        }

        const studentsData = await students.find(query).skip(skip).limit(PAGE_SIZE);
        const totalRecords = await students.countDocuments(query); // Get the total number of records

        const totalPages = Math.ceil(totalRecords / PAGE_SIZE); // Calculate the total number of pages

        res.send({
            data: studentsData,
            totalPages: totalPages,
            currentPage: page
        });
    } catch (error) {
        res.status(500).send(error);
    }
});

module.exports = router;
