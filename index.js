const express = require('express');
const cors= require('cors');
const hostname="0.0.0.0"
const port = process.env.PORT || 3000;
const app=express();

//routes
const getunapprovedstudents= require('./routes/getunapprovedstudents')
const getstudent = require('./routes/getstudent')
const addstudent = require('./routes/addstudent')
const delstudent = require('./routes/delstudent')
const updatestudent = require('./routes/updatestudent')

var corsOptions = {
    origin: function (origin, callback){ callback(null, true)},
    methods: ['GET', 'POST','PATCH','DELETE'], // Specify your origin here
    credentials: true,  // This allows the session cookie to be sent back and forth
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
  };

app.use(cors(corsOptions)); // allow any origin

//middlewares
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(getunapprovedstudents)
app.use(getstudent)
app.use(addstudent)
app.use(delstudent)
app.use(updatestudent)

app.get("/",(req,res)=>{
    res.json({"success":"App deployed sucessfully"})
})

app.listen(port,hostname,()=>{
    console.log(`app started listening http://localhost:${port}`);
})
module.exports = app;
