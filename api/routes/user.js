const app = require('express').Router();
const userController = require('../controllers/userController')

const multer = require('multer');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
      cb(null, 'uploads');
  },
  filename: function (req, file, cb) {
      cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage })



//middleware
const {checkUserAuth} = require("../middleware/auth")
const auth = require("../services/roleService")

// app.post("/login",checkUserAuth,auth.superAdmin,superAdminController.viewUserAttendance )




app.post('/register',upload.array('images', 10), userController.userRegister); 
// Get all user
app.get('/usertsGet', userController.getAllData);

// Get a comment by ID
app.get('/userGetById/:ID', userController.getByIdUser);

// Update a comment by ID
app.put('/userUpdate/:ID', upload.array('images', 10),userController.updateUser);

// // Delete a comment by ID
app.delete('/userDelete/:ID', userController.userDelete);
// login.....
app.post('/login', userController.login); 

module.exports = app;
