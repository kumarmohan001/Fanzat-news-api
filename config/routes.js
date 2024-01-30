/**
 * Import Route files and set in express middleware
 */

// eslint-disable-next-line global-require
const categories = require('../api/routes/category');
// eslint-disable-next-line global-require
const news = require('../api/routes/News');
// comment
const comment = require('../api/routes/comment');
// use.................
const user = require('../api/routes/user');
// superAdmin.....
const superAdmin = require('../api/routes/superAdmin');
// Admin
const admin = require('../api/routes/admin');
// Admin
const editor = require('../api/routes/editor');
// Tag
const tag = require('../api/routes/tag');
// star tag...
const starTag = require('../api/routes/starTag');
// notification................
const notification = require('../api/routes/notification');



exports.set_routes = (app) => {
  app.use('/api/categories', categories);
  app.use('/api/EnNews', news);
  app.use('/api/comment', comment);
  app.use('/api/user', user);
  app.use('/api/superAdmin', superAdmin);
  app.use('/api/admin', admin);
  app.use('/api/editor', editor);
  app.use('/api/tag', tag);
  app.use('/api/starTag', starTag);
  app.use('/api/notification', notification);


};
