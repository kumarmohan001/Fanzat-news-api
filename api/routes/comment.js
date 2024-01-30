const router = require('express').Router();
const commentController = require('../controllers/CommentController')


//middleware
// const {checkUserAuth} = require("../middleware/auth")
// const auth = require("../services/roleService")

// app.post("/login",checkUserAuth,auth.superAdmin,superAdminController.viewUserAttendance )


router.post('/addComment', commentController.addComment); 
// Get all comments
router.get('/commentsGet', commentController.getAllComments);

// Get a comment by Post_ID
router.get('/commentsGetByPostId/:comment_post_ID', commentController.getCommentByPostId);
// Get a comment by ID
router.get('/commentsGetById/:_id', commentController.getCommentById);

// Update a comment by ID
router.put('/commentsUpdate/:_id', commentController.updateComment);

// Delete a comment by ID
router.delete('/commentsDelete/:_id', commentController.deleteComment);

module.exports = router;
