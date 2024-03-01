const express = require('express');
const hostname="0.0.0.0"
const port = process.env.PORT || 3000;
const app=express();

//routes
const getstudents= require('./routes/getstudents')
const getstudent = require('./routes/getstudent')
const addstudent = require('./routes/addstudent')
const delstudent = require('./routes/delstudent')
const updatestudent = require('./routes/updatestudent')

//middlewares
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(getstudents)
app.use(getstudent)
app.use(addstudent)
app.use(delstudent)
app.use(updatestudent)

app.listen(port,hostname,()=>{
    console.log(`app started listening http://localhost:${port}`);
})
module.exports = app;
