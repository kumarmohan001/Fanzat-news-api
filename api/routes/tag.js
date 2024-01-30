const express = require('express');
const app = express();
const tagContoller = require('../controllers/tagController');

app.post('/add', tagContoller.addTag);
app.put('/update/:_id', tagContoller.updateTag);
app.get('/getById/:_id', tagContoller.getTagById);
app.get('/getAll', tagContoller.getAllTags);
app.delete('/delete/:_id', tagContoller.tagDelete);
app.get('/search', tagContoller.searchTags);

module.exports = app;