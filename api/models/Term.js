const mongoose = require('mongoose');

const termSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    slug: {
        type: String,
    },
});

const Term = mongoose.model('Term', termSchema);

module.exports = Term;

// const Sequelize = require('sequelize');

// const sequelize = require('../../config/database');

// const tableName = 'wp_terms';

// const Term = sequelize.define('Term', {
//   term_id :{
//     type: Sequelize.BIGINT,
//     primaryKey: true,
//     autoIncrement: true,
//   },
//   name: {
//     type: Sequelize.STRING,
//     unique: false,
//   },
//   slug: {
//     type: Sequelize.STRING,
//     unique: false,
//   }
// }, {
//   tableName,
//   timestamps: false
// });

// // eslint-disable-next-line
// Term.prototype.toJSON = function () {
//   const values = Object.assign({}, this.get());
//   return values;
// };

// module.exports = Term;
