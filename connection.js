const mongoose = require('mongoose');
require('dotenv').config()

//mongo uri
const uri=process.env.MONGO_URI;

//mongo db connection
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const db=mongoose.connection;
db.on("error", console.error.bind(console, 'MongoDB connection error:'));
db.once("open", () => { console.log("DB connection established") });

module.exports = db;
