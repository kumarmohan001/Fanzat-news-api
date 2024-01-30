// CommentController.js
const { Op } = require('sequelize');
const Comment = require('../models/Comment');
const response = require('../services/respones')
const { emitMessage } = require('../services/socket');

module.exports.addComment = async (req, res) => {
  try {
    const { comment_author, comment_author_email, comment_author_url, comment_content,comment_post_ID ,role} = req.body;

    if (!comment_author || !comment_author_email || !comment_author_url || !comment_content ) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    const comment_author_IP = req.ip;
    const newComment = await Comment({
      comment_author,
      comment_author_email,
      comment_author_url,
      comment_content,
      comment_date: new Date(), 
      comment_post_ID,
      comment_author_IP,
      role
    });
    const notificationData = {
      commentId:newComment._id , 
      message: `Send The Comment  By ${comment_author_email} .`,
   
  };

  emitMessage(notificationData);
    await newComment.save()

    return res.status(201).json(newComment.toJSON());
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Get all comments
module.exports.getAllComments = async (req, res) => {
    try {
      const comments = await Comment.find();
      return res.status(200).json(comments);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  

// comment get by postId...........................................
  module.exports.getCommentByPostId = async (req, res) => {
    const { comment_post_ID } = req.params;
  
    try {
      const comment = await Comment.find({ comment_post_ID: comment_post_ID })
      if (!comment) {
        return res.status(404).json({ error: 'Comment not found' });
      }
      
      res.status(200).json(comment);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  
  // comment get by Id...........................................
  module.exports.getCommentById = async (req, res) => {
    const { _id } = req.params;
  
    try {
      const comment = await Comment.findById({ _id: _id })
      if (!comment) {
        return res.status(404).json({ error: 'Comment not found' });
      }
      
      res.status(200).json(comment);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  
  // Update a comment by ID
  module.exports.updateComment = async (req, res) => {
    const { _id } = req.params;
    const { comment_author, comment_author_email, comment_author_url, comment_content,comment_status} = req.body;
  
    try {
      const comment = await Comment.findByIdAndUpdate(_id);
      if (!comment) {
        return res.status(404).json({ error: 'Comment not found' });
      }
      comment.comment_author = comment_author || comment.comment_author;
      comment.comment_author_email = comment_author_email || comment.comment_author_email;
      comment.comment_author_url = comment_author_url || comment.comment_author_url;
      comment.comment_content = comment_content || comment.comment_content;
      comment.comment_status = comment_status || comment.comment_status;
  
      await comment.save();
      return res.status(200).json(comment);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  

  module.exports.deleteComment = async (req, res) => {
    const { _id } = req.params;
  
    try {
      const comment = await Comment.findByIdAndDelete(_id);
      if (!comment) {
        return res.status(404).json({ error: 'Comment not found' });
      }
      return res.status(200).json({ message: 'Comment deleted successfully' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  