const express = require('express');
const { body } = require('express-validator');
const multer = require('multer');
const adminController = require('../controllers/admin');
const adminValidator = require('../validator/adminValidator');
var uploadImages = multer({ dest: './' });
var router = express.Router();


router.post('/login', adminValidator.login, adminController.login);


router.post('/emplist', adminController.emplist);
router.post('/addEmployee', adminValidator.addEmployee, adminController.addEmployee);

router.put('/updtEmployee/:EmployeeID', adminValidator.addEmployee, adminController.empUpdate);

router.delete("/employee", adminController.deleteEmployee);

router.post('/emplist/:EmployeeID', adminController.getEmployee);



router.post('/getDesignations', adminController.designations);

// router.post('/registration', adminValidator.registration, adminController.registration);
// router.post('/adduser', adminValidator.adduser, adminController.adduser);
// router.post('/login', adminValidator.login, adminController.login);
// router.post('/userlist', adminController.userlist);
// router.post('/userlist/:UserID', adminController.user);

// router.put('/userlist/:UserID', adminController.userUpdate);

// router.delete("/user", adminController.deleteUser);

module.exports = router;