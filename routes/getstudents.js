const express = require('express');
const router = express.Router();
const students = require('../models/student_model');

// Define the default page size (number of records per page)
const PAGE_SIZE = 10;

router.get('/students', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1; // Get the requested page (default to page 1)
        const skip = (page - 1) * PAGE_SIZE; // Calculate the number of records to skip

        // Handle search by std_name (if provided)
        const stdNameQuery = req.query.std_name; // Get the std_name from query parameters

        let query = students.find(); // Base query

        if (stdNameQuery) {
            query = query.where('std_name', new RegExp(stdNameQuery, 'i')); // Case-insensitive std_name search
        }

        const studentsData = await query.skip(skip).limit(PAGE_SIZE);

        res.send(studentsData);
    } catch (error) {
        res.status(500).send(error);
    }
});

module.exports = router;
