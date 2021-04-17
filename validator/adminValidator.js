const { check, validationResult } = require('express-validator'); 
const globals = require("../globals.json");

module.exports = {
    addEmployee: 
    [
        check('FirstName', 'First Name length should be 3 to 20 characters') 
                        .isLength({ min: 3, max: 20 }),
        check('LastName', 'Last Name length should be 3 to 20 characters') 
                        .isLength({ max: 20 }), 
        check('PhoneNumber', 'Mobile number should contains 10 digits') 
                        .isLength(10).isNumeric(),
        check('AlternateNumber', 'Alternate number should contains 10 digits')
                        .optional({ checkFalsy: true }).isLength(10).isNumeric(),
        check('Email', 'Email length should be 3 to 50 characters') 
                        .isEmail().isLength({ max: 50 }), 
        check('TempAddrLine1', 'TempAddrLine1 is mandatory with max 100 characters')
                        .notEmpty().isLength({ max: 100 }),
        check('TempAddrLine2', 'TempAddrLine2 is mandatory with max 100 characters') 
                        .notEmpty().isLength({ max: 100 }), 
        check('TempAddrPincode', 'TempAddrPincode should contains 6 digits') 
                        .isLength(6).isNumeric(),
        check('IsTempAndPermAddrSame', 'IsTempAndPermAddrSame is required')
                        .notEmpty(),
        check('PermAddrLine1', 'PermAddrLine1 is mandatory with max 100 characters')
                        .notEmpty().isLength({ max: 100 }),
        check('PermAddrLine2', 'PermAddrLine2 is mandatory with max 100 characters') 
                        .notEmpty().isLength({ max: 100 }), 
        check('PermAddrPincode', 'PermAddrPincode should contains 6 digits') 
                        .isLength(6).isNumeric(),
        check('Designation', 'Designation is required') 
                        .notEmpty()

    ],
    login: [
        check('Email', 'Email length should be 3 to 50 characters') 
                        .isEmail().isLength({ min: 3, max: 50 }), 
        check('Password', 'Password length should be min. 8 to characters') 
                        .isLength({ min: 8 }) 
    ]
}