const response = require("../services/respones");
const starTagModel = require("../models/starTagModel");


module.exports.addStarTag = async (req, res) => {
    try {
        const { TermID, TermPermalink, TermSlug, Description, ParentID, ParentSlug, ParentName } = req.body;
        const image = req.file;

        const existingStarTag = await starTagModel.findOne({ TermID: TermID });

        if (existingStarTag) {
            response.message = 'Star Tag already exists with this TermID, Please choose a different one .';
            return res.status(400).json(response);
        }

        const newStarTag = await starTagModel.create({
            TermID: TermID,
            TermPermalink: TermPermalink,
            TermSlug: TermSlug,
            Description: Description,
            ParentID: ParentID,
            ParentName: ParentName,
            ParentSlug: ParentSlug,
            image: {
                path: image.path,
                url: `/uploads/${encodeURIComponent(image.filename)}`,
            },
            starTags: {
                arabic: req.body.arabic,
                english: req.body.english,
                french: req.body.french,
                espanol: req.body.espanol,
            },
        });

        response.success = true;
        response.message = 'Star Tag added successfully.';
        response.data = { starTag: newStarTag };
        res.status(200).json(response);
    } catch (error) {
        console.error('Error adding star tag:', error.message);
        response.message = 'Internal Server Error';
        res.status(500).json(response);
    }
};


module.exports.updateStarTag = async (req, res) => {
    const response = { success: false, message: '', data: null };

    try {
        const { _id } = req.params;
        const { TermPermalink, Description, ParentID, ParentName, english, arabic, french, espanol } = req.body;

        const existingStarTag = await starTagModel.findOne({ _id: _id });

        if (!existingStarTag) {
            response.message = 'Star Tag not found.';
            return res.status(404).json(response);
        }
        existingStarTag.TermPermalink = TermPermalink || existingStarTag.TermPermalink;
        existingStarTag.Description = Description || existingStarTag.Description;
        existingStarTag.ParentID = ParentID || existingStarTag.ParentID;
        existingStarTag.ParentName = ParentName || existingStarTag.ParentName;

        existingStarTag.starTags = {
            arabic: arabic || existingStarTag.starTags.arabic,
            english: english || existingStarTag.starTags.english,
            french: french || existingStarTag.starTags.french,
            espanol: espanol || existingStarTag.starTags.espanol,
        };

        if (req.file) {
            existingStarTag.image = {
                path: req.file.path,
                url: `/uploads/${encodeURIComponent(req.file.filename)}`,
            };
        }

        const updatedStarTag = await existingStarTag.save();

        response.success = true;
        response.message = 'Star Tag updated successfully.';
        response.data = { starTag: updatedStarTag };
        res.status(200).json(response);
    } catch (error) {
        console.error('Error updating star tag:', error.message);
        response.message = 'Internal Server Error';
        res.status(500).json(response);
    }
};


module.exports.getStarTagById = async (req, res) => {
    try {
        const { _id } = req.params
        const getStarTag = await starTagModel.findById({ _id: _id })
        if (!getStarTag) {
            response.success = false,
                response.message = "Star Tag Not Found"
            response.data = null;
            res.status(401).json(response)

        } else {
            response.success = true,
                response.message = 'Get star Tag Successfully',
                response.data = getStarTag,
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

module.exports.getAllStarTags = async (req, res) => {
    try {
        const getData = await starTagModel.find().sort({ createdAt: -1 })
        if (!getData) {
            response.success = false,
                response.message = "Star Tags Not Found"
            response.data = null;
            res.status(404).json(response)

        } else {
            response.success = true,
                response.message = 'All star tags are get Successfully',
                response.data = getData,
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

module.exports.starTagDelete = async (req, res) => {
    try {
        const { _id } = req.params
        const starData = await starTagModel.findByIdAndDelete({ _id: _id })
        if (!starData) {
            response.success = false;
            response.data = null;
            response.message = "Star Tag Not Found";
            res.status(404).json(response)
        } else {
            response.success = true,
                response.message = 'Star Tag Delete Successfully'
            response.data = starData,
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


module.exports.searchStarTags = async (req, res) => {
    try {
      const { language, searchTerm } = req.query;
  
      if (!language && !searchTerm) {
        const allTags = await starTagModel.find();
        response.success = true;
        response.message = 'All stars tags retrieved successfully.';
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
  
      const languageField = `starTags.${language.toLowerCase()}`;
  
      const languageFieldExists = await starTagModel.exists({ [languageField]: { $exists: true } });
      if (!languageFieldExists) {
        response.message = `The specified language field '${language}' does not exist in the star tags.`;
        response.data = null;
        return res.status(400).json(response);
      }
  
      const searchQuery = {
        [languageField]: { $regex: new RegExp(searchTerm, 'i') },
      };
  
      const matchingTags = await starTagModel.find(searchQuery);
  
      response.success = true;
      response.message = 'Star Tags retrieved successfully.';
      response.data = matchingTags;
      res.status(200).json(response);
    } catch (error) {
      console.error('Error searching tags:', error.message);
      response.message = 'Internal Server Error';
      res.status(500).json(response);
    }
  };