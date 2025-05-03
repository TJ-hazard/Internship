const express = require("express");
const router = express.Router();
const { userValidationRules } = require('../pakages/validators');
const { validationResult } = require('express-validator');

module.exports = (con) => {
    router.post("/postData", userValidationRules, async (req, res,) => {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const errorObject = {};
            errors.array().forEach(err => {
                errorObject[err.param] = err.msg;
            });
            return res.render('register', { errors: errorObject, old: req.body });
        }

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
            await con.query(insert_query, values);
            res.send('login');
        } catch (err) {
            res.status(500).send(err);
        }



    }
    );


    router.get("/fetchData", (req, res) => {
        const fetch_query = "SELECT * FROM students";
        con.query(fetch_query, (err, result) => {
            if (err) {
                res.status(500).send(err);
            } else {
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