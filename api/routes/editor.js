const app = require('express').Router();
const editorController = require('../controllers/EditorController')

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
// const {checkUserAuth} = require("../middleware/auth")
// const auth = require("../services/roleService")

// app.post("/login",checkUserAuth,auth.superAdmin,superAdminController.viewUserAttendance )


// login.....
app.post('/login', editorController.login);  
// app.post('/register', editorController.adminRegister); 
// // Get a comment by ID
app.get('/editorGetById/:ID', editorController.getByIdEditor);

// // // Update a comment by ID
app.put('/editorUpdate/:ID',upload.array('images', 10), editorController.updateEditor);
// // // change password
app.put('/changePassword/:_id', editorController.ChangePassword);
// // // Delete a comment by ID
// app.delete('/adminDelete/:ID', editorController.adminDelete);


module.exports = app;
