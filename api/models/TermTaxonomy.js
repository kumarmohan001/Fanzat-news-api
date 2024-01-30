const mongoose = require('mongoose');

const termTaxonomySchema = new mongoose.Schema({
    term_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Term', // Replace 'Term' with the actual model name for the associated term
    },
    taxonomy: {
        type: String,
    },
    parent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TermTaxonomy', // Replace 'TermTaxonomy' with the actual model name for the parent term taxonomy
    },
});

const TermTaxonomy = mongoose.model('TermTaxonomy', termTaxonomySchema);

module.exports = TermTaxonomy;

// const Sequelize = require('sequelize');

// const sequelize = require('../../config/database');

// const tableName = 'wp_term_taxonomy';

// const TermTaxonomy = sequelize.define('TermTaxonomy', {
//   term_taxonomy_id :{
//     type: Sequelize.BIGINT,
//     primaryKey: true,
//     autoIncrement: true,
//   },
//   term_id: {
//     type: Sequelize.BIGINT,
//     unique: false,
//   },
//   taxonomy: {
//     type: Sequelize.STRING,
//     unique: false,
//   },
//   parent: {
//     type: Sequelize.BIGINT,
//     unique: false,
//   }
// }, {
//   tableName,
//   timestamps: false
// });

// // eslint-disable-next-line
// TermTaxonomy.prototype.toJSON = function () {
//   const values = Object.assign({}, this.get());
//   return values;
// };

// module.exports = TermTaxonomy;
