const response = require("../services/respones"); 
const Tag = require("../models/tagModel");

module.exports.addTag = async (req, res) => {
  try {
    const { TermID, TermSlug, Description, ParentID, ParentSlug, ParentName, tag } = req.body;

    const existingTag = await Tag.findOne({ TermID: TermID });

    if (!TermID) {
      response.message = 'TermID is required.';
      return res.status(400).json(response);
    }

    if (existingTag) {
      response.message = 'Tag already exists with this TermID. Please choose a different one.';
      return res.status(400).json(response);
    }

    const tagData = await Tag.create({
      TermID: TermID,
      TermSlug: TermSlug,
      Description: Description,
      ParentID: ParentID,
      ParentSlug: ParentSlug,
      ParentName: ParentName,
      tags: {
        english: tag.english,
        arabic: tag.arabic,
        french: tag.french,
        espanol: tag.espanol,
      },
    });

    response.success = true;
    response.message = 'Tag added successfully.';
    response.data = { tag: tagData.tags, TermID, TermSlug, Description, ParentID, ParentSlug, ParentName };
    res.status(200).json(response);
  } catch (error) {
    console.error('Error adding tag:', error.message);
    response.message = 'Internal Server Error';
    res.status(500).json(response);
  }
};


module.exports.updateTag = async (req, res) => {
  try {
    const {_id} = req.params;
    const { TermSlug, Description, ParentID, ParentSlug, ParentName, tag } = req.body;
    
    const existingTag = await Tag.findOne({ _id : _id });

    if (!existingTag) {
      response.message = 'Tag not found with this id.';
      return res.status(404).json(response);
    }
    existingTag.TermSlug = TermSlug || existingTag.TermSlug;
    existingTag.Description = Description || existingTag.Description;
    existingTag.ParentID = ParentID || existingTag.ParentID;
    existingTag.ParentSlug = ParentSlug || existingTag.ParentSlug;
    existingTag.ParentName = ParentName || existingTag.ParentName;

    existingTag.tags = {
      english: tag.english || existingTag.tags.english,
      arabic: tag.arabic || existingTag.tags.arabic,
      french: tag.french || existingTag.tags.french,
      espanol: tag.espanol || existingTag.tags.espanol,
    };
    const updatedTag = await existingTag.save();

    response.success = true;
    response.message = 'Tag updated successfully.';
    response.data = { tag: updatedTag.tags, TermSlug, Description, ParentID, ParentSlug, ParentName };
    res.status(200).json(response);
  } catch (error) {
    console.error('Error updating tag:', error.message);
    response.message = 'Internal Server Error';
    res.status(500).json(response);
  }
};


module.exports.getTagById = async (req, res) => {
  try {
    const { _id } = req.params
    const getTag = await Tag.findById({ _id: _id })
    if (!getTag) {
      response.success = false,
        response.message = "Tag Not Found"
      response.data = null;
      res.status(401).json(response)

    } else {
      response.success = true,
        response.message = 'Get Tag Successfully',
        response.data = getTag,
        res.status(200).json(response)

    }
  } catch (error) {
    console.log(error);
    response.success = false;
    response.message = "Internal Server Error";
    response.data = null;
    return res.status(500).json(response)
  }
}

const TAGS_PER_PAGE = 20;

module.exports.getAllTags = async (req, res) => {
  const page = parseInt(req.query.page) || 1; 

  try {
    const totalCount = await Tag.countDocuments();
    const totalPages = Math.ceil(totalCount / TAGS_PER_PAGE);

    const getData = await Tag.find().sort({ createdAt: -1 })
      .skip((page - 1) * TAGS_PER_PAGE) 
      .limit(TAGS_PER_PAGE);

    if (!getData || getData.length === 0) {
      response.success = false;
      response.message = "Tag Not Found";
      response.data = null;
      return res.status(404).json(response);
    } else {
      response.success = true;
      response.message = 'All tags are retrieved successfully';
      response.data = {
        tags: getData,
        totalPages,
        currentPage: page,
        totalItems: totalCount,
      };
      return res.status(200).json(response);
    }
  } catch (error) {
    console.log(error);
    response.success = false;
    response.message = "Internal Server Error";
    response.data = null;
    return res.status(500).json(response);
  }
};


// module.exports.getAllTags = async (req, res) => {
//     try {
//       const getData = await Tag.find()
//       if (!getData) {
//         response.success = false,
//           response.message = "Tag Not Found"
//         response.data = null;
//         res.status(404).json(response)
  
//       } else {
//         response.success = true,
//           response.message = 'All tags are get Successfully',
//           response.data = getData,
//           res.status(200).json(response)
//       }
//     } catch (error) {
//       console.log(error);
//       response.success = false;
//       response.message = "Internal Server Error";
//       response.data = null;
//       return res.status(500).json(response)
//     }
//   }

  module.exports.tagDelete = async (req, res) => {
    try {
      const { _id } = req.params
      const tagData = await Tag.findByIdAndDelete({ _id: _id })
      if (!tagData) {
        response.success = false;
        response.data = null;
          response.message = "Tag Not Found";
          res.status(404).json(response)
      } else {
        response.success = true,
          response.message = 'Tag Delete Successfully'
        response.data = tagData,
          res.status(200).json(response)
      }
    } catch (error) {
      console.log(error);
      response.data = null;
      response.success = false,
        response.message = "Internel Server Error",
        res.status(500).json(response)
    }
  }


  module.exports.searchTags = async (req, res) => {
    try {
      const { language, searchTerm } = req.query;
  
      if (!language && !searchTerm) {
        const allTags = await Tag.find();
        response.success = true;
        response.message = 'All tags retrieved successfully.';
        response.data = allTags;
        return res.status(200).json(response);
      }
  
      if (!language || !searchTerm) {
        response.message = 'Both language and searchTerm are required parameters if provided.';
        response.data = null;
        return res.status(400).json(response);
      }
  
      const supportedLanguages = ['english', 'arabic', 'french', 'espanol'];
      if (!supportedLanguages.includes(language.toLowerCase())) {
        response.message = 'Invalid language. Supported languages are: english, arabic, french, espanol.';
        response.data = null;
        return res.status(400).json(response);
      }
  
      const languageField = `tags.${language.toLowerCase()}`;
  
      const languageFieldExists = await Tag.exists({ [languageField]: { $exists: true } });
      if (!languageFieldExists) {
        response.message = `The specified language field '${language}' does not exist in the tags.`;
        response.data = null;
        return res.status(400).json(response);
      }
  
      const searchQuery = {
        [languageField]: { $regex: new RegExp(searchTerm, 'i') },
      };
  
      const matchingTags = await Tag.find(searchQuery);
  
      response.success = true;
      response.message = 'Tags retrieved successfully.';
      response.data = matchingTags;
      res.status(200).json(response);
    } catch (error) {
      console.error('Error searching tags:', error.message);
      response.message = 'Internal Server Error';
      res.status(500).json(response);
    }
  };
  
  
  
