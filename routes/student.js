const express = require("express");
const router = express.Router();
const { userValidationRules } = require('../pakages/validators');
const { validationResult } = require('express-validator');
const { con } = require('../pakages/db.js');

module.exports = () => {

    router.post("/postData", userValidationRules, (req, res,) => {

        console.log(req.body);


        const errors = validationResult(req);
        // if (!errors.isEmpty()) {
        //     const alert = errors.array();
        //     return res.render('register', { alert });
        // };
        const {
            student_id,
            full_name,
            matric_no,
            department,
            level,
            faculty,
            phone_number,
            email_address,
            school,
        } = req.body;

        const values = [
            student_id,
            full_name,
            matric_no,
            department,
            level,
            faculty,
            phone_number,
            email_address,
            school,
        ];
        const insert_query = "INSERT INTO students(student_id,full_name,matric_no,department,level,faculty,phone_number,email_address,school) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9)";
        try {
            console.log("Before insert")
            con.query(insert_query, values, (err, result) => console.log("err>>", err));
            res.render('index');
            // res.send('login');
        } catch (err) {
            console.log("err>>", err)
            // res.status(500).send(err);
        }



    }
    );


    router.get("/fetchData", (req, res) => {
        const fetch_query = "SELECT * FROM students";
        con.query(fetch_query, (err, result) => {
            if (err) {
                res.status(500).send(err);
            } else {
                res.render('index',)
                res.send(result.rows);
            }
        });
    });

    router.get("/fetchDatabyId/:student_id", (req, res) => {
        {
            const student_id = req.params.student_id;
            const fetch_query = "SELECT * FROM students WHERE student_id = $1";
            con.query(fetch_query, [student_id], (err, result) => {
                if (err) {
                    res.status(500).send(err);
                } else {
                    res.send(result.rows[0]);
                }
            });

        }
    });

    router.put("/update/:student_id", (req, res) => {
        const student_id = req.params.student_id;
        const {
            full_name,
            matric_no,
            department,
            level,
            faculty,
            phone_number,
            email_address,
            school,
        } = req.body;

        const values = [
            full_name,
            matric_no,
            department,
            level,
            faculty,
            phone_number,
            email_address,
            school,
            student_id
        ];

        const update_query = "UPDATE students SET full_name = $1, matric_no = $2, department = $3, level = $4, faculty = $5, phone_number = $6, email_address = $7, school = $8 WHERE student_id = $9";

        con.query(update_query, values, (err, result) => {
            if (err) {
                res.status(500).send(err);
            } else {
                res.send("Updated");
            }
        });
    });

    router.delete("/deletebyId/:student_id", (req, res) => {
        const student_id = req.params.student_id;
        const delete_query = "DELETE FROM students WHERE student_id =$1";
        con.query(delete_query, [student_id], (err, result) => {
            if (err) {
                res.status(500).send(err);
            } else {
                res.send("Deleted Succesfully");
            }
        });
    });
    return router;
};