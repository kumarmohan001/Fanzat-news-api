const router = require('express').Router();
const NewsController = require('../controllers/NewsController');

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
router.post('/addPosts', upload.single('featured_media'),  NewsController.addPost);
router.delete('/deletePosts/:_id',  NewsController.postDelete);
router.put('/updatePosts/:_id', upload.single('featured_media'), NewsController.updatePost);
router.get('/getById/:_id',NewsController.getPostById);
router.get('/getAll',NewsController.getAllPosts);
router.get('/getAll/popular',NewsController.getAllPopularPosts);
router.get('/getLatestPost',NewsController.getLatestPost);
router.get('/title/search',NewsController.searchPostsByTitle);
router.get('/getByAuthorId/:_id',NewsController.getAllPostByAuthorId);

 
module.exports = router;
