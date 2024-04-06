const express = require('express');
const User = require('../../models/SchemaforUser');
const router = express.Router();

router.get('/logout',async(req,res)=>{
    res.clearCookie('token');
    res.status(200).send("Logout sucessfull");
})

module.exports = router;