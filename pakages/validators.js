
const { body } = require('express-validator');

const studentValidationRules = [
    body('student_id').trim().notEmpty().withMessage("Student ID is required"),
    body('full_name').trim().notEmpty().withMessage(" Full Name is required").isLength({ min: 3 }).withMessage(" Full Name must be at least 10 characters"),
    body('matric_no').trim().notEmpty().withMessage("Matric Number is required").isLength({ min: 3 }).withMessage("Matric Number must be at least 10 characters"),
    body('department').trim().notEmpty().withMessage("Department is required").isLength({ min: 3 }).withMessage("Department must be at least 10 characters"),
    body('level').trim().notEmpty().withMessage("Level is required").isLength({ min: 3 }).withMessage("Level must be at least 3 characters"),
    body('faculty').trim().notEmpty().withMessage("Faculty is required").isLength({ min: 3 }).withMessage("Faculty must be at least 10 characters"),
    body('phone_number').trim().notEmpty().withMessage("Phone Number is required").isLength({ min: 3 }).withMessage("Phone Number must be at least 10 characters"),
    body('email_address').trim().notEmpty().withMessage("Email is required").isLength({ min: 3 }).withMessage("Email must be at least 10 characters").isEmail().withMessage("Enter a Valid Email Address"),
    body('school').trim().notEmpty().withMessage("School Full Name is required").isLength({ min: 3 }).withMessage("School Full Name must be at least 10 characters"),
];


const userValidationRules = [
    body('username').trim().notEmpty().withMessage('Username is required'),
    body('email').trim().notEmpty().withMessage('Email is Required').isEmail().withMessage('Enter a valid Email Address'),
    body('password').trim().notEmpty().withMessage('Password is required')
];



// Exports
module.exports = {
    userValidationRules,
    studentValidationRules
};