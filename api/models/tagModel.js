const mongoose = require('mongoose');

const tagSchema = new mongoose.Schema({

  TermID: {
    type: Number,
    required: true,
    unique : true
  },
  TermPermalink: {
    type: String,
  },
  TermSlug: {
    type: String,
  },
  Description: String,
  ParentID: {
    type: Number,
  },
  ParentName: String,
  ParentSlug: String,
  Count: {
    type: Number,
  },
  image: {
    type: Object,
  },
  tags: {
    arabic: {
      type: String,
      default: ""
    },
    english: {
      type: String,
      default: ""
    },
    french: {
      type: String,
      default: ""
    },
    espanol: {
      type: String,
      default: ""
    }
  }

},
  { timestamps: true }
);

const Tag = mongoose.model('tag', tagSchema);

module.exports = Tag;




// const mongoose = require('mongoose');

// const tagSchema = new mongoose.Schema({
//     tag : {
//         english: {
//           type: String,
//         },
//         arabic: {
//           type: String,
//         },
//         french: {
//           type: String,
//         },
//         espanol: {
//           type: String,
//         },
//       },
// },
// { timestamps : true }
// );

// const Tag = mongoose.model('tag', tagSchema);

// module.exports = Tag;