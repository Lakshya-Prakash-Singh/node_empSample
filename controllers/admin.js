const fs = require('fs');
const globals = require("../globals.json");
const globalsFunction = require("../globalFunc");
var md5 = require('md5');
const { check, validationResult } = require('express-validator'); 
const { json } = require('body-parser');
const mongodb = require('mongodb');
const multer = require('multer');
var isDataAddCalled = false;


module.exports = {
    
    
    addEmployee: async (req, res, next) => {
        try {            
            const validationError = validationResult(req); 
            if (!validationError.isEmpty()) {
                globalsFunction.logValidationErrors(validationError);
                res.json({status: globals.responses.errorStatus, message: validationError.errors[0].msg, data: globals.responses.commonBlankData, errorMessage: validationError.errors[0].msg});
                return false;
            } 
            else {
                globals._dbs.collection("Employees").find({$or: [{Email: req.body.Email},{PhoneNumber: req.body.PhoneNumber}]}).toArray(function(err, result) {
                    if (err) throw err;
                    if (result.length > 0) {
                        globalsFunction.logValidationErrors("User Email or Mobile Number Already Exists!");
                        res.json({status: globals.responses.errorStatus, message: "User Email or Mobile Number Already Exists!", data: globals.commonBlankData});
                        return false;
                    }
                    else {    
                        if (req.files?.length > 0) {    
                            for (i = 0;i < req.files?.length;i++) {
                                if (req.files[i].fieldname == "ProfilePic" && req.files[i].size < 6000000) {
                                    var fileName = req.files[i].fieldname + "_" + Date.now() + "_" + req.files[i].originalname;
                                    isDataAddCalled = true;
                                    fs.writeFile('./assets/images/ProfilePic/' + fileName, req.files[i].buffer, (err) => {
                                        if (!err) {
                                            globals._dbs.collection("Employees").insertOne({"EmployeeNumber": globalsFunction.getSixDigitOTP(),"FirstName": req.body.FirstName,"LastName": req.body.LastName,"Email": req.body.Email,"PhoneNumber": req.body.PhoneNumber,"AltPhoneNumber": req.body.AlternateNumber,"Designation": req.body.Designation,"TempAddrLine1": req.body.TempAddrLine1,"TempAddrLine2": req.body.TempAddrLine2,"TempAddrPincode": req.body.TempAddrPincode,"IsTempAndPermAddrSame": req.body.IsTempAndPermAddrSame,"PermAddrLine1": req.body.PermAddrLine1,"PermAddrLine2": req.body.PermAddrLine2,"PermAddrPincode": req.body.PermAddrPincode,"ProfilePic":"/images/ProfilePic/" + fileName}, function(err, result) {  
                                                if (err) throw err;  
                                                if (result.insertedCount) {
                                                    res.json({status: globals.responses.successStatus, message: "Employee Added Successfully!", data: result.ops});
                                                    return false;
                                                }
                                                else {
                                                    globalsFunction.logErrors(err);
                                                    res.json({status: globals.responses.errorStatus, message: globals.responses.commonErrorMessage, data: globals.responses.commonBlankData, errorMessage: "Error in inserting data to DBs."});
                                                    return false;
                                                }
                                            }); 
                                        }   
                                        else {
                                            globals._dbs.collection("Employees").insertOne({"EmployeeNumber": globalsFunction.getSixDigitOTP(),"FirstName": req.body.FirstName,"LastName": req.body.LastName,"Email": req.body.Email,"PhoneNumber": req.body.PhoneNumber,"AltPhoneNumber": req.body.AlternateNumber,"Designation": req.body.Designation,"TempAddrLine1": req.body.TempAddrLine1,"TempAddrLine2": req.body.TempAddrLine2,"TempAddrPincode": req.body.TempAddrPincode,"IsTempAndPermAddrSame": req.body.IsTempAndPermAddrSame,"PermAddrLine1": req.body.PermAddrLine1,"PermAddrLine2": req.body.PermAddrLine2,"PermAddrPincode": req.body.PermAddrPincode,"ProfilePic":""}, function(err, result) {  
                                                isDataAddCalled = true;
                                                if (err) throw err;  
                                                if (result.insertedCount) {
                                                    res.json({status: globals.responses.successStatus, message: "Employee Added Successfully!", data: result.ops});
                                                    return false;
                                                }
                                                else {
                                                    globalsFunction.logErrors(err);
                                                    res.json({status: globals.responses.errorStatus, message: globals.responses.commonErrorMessage, data: globals.responses.commonBlankData, errorMessage: "Error in inserting data to DBs."});
                                                    return false;
                                                }
                                            }); 
                                        }
                                    });
                                }
                                else if (!isDataAddCalled && ((req.files?.length - 1) == i)) {  
                                    globals._dbs.collection("Employees").insertOne({"EmployeeNumber": globalsFunction.getSixDigitOTP(),"FirstName": req.body.FirstName,"LastName": req.body.LastName,"Email": req.body.Email,"PhoneNumber": req.body.PhoneNumber,"AltPhoneNumber": req.body.AlternateNumber,"Designation": req.body.Designation,"TempAddrLine1": req.body.TempAddrLine1,"TempAddrLine2": req.body.TempAddrLine2,"TempAddrPincode": req.body.TempAddrPincode,"IsTempAndPermAddrSame": req.body.IsTempAndPermAddrSame,"PermAddrLine1": req.body.PermAddrLine1,"PermAddrLine2": req.body.PermAddrLine2,"PermAddrPincode": req.body.PermAddrPincode,"ProfilePic":""}, function(err, result3) {  
                                        isDataAddCalled = true;
                                        if (err) throw err;  
                                        if (result3.insertedCount) {
                                            isDataAddCalled = true;
                                            globalsFunction.logValidationErrors("Employee Created Without Image Upload!");
                                            res.json({status: globals.responses.successStatus, message: "Employee Created Without Image Upload!", data: result3.ops});
                                            return false;
                                        }
                                        else {
                                            globalsFunction.logErrors(err);
                                            res.json({status: globals.responses.errorStatus, message: globals.responses.commonErrorMessage, data: globals.responses.commonBlankData, errorMessage: "Error in inserting data to DBs."});
                                            return false;
                                        }
                                    }); 
                                }  
                            }    
                        }
                        else if (!isDataAddCalled) {  
                            globals._dbs.collection("Employees").insertOne({"EmployeeNumber": globalsFunction.getSixDigitOTP(),"FirstName": req.body.FirstName,"LastName": req.body.LastName,"Email": req.body.Email,"PhoneNumber": req.body.PhoneNumber,"AltPhoneNumber": req.body.AlternateNumber,"Designation": req.body.Designation,"TempAddrLine1": req.body.TempAddrLine1,"TempAddrLine2": req.body.TempAddrLine2,"TempAddrPincode": req.body.TempAddrPincode,"IsTempAndPermAddrSame": req.body.IsTempAndPermAddrSame,"PermAddrLine1": req.body.PermAddrLine1,"PermAddrLine2": req.body.PermAddrLine2,"PermAddrPincode": req.body.PermAddrPincode,"ProfilePic":""}, function(err, result3) {  
                                isDataAddCalled = true;
                                if (err) throw err;  
                                if (result3.insertedCount) {
                                    isDataAddCalled = true;
                                    globalsFunction.logValidationErrors("Employee Created Without Image Upload!");
                                    res.json({status: globals.responses.successStatus, message: "Employee Created Without Image Upload!", data: result3.ops});
                                    return false;
                                }
                                else {
                                    globalsFunction.logErrors(err);
                                    res.json({status: globals.responses.errorStatus, message: globals.responses.commonErrorMessage, data: globals.responses.commonBlankData, errorMessage: "Error in inserting data to DBs."});
                                    return false;
                                }
                            }); 
                        }                         
                    }   
                });
            }
        }
        catch (Error) {
            globalsFunction.logErrors(Error);
            res.json({status: globals.responses.errorStatus, message: globals.responses.commonErrorMessage, data: globals.responses.commonBlankData, errorMessage: Error.message.toString()});
            return false;
        }
    },

    login: async (req, res) => {
        try {
            const validationError = validationResult(req); 
            if (!validationError.isEmpty()) { 
                globalsFunction.logValidationErrors(validationError);
                res.json({status: globals.responses.errorStatus, message: validationError.errors[0].msg, data: globals.responses.commonBlankData, errorMessage: validationError.errors[0].msg});
                return false;
            }
            else {
                var data = { Email: req.body.Email, Password: md5(req.body.Password) }
                globals._dbs.collection("Employees").find(data).toArray(function(err, result) {
                    if (err) throw err;
                    if (result.length <= 0) {
                        globalsFunction.logValidationErrors("Invalid Login Credentials!");
                        res.json({status: globals.responses.errorStatus, message: "Invalid Login Credentials!", data: globals.commonBlankData});
                        return false;
                    }
                    else {              
                        res.json({status: globals.responses.successStatus, message: globals.responses.commonSuccessMessage, data: result});
                        return false;
                    } 
                })
            }
        }
        catch (Error) {
            globalsFunction.logErrors(Error);
            res.json({status: globals.responses.errorStatus, message: globals.responses.commonErrorMessage, data: globals.responses.commonBlankData, errorMessage: Error.message.toString()});
            return false;
        }
    },

    emplist: async (req, res) => {
        try {
            var pageNumber = (req.body.PageNumber)? req.body.PageNumber: 1;
            pageNumber = (pageNumber - 1) * 10;           
            searchString = new RegExp(req.body.searchString, 'i');            
            var data = (req.body.searchString)? {$or: [{FirstName: { $regex: searchString } }, {LastName: { $regex: searchString } }, {Email: { $regex: searchString } }, {PhoneNumber: { $regex: searchString } }]}: {};
            dataCount = await globals._dbs.collection("Employees").find(data).count(); 
            globals._dbs.collection("Employees").find(data).sort({_id: -1}).skip(pageNumber).limit(10).toArray(function(err, result) {
                if (err) throw err;
                if (result.length <= 0) {
                    globalsFunction.logValidationErrors("Data Not Found!");
                    res.json({status: globals.responses.errorStatus, message: "Data Not Found!", data: data});
                    return false;
                }
                else {              
                    res.json({status: globals.responses.successStatus, message: globals.responses.commonSuccessMessage, data: result, dataCount: dataCount});
                    return false;
                } 
            });
        }
        catch (Error) {
            globalsFunction.logErrors(Error);
            res.json({status: globals.responses.errorStatus, message: globals.responses.commonErrorMessage, data: globals.responses.commonBlankData, errorMessage: Error.message.toString()});
            return false;
        }
    },

    deleteEmployee:  async (req, res) => {
        try {
            console.log(req.body);
            globals._dbs.collection('Employees', function(err, user) {
                user.deleteOne({_id: new mongodb.ObjectID(req.body.ID)});          
                if (err) throw err;        
                res.json({status: globals.responses.successStatus, message: globals.responses.commonSuccessMessage, data: globals.commonBlankData});
                return false;
            });
        }
        catch (Error) {
            globalsFunction.logErrors(Error);
            res.json({status: globals.responses.errorStatus, message: globals.responses.commonErrorMessage, data: globals.responses.commonBlankData, errorMessage: Error.message.toString()});
            return false;
        }
    },

    getEmployee:  async (req, res) => {
        try {            
            globals._dbs.collection("Employees").find({_id: new mongodb.ObjectID(req.params.EmployeeID)}).toArray(function(err, result) {
                if (err) throw err;
                if (result.length <= 0) {
                    globalsFunction.logValidationErrors("Invalid Employee!");
                    res.json({status: globals.responses.errorStatus, message: "Invalid Employee!", data: globals.commonBlankData});
                    return false;
                }
                else {              
                    res.json({status: globals.responses.successStatus, message: globals.responses.commonSuccessMessage, data: result});
                    return false;
                } 
            });
        }
        catch (Error) {
            globalsFunction.logErrors(Error);
            res.json({status: globals.responses.errorStatus, message: globals.responses.commonErrorMessage, data: globals.responses.commonBlankData, errorMessage: Error.message.toString()});
            return false;
        }
    },

    empUpdate:  async (req, res) => {
        try {    
            const validationError = validationResult(req); 
            if (!validationError.isEmpty()) {
                globalsFunction.logValidationErrors(validationError);
                res.json({status: globals.responses.errorStatus, message: validationError.errors[0].msg, data: globals.responses.commonBlankData, errorMessage: validationError.errors[0].msg});
                return false;
            } 
            else {                
                globals._dbs.collection("Employees").find({$or: [{Email: req.body.Email},{PhoneNumber: req.body.PhoneNumber}]}).toArray(function(err, result) {
                    if (err) throw err;
                    if (result.length > 1 || (result.length == 1 && result._id == new mongodb.ObjectID(req.params.EmployeeID))) {                        
                        globalsFunction.logValidationErrors("User Email or Mobile Number Already Exists!");
                        res.json({status: globals.responses.errorStatus, message: "User Email or Mobile Number Already Exists!", data: result});
                        return false;
                    }
                    else {
                        if (req.files?.length <= 0 || !req.files?.length) {
                            globals._dbs.collection("Employees", function(err, user) {
                                user.updateOne({_id: new mongodb.ObjectID(req.params.EmployeeID)},{$set: {"FirstName": req.body.FirstName,"LastName": req.body.LastName,"Email": req.body.Email,"PhoneNumber": req.body.PhoneNumber,"AltPhoneNumber": req.body.AlternateNumber,"Designation": req.body.Designation,"TempAddrLine1": req.body.TempAddrLine1,"TempAddrLine2": req.body.TempAddrLine2,"TempAddrPincode": req.body.TempAddrPincode,"IsTempAndPermAddrSame": req.body.IsTempAndPermAddrSame,"PermAddrLine1": req.body.PermAddrLine1,"PermAddrLine2": req.body.PermAddrLine2,"PermAddrPincode": req.body.PermAddrPincode}});
                                if (err) throw err;
                                res.json({status: globals.responses.successStatus, message: globals.responses.commonSuccessMessage, data: globals.commonBlankData});
                                return false;
                            }); 
                        }
                        else {
                            for (i = 0;i < req.files?.length;i++) {
                                if (req.files[i].fieldname == "ProfilePic" && req.files[i].size < 6000000) {
                                    var fileName = req.files[i].fieldname + "_" + Date.now() + "_" + req.files[i].originalname
                                    fs.writeFile('./assets/images/ProfilePic/' + fileName, req.files[i].buffer, (err) => {
                                        if (err) throw err;
                                        globals._dbs.collection("Employees", function(err, user) {
                                            user.updateOne({_id: new mongodb.ObjectID(req.params.EmployeeID)},{$set: {"ProfilePic": "/images/ProfilePic/" + fileName }});
                                            if (err) {};
                                            return false;
                                        });
                                    });
                                }
                                if ((i + 1) == req.files?.length) {
                                    globals._dbs.collection("Employees", function(err, user) {
                                        user.updateOne({_id: new mongodb.ObjectID(req.params.EmployeeID)},{$set: {"FirstName": req.body.FirstName,"LastName": req.body.LastName,"Email": req.body.Email,"PhoneNumber": req.body.PhoneNumber,"AltPhoneNumber": req.body.AlternateNumber,"Designation": req.body.Designation,"TempAddrLine1": req.body.TempAddrLine1,"TempAddrLine2": req.body.TempAddrLine2,"TempAddrPincode": req.body.TempAddrPincode,"IsTempAndPermAddrSame": req.body.IsTempAndPermAddrSame,"PermAddrLine1": req.body.PermAddrLine1,"PermAddrLine2": req.body.PermAddrLine2,"PermAddrPincode": req.body.PermAddrPincode}});
                                        if (err) throw err;
                                        res.json({status: globals.responses.successStatus, message: globals.responses.commonSuccessMessage, data: globals.commonBlankData});
                                        return false;
                                    });
                                }
                            }   
                        };
                    }
                });
            };
        }
        catch (Error) {
            globalsFunction.logErrors(Error);
            res.json({status: globals.responses.errorStatus, message: globals.responses.commonErrorMessage, data: globals.responses.commonBlankData, errorMessage: Error.message.toString()});
            return false;
        }
    },

    designations: async (req, res) => {        
        try {
            const validationError = validationResult(req); 
            if (!validationError.isEmpty()) { 
                globalsFunction.logValidationErrors(validationError);
                res.json({status: globals.responses.errorStatus, message: validationError.errors[0].msg, data: globals.responses.commonBlankData, errorMessage: validationError.errors[0].msg});
                return false;
            }
            else {
                globals._dbs.collection("Designation").find({}).toArray(function(err, result) {
                    if (err) throw err;
                    if (result.length <= 0) {
                        globalsFunction.logValidationErrors("No Designations Available!");
                        res.json({status: globals.responses.errorStatus, message: "No Designation Available!", data: globals.commonBlankData});
                        return false;
                    }
                    else {              
                        res.json({status: globals.responses.successStatus, message: globals.responses.commonSuccessMessage, data: result});
                        return false;
                    } 
                })
            }
        }
        catch (Error) {
            globalsFunction.logErrors(Error);
            res.json({status: globals.responses.errorStatus, message: globals.responses.commonErrorMessage, data: globals.responses.commonBlankData, errorMessage: Error.message.toString()});
            return false;
        }
    }

}