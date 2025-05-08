const { con } = require('./pakages/db.js');
const express = require("express");
const studentRoutes = require("./routes/student.js");
const supervisorRoutes = require("./routes/supervisor");
const { userValidationRules } = require('./pakages/validators.js');
const { validationResult } = require('express-validator');
const otpGenerator = require('otp-generator');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const path = require('path');




const app = express();

// middleware passer
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));




//Setting Template View
app.set('view engine', 'ejs')




//Routes 
app.use("/students", studentRoutes(con));
app.use("/supervisor", supervisorRoutes(con));


//Naviagtion
app.get('/', (req, res) => {
  res.render('dashboard');
});


const d = new Date()
console.log(d);

function async() {


  const d = new Date()
  console.log(d)
}


app.post('/verified', async (req, res) => {

  const email = req.body.email;
  const otp = req.body.otp;
  const select_query = 'SELECT email, reset_token, token_expirydate FROM users WHERE email=$1';

  const result = await con.query(select_query, [email]);

  const user = result.rows[0];
  // console.log("this.email>>", user.this.email);
  console.log("use>>", user.email);
  // user.forEach((row, index) => {

  // })

})

app.post('/verify', async (req, res) => {


  const startTime = new Date();

  const transporter = nodemailer.createTransport({
    service: 'gmail', // or use "host", "port", and "secure" for custom SMTP
    auth: {
      user: 'gbiyedefavour@gmail.com',        // your Gmail address
      pass: 'jufntdetnzjifphb'             // app password, NOT yourreal password
    }
  });


  const otp = otpGenerator.generate(6, {
    upperCaseAlphabets: false,
    specialChars: false,
    lowerCaseAlphabets: false,
  });

  const email = req.body.email;

  try {
    let info = await transporter.sendMail({
      from: '"My App" <gbiyedefavour@gmail.com>', // sender
      to: email,                               // receiver
      subject: 'Your OTP Code',
      text: `Your OTP is ${otp}`,             // plain text body
      html: `<b>Your OTP is ${otp}</b>`       // HTML body
    });

    console.log('Email sent: ', info.messageId);
    res.json({ success: true, message: 'OTP sent to email', otp });
  } catch (err) {
    console.error('Error sending email:', err);
    res.status(500).json({ success: false, message: 'Failed to send OTP' });
  }



  const insert_query = 'INSERT INTO users(email, reset_token, token_expirydate) VALUES($1, $2,$3)';

  con.query(insert_query, [email, otp, startTime], (err, result) => {
    console.log(err);
  })
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













app.listen(3000, () => {
  console.log("Server is Running");
});



