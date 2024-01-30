const express = require('express');
const app = express();
const starContoller = require('../controllers/starTagController');
const multer = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
      cb(null, 'uploads');
  },
  filename: function (req, file, cb) {
      cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage })


app.post('/add', upload.single("image"), starContoller.addStarTag);
app.put('/update/:_id', upload.single("image"), starContoller.updateStarTag);
app.get('/getById/:_id', starContoller.getStarTagById);
app.get('/getAll', starContoller.getAllStarTags);
app.delete('/delete/:_id', starContoller.starTagDelete);
app.get('/search', starContoller.searchStarTags);

module.exports = app;
