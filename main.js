const { con } = require('./pakages/db.js');
const express = require("express");
const studentRoutes = require("./routes/student.js");
const supervisorRoutes = require("./routes/supervisor");
const { userValidationRules } = require('./pakages/validators.js');
const { validationResult } = require('express-validator');
const otpGenerator = require('otp-generator');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');




const app = express();

// middleware passer
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


//Setting Template View
app.set('view engine', 'ejs')




//Routes 
app.use("/students", studentRoutes(con));
app.use("/supervisor", supervisorRoutes(con));


//Naviagtion
app.get('/', (req, res) => {
  res.render('dashboard');
});

app.post('/verify', async (req, res) => {
  const db_otp = otpGenerator.generate(6, {
    upperCaseAlphabets: false,
    specialChars: false,
    lowerCaseAlphabets: false,
  });

  const {
    email,
    user_otp
  } = req.body;

  const values = [
    email,
    user_otp
  ];



  const insert_query = "INSERT INTO login(email_address,reset_token) VALUES($1,$2)";

  con.query(insert_query, [email, db_otp])
});


app.get('/students/postData', async (req, res) => {
  res.render('register');
});


app.get('/supervisor/postData', async (req, res) => {
  res.render('')
});


app.post('login/', userValidationRules, async (req, res) => {

  const { username,
    email,
    password
  } = req.body;

  const values = [
    username,
    email,
    password
  ]

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const alert = errors.array();
    return res.render('home', { alert });
  };

  const insert_query = "INSERT INTO users(username,email,password)VALUES($1,$2,$3)";

  try {
    await con.query(insert_query, values, (err, result) => {
      console.log(err);
      res.redirect('/r');
    });
  } catch (error) {
    console.log(err);
  }

});




//Naviagtion
app.get('/login', (req, res) => {
  res.render('login`');
});









function requestOtp() {

}






app.listen(3000, () => {
  console.log("Server is Running");
});



