const mongoose = require('mongoose');

const postMetaSchema = new mongoose.Schema({
    post_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post', // Replace 'Post' with the actual model name for the associated post
    },
    meta_key: {
        type: String,
    },
    meta_value: {
        type: String,
    },
});

const PostMeta = mongoose.model('PostMeta', postMetaSchema);

module.exports = PostMeta;

// const Sequelize = require('sequelize');

// const sequelize = require('../../config/database');

// const tableName = 'wp_postmeta';

// const PostMeta = sequelize.define('PostMeta', {
//   meta_id :{
//     type: Sequelize.BIGINT,
//     primaryKey: true,
//     autoIncrement: true,
//   },
//   post_id: {
//     type: Sequelize.BIGINT,
//     unique: false,
//   },
//   meta_key: {
//     type: Sequelize.STRING,
//     unique: false,
//   },
//   meta_value: {
//     type: Sequelize.TEXT('long')
//   },
// }, {
//   tableName,
//   timestamps: false
// });

// // eslint-disable-next-line
// PostMeta.prototype.toJSON = function () {
//   const values = Object.assign({}, this.get());
//   return values;
// };

// module.exports = PostMeta;
