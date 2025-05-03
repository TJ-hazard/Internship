const con = require('./pakages/db.js');
const express = require("express");
const studentRoutes = require("./routes/student.js");
const supervisorRoutes = require("./routes/supervisor");
const expressLayouts = require('express-ejs-layouts');
const bodyParser = require('body-parser');
const { userValidationRules } = require('./pakages/validators.js');


const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



app.set('view engine', 'ejs')
app.use(expressLayouts);
app.set('layout', 'register.ejs');






app.use("/students", studentRoutes(con));
app.use("/supervisor", supervisorRoutes(con));


app.get('/students', (req, res) => {
  res.render('register', { errors: req.query.errors || [] });
});



app.listen(3000, () => {
  console.log("Server is Running");
});

 