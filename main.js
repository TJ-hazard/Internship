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
require('dotenv').config();
const jwt = require('jsonwebtoken');



const app = express();




// middleware passer
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/css', express.static(path.join(__dirname, '/public/css')));
app.use('/js', express.static(path.join(__dirname, '/public/js')));



//Setting Template engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//Routes 
app.use("/students", studentRoutes(con));
app.use("/supervisor", supervisorRoutes(con));


function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>

  if (!token) return res.sendStatus(401); // No token provided

  jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
    if (err) return res.sendStatus(403); // Token invalid or expired

    req.user = user; // Store user data in request
    next();
  });
}


//Naviagtion
app.get('/', (req, res) => {
  res.render('home', { errors: {}, formData: {} });

});



app.post('/verified', authenticateToken, async (req, res) => {
  const errors = {};
  const formData = {
    email: req.body.email,
    otp: req.body.otp
  }
  const user_email = req.body.email;
  const user_otp = req.body.otp;
  const select_query = 'SELECT email, reset_token, token_expirydate FROM users WHERE email=$1';


  const result = await con.query(select_query, [user_email]);

  if (result.rows.length === 0) {

    errors.email = 'Invalid Email Address';
    return res.render('home', { errors, formData })
  } else {
    const user = result.rows[0];


    const db_reset_token = user.reset_token;
    const db_token_expirydate = user.token_expirydate;

    const date1 = new Date();
    const date2 = new Date(db_token_expirydate);
    const diff = date1 - date2;

    if ((db_reset_token != user_otp)) {
      errors.otp = 'Invalid Otp';
      res.render('home', { errors, formData });
    } else if ((diff >= (5 * 60 * 1000))) {
      errors.otp = 'OTP expired';
      res.render('home', { errors, formData });
    } else {
      const select_query = 'SELECT s.matric_no FROM users u INNER JOIN students s ON u.email = s.email WHERE u.email = $1;'

      const matricNo_result = await con.query(select_query, [user_email])

      const userMatricNo = matricNo_result.rows[0];

      const payload = {
        userMatric_no: userMatricNo.matric_no
      }

      const token = jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: '1h' });

      res.json({ token });

      res.redirect('/register');
    }
  }

})


app.post('/verify', async (req, res) => {
  const errors = {}
  const email = req.body.email;
  const formData = { email };
  const date1 = new Date();

  const select_query = "SELECT email FROM students WHERE email=$1"

  const result = await con.query(select_query, [email]);

  if (result.rows.length === 0) {
    return res.json({ success: false, message: 'Email not found in the database' });
  } else {
    const user = result.rows[0];
    const user_email = user.email;

    if (email === user_email) {
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

      const query = "INSERT INTO users (email, reset_token, token_expirydate) VALUES ($1,$2,$3) ON CONFLICT ON CONSTRAINT users_email_key DO UPDATE SET  reset_token = EXCLUDED.reset_token, token_expirydate = EXCLUDED.token_expirydate;"

      con.query(query, [email, otp, date1], (err, result) => {
        if (err) {
          console.log(err);
        }

      });

    }

  }


});

//Naviagtion
app.get('/register', authenticateToken, (req, res) => {
  const userMatric_no = req.user.matric_no;

  if (!userMatric_no) {
    return res.redirect('/');
  } else {
    res.render('register', { errors: {}, userMatric_no });
  }
});


app.post('/register', async (req, res) => {
  const errors = {}
  const userMatric_no = req.session.userMatric_no;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;

  if (confirmPassword != password) {
    errors.confirmPassword = 'Password does not match'
    res.render('register', { errors, userMatric_no });
  } else if (confirmPassword === password) {
    async function hashPassword(password) {
      try {
        const saltRounds = 10;
        const hashed = await bcrypt.hash(password, saltRounds);
        console.log('Hashed:', hashed);
        return hashed;
      } catch (err) {
        console.error(err);
      }
    }

    const hashedPassword = await hashPassword(password);
    const update_query = 'UPDATE register SET password =$1 WHERE username=$2';

    con.query(update_query, [hashedPassword, userMatric_no]);
    console.log('P ', hashedPassword);
    res.redirect('/login');
  }
});


app.get('/login', (req, res) => {
  res.render('login', { errors: {}, formData: {} });
});

app.post('/login', async (req, res) => {
  const errors = {}
  const username = req.body.username;
  const password = req.body.password;

  const formData = {
    username
  }

  const fetch_query = 'SELECT username,password FROM register WHERE username=$1'

  const result = await con.query(fetch_query, [username]);
  if (result.rows.length === 0) {
    errors.username = 'Invalid Username';
    res.render('login', { errors, formData })
  } else {
    const user = result.rows[0];

    const db_user = user.username;
    const db_password = user.password;
    const passwordMatch = await bcrypt.compare(password, db_password)

    if (passwordMatch) {
      const fetch_query = 'SELECT s.full_name FROM register r INNER JOIN students s ON r.username = s.matric_no WHERE r.username = $1'
      const result = await con.query(fetch_query, [username]);
      const user = result.rows[0];


      req.session.userFullname = user.full_name;
      await req.session.save();
      res.redirect('/dashboard');
    } else {
      errors.password = "Invalid Password"
      res.render('login', { errors, formData })
    }
  }
});


app.get('/dashboard', async (req, res) => {
  res.render('dashboard'
  );
});


app.post('/dashboard', async (req, res) => {
  const date = req.body.date;
  const log = req.body.log;

  const select_query = 'SELECT student_id FROM students WHERE '

  const post_query = 'INSERT INTO logs(date,log,id) VALUES($1,$2,$3)';
  con.query(post_query, [date, log,])
});



app.get('/attendance', (req, res) => {
  res.render('attendance');
});

app.get('/calender', (req, res) => {
  res.render('calender');
});

app.get('/allLog', (req, res) => {
  res.render('all_log');
})

app.get('/monthlyReport', (req, res) => {
  const fetch_query = 'SELECT FROM logs '
  res.render('monthly_report');
});



app.listen(3000, () => {
  console.log('Server is running');
});












