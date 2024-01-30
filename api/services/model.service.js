const Post = require('../models/Post');
const PostMeta = require('../models/PostMeta');
const Term = require('../models/Term');
const TermTaxonomy = require('../models/TermTaxonomy');
const TermRelationship = require('../models/TermRelationship');
  
const AllModels = () => ({
  Post,
  PostMeta,
  Term,
  TermTaxonomy,
  TermRelationship
});

module.exports = AllModels;
