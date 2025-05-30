const express = require("express");
const router = express.Router();
const { studentValidationRules } = require('../pakages/validators');
const { validationResult } = require('express-validator');
const { con } = require('../pakages/db.js');




module.exports = () => {





    router.post("/postData", studentValidationRules, async (req, res) => {

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

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const alert = errors.array();
            return res.render('register', { alert });
        };



        const insert_query = "INSERT INTO students(student_id,full_name,matric_no,department,levels,faculty,phone_number,email,school) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9)";


        try {
            await con.query(insert_query, values, (err, result) => {
                res.redirect('/login');
            })

        } catch (err) {
            console.log("err>>", err)
            // res.status(500).send(err);
        }
    }
    );

    router.post('/login', async (req, res) => {
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

        try {
            const result = await con.query('SELECT * FROM students WHERE student_id =$1', [student_id]);
            const user = result.rows[0];
            if (!user) {
                return res.redirect('/login')
            }

            req.session.user = {}
        } catch (error) {

        }
    });


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