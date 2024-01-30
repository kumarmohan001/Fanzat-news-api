// // comment.model.js
// const Sequelize = require('sequelize');

// const sequelize = require('../../config/database');
// const tableName = 'wp_comments';

// const Comment = sequelize.define('Comment', {
//     comment_ID :{
//         type: Sequelize.BIGINT,
//         primaryKey: true,
//         autoIncrement: true,
//     },
//     comment_author: {
//         type: Sequelize.STRING,
       
//     },
//     comment_author_email: {
//         type: Sequelize.STRING,
       
//     },
//     comment_author_url: {
//         type: Sequelize.STRING,
       
//     },
//     comment_content: {
//         type: Sequelize.STRING,
       
//     },
//     comment_date: {
//         type: Sequelize.DATE,
//         defaultValue: Sequelize.NOW, 
        
//       },
//       comment_post_ID: {
//         type: Sequelize.INTEGER,
     
//       },
//       comment_author_IP: {
//         type: Sequelize.STRING,
       
//       },
// }, {
//     tableName,
//     timestamps: false,
// });

// module.exports = Comment;

const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    comment_author: {
        type: String,
    },
    comment_author_email: {
        type: String,
    },
    comment_author_url: {
        type: String,
    },
    comment_content: {
        type: String,
    },
    comment_date: {
        type: Date,
        default: Date.now,
    },
    comment_post_ID: {
        type: String,
    },

    comment_author_IP: {
        type: String,
    },
    
    role:{
        type:String,
      
    },
    comment_status: {
        type: String,
        enum : ["pending","approved","reject"],
        default : "pending"
      },
});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;

