const { con } = require('./src/packages/db.js');
const express = require("express");
const otpGenerator = require('otp-generator');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const path = require('path');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const expressLayouts = require('express-ejs-layouts');
const { admin_dashboard, admin_specific_institution_supervisors, admin_institutions, admin_industries, admin_specific_industry_supervisors, admin_students, admin_specific_students, admin_industries_supervisors, admin_institutions_supervisors, admin_institution_supervisor_student, admin_settings } = require('./src/roles/admin.js')
const { getDashboard, postDashboard, dashboardAlllog, dashboardAttendance, dashboardCalender, dashboardMonthlyReport } = require('./src/roles/student.js')


const app = express();





// middleware passer
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/css', express.static(path.join(__dirname, 'src/public/css')));
app.use('/js', express.static(path.join(__dirname, 'src/public/js')));
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 60 * 60 * 1000,
    secure: false
  }
}))
app.use(expressLayouts)

app.use(cookieParser());

//Setting Template engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src/views'));


require('./src/packages/passport')(passport);
app.use(passport.initialize());


//Naviagtion
app.get('/', (req, res) => {
  res.render('home', { errors: {}, formData: {}, layout: false });

});


// VERIFICATION PAGES
app.post('/verified', async (req, res) => {
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
      const select_query = 'SELECT * FROM users u INNER JOIN students s ON u.email = s.email WHERE u.email = $1;'

      const id = await con.query(select_query, [user_email])

      const user_id = id.rows[0];

      req.session.user = user_id.matric_no;
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
app.get('/register', (req, res) => {
  const matric_no = req.session.user
  if (!matric_no) {
    res.redirect('/')
  } else {
    res.render('register', { errors: {}, matric_no, layout: false });
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
  res.render('login', { errors: {}, formData: {}, layout: false });
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

    const db_password = user.password;
    const passwordMatch = await bcrypt.compare(password, db_password)

    if (passwordMatch) {
      const fetch_querry = 'SELECT roles from roles r INNER JOIN students s on r.student_id = s.student_id WHERE s.matric_no =$1'
      const result = await con.query(fetch_querry, [username]);
      const roles = result.rows[0];
      const role = roles.roles


      if (role === 'student') {
        const fetch_query = 'SELECT * FROM register r INNER JOIN students s ON r.username = s.matric_no WHERE r.username = $1'
        const result = await con.query(fetch_query, [username]);
        const user = result.rows[0];
        const payload = {
          full_name: user.full_name,
          student_id: user.student_id
        }

        const token = jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: '5h' });

        res.cookie('token', token, { httpOnly: true });
        res.redirect('/dashboard');
      }
      else if (role === 'admin') {
        const fetch_query = 'SELECT * FROM register r INNER JOIN students s ON r.username = s.matric_no WHERE r.username = $1'
        const result = await con.query(fetch_query, [username]);
        const user = result.rows[0];
        const payload = {
          full_name: user.full_name,
          student_id: user.student_id
        }

        const token = jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: '5h' });

        res.cookie('token', token, { httpOnly: true });
        res.redirect('admin/dashboard');
      } else {
        res.render('login', { errors, formData, layout: false })
      }

    } else {
      errors.password = "Invalid Password"
      res.render('login', { errors, formData, layout: false })
    }
  }
});

// STUDENT PAGES
app.use('/dashboard', passport.authenticate('jwt', { session: false }));
app.use('/dashboard/css', express.static(path.join(__dirname, 'src/public/css')));

app.get('/dashboard', getDashboard);

app.post('/dashboard', postDashboard);

app.get('/dashboard/attendance', dashboardAttendance);

app.get('/dashboard/calender', dashboardCalender);

app.get('/dashboard/allLog', dashboardAlllog)

app.get('/dashboard/monthlyReport', dashboardMonthlyReport);


// ADMIN PAGES
app.use('/admin', passport.authenticate('jwt', { session: false }));
app.use('/admin/css', express.static(path.join(__dirname, 'src/public/css')));
app.use('/admin/js', express.static(path.join(__dirname, 'src/public/js')))

//DASHBOARD
app.get('/admin/dashboard', admin_dashboard);

//
app.get('/admin/institutions', admin_institutions)
app.get('/admin/institutions/specific_institution', admin_specific_institution_supervisors)

//
app.get('/admin/industries', admin_industries)
app.get('/admin/industries/specific_Industry', admin_specific_industry_supervisors)

//
app.get('/admin/students', admin_students)
app.get('/admin/student', admin_specific_students)

//
app.get('/admin/industries/supervisors', admin_industries_supervisors)

//
app.get('/admin/institutions/supervisors', admin_institutions_supervisors)

//
app.get('/admin/settings', admin_settings)

//
app.get('/admin/institution/supervisor_students', admin_institution_supervisor_student)

app.get('/test', (req, res) => {
  res.render('test', {
    layout: false
  })
})
app.listen(3000, () => {
  console.log('Server is running');
});



