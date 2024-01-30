const mongoose = require('mongoose');

const termRelationshipSchema = new mongoose.Schema({
    object_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post', // Replace 'Post' with the actual model name for the associated object
    },
    term_taxonomy_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TermTaxonomy', // Replace 'TermTaxonomy' with the actual model name for the associated term taxonomy
    },
    term_order: {
        type: Number,
    },
});

const TermRelationship = mongoose.model('TermRelationship', termRelationshipSchema);

module.exports = TermRelationship;

// const Sequelize = require('sequelize');

// const sequelize = require('../../config/database');

// const tableName = 'wp_term_relationships';

// const TermRelationship = sequelize.define('TermRelationship', {
//   object_id :{
//     type: Sequelize.BIGINT,
//     primaryKey: true,
//     autoIncrement: false,
//   },
//   term_taxonomy_id: {
//     type: Sequelize.BIGINT,
//   },
//   term_order: {
//     type: Sequelize.INTEGER,
//   } 
// }, {
//   tableName,
//   timestamps: false
// });

// // eslint-disable-next-line
// TermRelationship.prototype.toJSON = function () {
//   const values = Object.assign({}, this.get());
//   return values;
// };

// module.exports = TermRelationship;
