const response = require("../services/respones");
const Category = require('../models/category');


const CategoryController = () => {
  
  const create = async (req, res) => {
    try {
      const categoryExist = await Category.findOne({
        'name.english': req.body.name.english,
        type: req.body.type || 0,
      });
  
      if (categoryExist) {
        return res.status(400).json({ msg: 'Category name already exists' });
      }
  
      let slug = req.body.name.english
        .toLowerCase()
        .replace(/ /g, '-')
        .replace(/[^\w-]+/g, '');
  
      let existingCategory = await Category.findOne({ slug: slug });
  
      if (existingCategory) {
        const lastCategory = await Category.findOne({}, {}, { sort: { createdAt: -1 } });
        slug = slug + '-' + (lastCategory ? lastCategory.createdAt.getTime() : 1);
      }
      const idValidation = await Category.validateIdUniqueness(req.body.id);
  
      if (!idValidation.valid) {
        return res.status(400).json({ msg: idValidation.message });
      }
  
      req.body.slug = slug;
      const category = await Category.create(req.body);
  
      if (!category) {
        return res.status(400).json({
          msg: 'Bad Request: Model not found',
        });
      }
  
      return res.status(201).json({
        category,
      });
    } catch (err) {
      const errorMessage = err.message || 'Internal Server Error';
      return res.status(500).json({ msg: errorMessage });
    }
  };
  

  const getAll = async (req, res) => {
    try {
      const { type, front } = req.query;
  
      let query = {};
  
      if (type) {
        query.type = type;
      }
  
      if (front && front.toLowerCase() === 'yes') {
        query.status = {
          $ne: 'inactive',
        };
      }
  
      const categories = await Category.find(query).sort({ cat_order: 1 });
  
      return res.status(200).json({
        categories,
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        msg: 'Internal server error',
      });
    }
  };
  
  
  const get = async (req, res) => {
    try {
      const { id } = req.params;
  
      const category = await Category.findOne({ id: id });
  
      if (!category) {
        return res.status(400).json({
          msg: 'Bad Request: Model not found',
        });
      }
  
      return res.status(200).json({
        data: category,
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        msg: 'Internal server error',
      });
    }
  };

  const update = async (req, res) => {
    try {
      const {_id} = req.params;

      const existingCategory = await Category.findById({_id:_id});

      if (!existingCategory) {
        return res.status(404).json({ msg: 'Category not found' });
      }

      const updateFields = {};

      if (req.body.name) {
        updateFields['name'] = req.body.name;
      }

      if (req.body.type !== undefined) {
        updateFields['type'] = req.body.type;
      }

      if (req.body.description) {
        updateFields['description'] = req.body.description;
      }

      if (req.body.taxonomy) {
        updateFields['taxonomy'] = req.body.taxonomy;
      }

      if (req.body.parent) {
        updateFields['parent'] = req.body.parent;
      }

      const updatedCategory = await Category.findByIdAndUpdate(
        _id,
        { $set: updateFields },
        { new: true }
      );

      return res.status(200).json({
        data : updatedCategory,
        message :"category updated successfully"
      });
    } catch (err) {
      const errorMessage = err.message || 'Internal Server Error';
      return res.status(500).json({ msg: errorMessage });
    }
  };
  

  const destroy = async (req, res) => {
    const { _id } = req.params;
  
    try {
      const category = await Category.findByIdAndDelete(_id);
  
      if (!category) {
        return res.status(400).json({
          msg: 'Bad Request: Model not found',
        });
      }
  
      return res.status(200).json({
        msg: 'Successfully destroyed model',
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        msg: 'Internal server error',
      });
    }
  };

  return {
    create,
    getAll,
    get,
    update,
    destroy,
  };
};

module.exports = CategoryController;


module.exports.getById = async (req, res) => {
  const response = {};
  try {
    const { id } = req.params;

   const getData = await Category.findOne({ id: id})

    if (!getData) {
      response.success = false;
      response.message = "Category Not Found";
      response.data = null;
      return res.status(404).json(response);
    } else {
      response.success = true;
      response.message = 'Category retrieved successfully';
      response.data = getData;
      return res.status(200).json(response);
    }
  } catch (error) {
    console.error(error);
    response.success = false;
    response.message = "Internal Server Error";
    response.data = null;
    return res.status(500).json(response);
  }
};


module.exports.getAllCategories = async (req, res) => {
  try {
    const categoriesData = await Category.find();

    if (!categoriesData || categoriesData.length === 0) {
      response.success = false;
      response.message = "Category Not Found";
      response.data = null;
      return res.status(404).json(response);
    } else {
      response.success = true;
      response.message = "All categories Are Get";
      response.data = categoriesData;
      return res.status(200).json(response);
    }
  } catch (error) {
    console.error(error);
    response.success = false;
    response.message = "Internal Server Error";
    response.data = null;
    return res.status(500).json(response);
  }
};


