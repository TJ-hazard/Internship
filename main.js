const con = require('./pakages/db.js');
const express = require("express");
const studentRoutes = require("./routes/student.js");
const supervisorRoutes = require("./routes/supervisor");
const expressLayouts = require('express-ejs-layouts');
const bodyParser = require('body-parser');


const app = express();

// middleware passer
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));


//Setting Template View
app.set('view engine', 'ejs')
app.use(expressLayouts);
app.set('layout', 'register');





//Routes 
app.use("/students", studentRoutes(con));
app.use("/supervisor", supervisorRoutes(con));


//Naviagtion
app.get('/', (req, res) => {
  res.render('register');
});



app.listen(3000, () => {
  console.log("Server is Running");
});
