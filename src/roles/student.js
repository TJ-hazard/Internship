const { con } = require('../packages/db');
const express = require("express");
const multer = require('multer')
const fs = require('fs');

const upload = multer({
    dest: 'uploads/', limits: {
        fileSize: 2 * 1024 * 1024 // 2MB in bytes
    },
    fileFilter: (req, file, cb) => {
        // Only accept image mime types
        if (!file.mimetype.startsWith('image/')) {
            return cb(new Error('Only image files are allowed!'), false);
        }
        cb(null, true);
    }
});


const getDashboard = (req, res) => {
    const success = req.session.success;
    req.session.success = null;
    const error = 'Hey';

    res.render('students_views/dashboard', {
        error,
        success
    });
}

const postDashboard = (req, res) => {
    let error = {}
    upload.single('image')(req, res, async (err) => {
        if (err) {
            if (err.code === 'LIMIT_FILE_SIZE') {
                // File too large
                error.large = 'LIMIT_FILE_SIZE'
            }
            if (err.message === 'Only image files are allowed!') {
                error.notanimage = 'Only image files are allowed!'
            }
            error.img_failed = 'Image Upload failed.'
        }
        const id = req.user.student_id
        const date = req.body.date;
        const log = req.body.log;


        let filePath, fileName, fileData;

        if (req.file) {
            filePath = req.file.path;
            fileName = req.file.originalname;
            fileData = fs.readFileSync(filePath);

        } else {
            filePath = null;
            fileName = null;
            fileData = null;
        }
        const post_query = 'INSERT INTO logs(log,date,student_id,image_name,image) VALUES($1,$2,$3,$4,$5)';
        con.query(post_query, [log, date, id, fileName, fileData], (err, result) => {
            if (err) {

                res.redirect('/dashboard')
            } else {
                req.session.success = 'Log submitted successfully'
                res.redirect('/dashboard');
            }
        })
    })
}

const dashboardAlllog = async (req, res) => {
    const month = req.query.month || String(new Date().getMonth() + 1).padStart(2, '0');
    const year = req.query.year || new Date().getFullYear();
    const id = req.user.student_id;
    const fetch_query = 'SELECT * FROM logs WHERE student_id=$1';
    const result = await con.query(fetch_query, [id])
    const logs = result.rows;

    res.render('students_views/all_log', { logs, month, year });
}

const dashboardAttendance = (req, res) => {
    res.render('students_views/attendance');
}

const dashboardCalender = (req, res) => {
    res.render('students_views/calender');
}

const dashboardMonthlyReport = (req, res) => {
    const fetch_query = 'SELECT FROM logs '
    res.render('students_views/monthly_report');
}


module.exports = {
    getDashboard,
    postDashboard,
    dashboardAlllog,
    dashboardAttendance,
    dashboardCalender,
    dashboardMonthlyReport
}