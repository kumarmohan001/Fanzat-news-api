const app = require('express').Router();
const adminController = require('../controllers/superAdminController');
const auth = require('../policies/auth.policy');
const multer = require('multer');
const {checkUserAuth} = require("../middleware/auth")
// const auth = require("../services/roleService")

// app.post("/login",checkUserAuth,auth.superAdmin,superAdminController.viewUserAttendance )


app.post('/login', adminController.login); 
app.get('/admintsGet', adminController.getAllData);
app.get('/adminGetById/:ID', adminController.getByIdadmin);
app.put('/adminUpdate/:ID', adminController.updateAdmin);
app.delete('/adminDelete/:ID', adminController.adminDelete);
app.post('/login', adminController.login); 
app.get('/filter/post', adminController.filteredPost); 
app.get('/get/related/category/:categoryId',adminController.getPostsByCategory);
app.put('/change/password/:_id',adminController.changePassword);
app.get('/get/latest/master/category/:masterCategoryId',adminController.getLatestMasterCategoryPost);

module.exports = app;