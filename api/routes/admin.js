const app = require('express').Router();
const adminController = require('../controllers/adminController')

//middleware
// const {checkUserAuth} = require("../middleware/auth")
// const auth = require("../services/roleService")

// app.post("/login",checkUserAuth,auth.superAdmin,superAdminController.viewUserAttendance )


// login.....
app.post('/login', adminController.login);  
// app.post('/register', adminController.adminRegister); 
// // Get a comment by ID
app.get('/adminGetById/:ID', adminController.getByIdAdmin);

// // Update a comment by ID
app.put('/adminUpdate/:ID', adminController.updateAdmin);

// // // Delete a comment by ID
// app.delete('/adminDelete/:ID', adminController.adminDelete);

app.put('/adminPasswordChange/:_id', adminController.adminChangePassword);


module.exports = app;
