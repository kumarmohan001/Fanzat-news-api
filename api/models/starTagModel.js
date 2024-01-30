const mongoose = require('mongoose');

const starTagSchema = new mongoose.Schema({
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
  starTags: {
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

const starTag = mongoose.model('startag', starTagSchema);

module.exports = starTag;

