const express = require('express');
const app = express();
const CategoryContoller = require('../controllers/CategoryController');

app.post('/add', CategoryContoller().create);

app.get('/getAll', (req, res) => CategoryContoller().getAll(req, res));

app.get('/getById/:_id', (req, res) => CategoryContoller().get(req, res));

app.put('/update/:_id', (req, res) => CategoryContoller().update(req, res));

app.delete('/delete/:_id', (req, res) => CategoryContoller().destroy(req, res));

app.get('/getAll', CategoryContoller.getAllCategories);

app.get('/singleGet/:id', CategoryContoller.getById);


module.exports = app;

