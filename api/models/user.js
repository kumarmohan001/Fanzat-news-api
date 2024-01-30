const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    user_nicename: {
        type: String,
    },
    user_email: {
        type: String,
    },
    user_pass: {
        type: String,
    },
    user_url: {
        type: String,
    },
    user_registered: {
        type: Date,
        default: Date.now,
    },
    user_login: {
        type: String,
    },
    images: [
        {
          path: { type: String },
          url: { type: String },
        },
      ],
    role:{
      type:String,
      enum : ["admin","superadmin","editor","user"],
      
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;

// // comment.model.js
// const Sequelize = require('sequelize');

// const sequelize = require('../../config/database');
// const tableName = 'wp_users';

// const user = sequelize.define('user', {
//     ID :{
//         type: Sequelize.BIGINT,
//         primaryKey: true,
//         autoIncrement: true,
//     },
//     user_nicename: {
//         type: Sequelize.STRING,
       
//     },
//       user_email: {
//         type: Sequelize.STRING,
       
//     },
//       user_pass: {
//         type: Sequelize.STRING,
       
//     },
//       user_url: {
//         type: Sequelize.STRING,
       
//     },
//       user_registered: {
//         type: Sequelize.DATE,
//         defaultValue: Sequelize.NOW, 
        
//       },
//       user_login: {
//         type: Sequelize.STRING,
//       }
// }, {
//     tableName,
//     timestamps: false,
// });

// module.exports = user;