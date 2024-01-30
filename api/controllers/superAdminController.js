const userModel = require('../models/user')
const bcrypt = require('../services/bcrypt.service')
const camparePassword = require('../services/camparePassword')
const response = require('../services/respones')
const jwtServices = require('../services/jwtToken.Service')
const Post = require('../models/Post')
const mongoose = require('mongoose');
const path = require("path");

module.exports.login = async (req, res) => {

  try {
    const { user_email, user_pass } = req.body;
    const superAdmin = await userModel.findOne({ user_email });

    if (!superAdmin) {
      response.success = false;
      response.message = 'SuperAdmin not found';
      response.data = null,
        res.status(404).json(response);
    }

    const comparePassword = await camparePassword.comparePasswords(user_pass, superAdmin.user_pass);

    if (comparePassword) {
      const superAdminToken = await jwtServices.createJwt(superAdmin);
      response.success = true;
      response.message = 'superAdmin Login Successfully';
      response.data = { superAdmin, accessToken: superAdminToken };
      return res.status(201).json(response);
    } else {
      response.success = false;
      response.message = 'Invalid password';
      response.data = null,
        res.status(401).json(response);
    }
  } catch (error) {
    console.error(error);
    response.message = 'Internal Server Error';
    return res.status(500).json(response);
  }
};

module.exports.getAllData = async (req, res) => {
  try {
    const data = await userModel.find()

    response.success = true,
      response.message = 'Get All superAdmin Successfully ',
      response.data = data,
      res.status(200).json(response)

  } catch (error) {
    response.success = false;
    response.message = 'Internal Server Error';
    response.data = null;
    res.status(500).json(response)
  }
}

module.exports.getByIdadmin = async (req, res) => {
  try {
    const { ID } = req.params
    const adminData = await userModel.findById(ID)
    if (!adminData) {
      response.success = false,
        response.message = "superAdmin Not Found",
        response.data = null,
        res.status(404).json(response)
    }
    response.success = true,
      response.message = 'Get superAdmin Successfully',
      response.data = adminData,
      res.status(200).json(response)
  } catch (error) {
    response.success = false;
    response.message = 'Internal Server Error';
    response.data = null;
    res.status(500).json(response)
  }
}

module.exports.updateAdmin = async (req, res) => {

  try {
    const { user_nicename, user_email, user_url, user_login } = req.body;
    const { ID } = req.params;
    const adminData = await userModel.findByIdAndUpdate(ID, {
      user_nicename: user_nicename,
      user_email: user_email,
      user_url: user_url,
      user_login: user_login,
    },{new:true});

    if (!adminData) {
      response.message = "User Not Found";
      return res.status(404).json(response);
    }
    await adminData.save();

    response.success = true;
    response.message = "Admin Updated Successfully";
    response.data = adminData;
    res.status(200).json(response);

  } catch (error) {
    console.error(error); // Log the error for debugging
    response.message = "Internal Server Error";
    res.status(500).json(response);
  }
};

module.exports.adminDelete = async (req, res) => {
  try {
    const { ID } = req.params
    const adminData = await userModel.findByIdAndDelete(ID)
    if (!adminData) {
      response.success = false,
        response.message = "admin Not Found",
        response.data = null,
        res.status(404).json(response)
    }
    // await adminData.destroy()

    response.success = true,
      response.message = "admin Delete Successfully",
      response.data = null,
      res.status(200).json(response)

  } catch (error) {
    response.success = false,
      response.message = "Internal Server Error",
      response.data = null,
      res.status(500).json(response)

  }
}

module.exports.filteredPost = async (req, res) => {
  try {
    const status = req.query.status;

    if (status && !["pending", "publish", "accept", "reject"].includes(status.toLowerCase())) {
      return res.status(400).json({ error: 'Invalid status parameter' });
    }
    const query = status ? { post_status: status.toLowerCase() } : {};

    const posts = await Post.find(query);

    if (posts.length === 0) {
      return res.json({ message: `No posts found with status: ${status || 'all'}` });
    }

    res.json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
 

module.exports.getPostsByCategory = async (req, res) => {
  const { categoryId } = req.params;
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 100;

  try {
    const categoryNumber = parseInt(categoryId, 10);

    const skip = (page - 1) * pageSize;

    const posts = await Post.aggregate([
      {
        $match: { categories: categoryNumber },
      },
      {
        $lookup: {
          from: 'categories',
          localField: 'categories',
          foreignField: 'id',
          as: 'categoriesData',
        },
      },
      {
        $lookup: {
          from: 'tags',
          localField: 'tags',
          foreignField: 'TermID',
          as: 'tagData',
        },
      },
      {
        $lookup: {
          from: 'startags',
          localField: 'starTags',
          foreignField: 'TermID',
          as: 'starTagData',
        },
      },
      {
        $lookup: {
          from: 'media',
          localField: 'featured_media',
          foreignField: 'id',
          as: 'mediaData',
        },
      },
      {
        $addFields: {
          featured_media: {
            $cond: {
             if: { $ne: ["$mediaData", []] },
              then: { $arrayElemAt: ["$mediaData", 0] },
             else: "$featured_media",
            },
          },
        },
      },
      {
        $project: {
          _id: 1,
          id: 1,
          date: 1,
          date_gmt: 1,
          guid: 1,
          modified: 1,
          modified_gmt: 1,
          slug: 1,
          status: 1,
          type: 1,
          link: 1,
          title: 1,
          content: 1,
          excerpt: 1,
          author: 1,
          tags: "$tagData",
          starTags: "$starTagData",
         featured_media: {
          $cond: {
            if: { $isArray: "$featured_media" },
            then: { $arrayElemAt: ["$featured_media", 0] },
            else: "$featured_media",
          },
        },
          ping_status: 1,
          comment_status: 1,
          sticky: 1,
          template: 1,
          categories: '$categoriesData',
          format: 1,
          meta: 1,
          post_mailing_queue_ids: 1,
          _links: 1,
          view: 1,
        },
      },
      { $skip: skip },
      { $limit: pageSize },
    ]);

    if (!posts || posts.length === 0) {
      return res.status(404).json({ error: 'No posts found for the specified category' });
    }

    const response = {
      success: true,
      message: 'Posts retrieved successfully',
      data: posts,
    };

    res.json(response);
  } catch (error) {
    console.error('Error retrieving related posts:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};



module.exports.changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword, confirmPassword } = req.body;
    const { _id } = req.params;
    const userData = await userModel.findOne({ _id: _id });

    if (!userData) {
      response.success = false;
      response.message = "User Not Found";
      return res.status(404).json(response);
    }

    const matchPassword = await camparePassword.comparePasswords(oldPassword, userData.user_pass);

    if (matchPassword) {
      if (newPassword === confirmPassword) {
        const hashedPassword = await bcrypt.hashPassword(newPassword);
        const updatePassword = await userModel.findByIdAndUpdate(_id, { user_pass: hashedPassword });

        if (updatePassword) {
          response.success = true;
          response.message = 'Password Updated Successfully';
          response.data = updatePassword;
          return res.status(200).json(response);
        } else {
          response.success = false;
          response.message = "Password Not Updated";
          return res.status(400).json(response);
        }
      } else {
        response.success = false;
        response.message = "New Password and Confirm Password do not match";
        return res.status(400).json(response);
      }
    } else {
      response.success = false;
      response.message = "Incorrect Old Password";
      return res.status(400).json(response);
    }
  } catch (error) {
    console.error(error);
    response.success = false;
    response.message = "Internal Server Error";
    return res.status(500).json(response);
  }
};


module.exports.getLatestMasterCategoryPost = async (req, res) => {
  try {
    const masterCategoryId = req.params.masterCategoryId;
    const categoryNumber = parseInt(masterCategoryId, 10);

    const latestPosts = await Post.aggregate([
      {
        $match: {
          categories: categoryNumber,
        },
      },
      {
        $lookup: {
          from: 'categories',
          localField: 'categories',
          foreignField: 'id',
          as: 'categoriesData',
        },
      },
      {
        $lookup: {
          from: 'tags',
          localField: 'tags',
          foreignField: 'TermID',
          as: 'tagData',
        },
      },
      {
        $lookup: {
          from: 'startags',
          localField: 'starTags',
          foreignField: 'TermID',
          as: 'starTagData',
        },
      },
      {
        $lookup: {
          from: 'media',
          localField: 'featured_media',
          foreignField: 'id',
          as: 'mediaData',
        },
      },
      {
        $addFields: {
          featured_media: {
            $cond: {
             if: { $ne: ["$mediaData", []] },
              then: { $arrayElemAt: ["$mediaData", 0] },
             else: "$featured_media",
            },
          },
        },
      },
      {
        $project: {
          _id: 1,
          id: 1,
          date: 1,
          date_gmt: 1,
          guid: 1,
          modified: 1,
          modified_gmt: 1,
          slug: 1,
          status: 1,
          type: 1,
          link: 1,
          title: 1,
          content: 1,
          excerpt: 1,
          author: 1,
          tags: "$tagData",
          starTags: "$starTagData",
          featured_media: {
            $cond: {
              if: { $isArray: "$featured_media" },
              then: { $arrayElemAt: ["$featured_media", 0] },
              else: "$featured_media",
            },
          },
          ping_status: 1,
          comment_status: 1,
          sticky: 1,
          template: 1,
          categories: '$categoriesData',
          format: 1,
          meta: 1,
          post_mailing_queue_ids: 1,
          _links: 1,
          view: 1,
        },
      },
      {
        $sort: { date: -1 },
      },
      {
        $limit: 10,
      },
    ]);

    const response = {
      success: true,
      message: 'Latest master category posts retrieved successfully',
      data: latestPosts,
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('Error in getLatestPosts:', error);
    const response = {
      success: false,
      message: 'Internal Server Error',
      data: null,
    };
    res.status(500).json(response);
  }
};














