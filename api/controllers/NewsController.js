const AllModels = require('../services/model.service');
const newModel = require('../models/Post')
const axios = require('axios');
const response = require('../services/respones')
const fs = require('fs');
const mongoose = require('mongoose');
const path = require('path');
const { emitMessage } = require('../services/socket');

module.exports.addPost = async (req, res) => {
  try {
    const {
      content,
      title,
      excerpt,
      sticky,
      post_password,
      post_name,
      template,
      format,
      categories,
      tags,
      starTags,
      status,
      author,
      comment_status,
      ping_status,
      link,
    } = req.body;

    const featured_media = req.file;

    if (!featured_media) {
      const response = {
        success: false,
        message: 'No featured media provided.',
        data: null,
      };
      return res.status(400).json(response);
    }

    const source_url = `/uploads/${encodeURIComponent(featured_media.filename)}`;

    const newPost = new newModel({
      date: new Date(),
      date_gmt: new Date(),
      content: {
        english: content.english,
        arabic: content.arabic,
        french: content.french,
        espanol: content.espanol,
      },
      title: {
        english: title.english,
        arabic: title.arabic,
        french: title.french,
        espanol: title.espanol,
      },
      excerpt,
      author,
      comment_status,
      ping_status,
      sticky,
      post_password,
      post_name,
      template,
      format,
      categories,
      tags,
      starTags,
      status,
      link,
      featured_media: { source_url },
    });

    await newPost.save();

    const response = {
      success: true,
      message: 'Post added successfully',
      data: newPost,
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('Error in addPost:', error);
    const response = {
      success: false,
      message: 'Internal Server Error',
      data: null,
    };
    res.status(500).json(response);
  }
};


module.exports.postDelete = async (req, res) => {
  try {
    const { _id } = req.params
    const data = await newModel.findByIdAndDelete({ _id: _id })
    if (!data) {
      response.success = false;
      response.message = 'Posts Not Found';
      response.data = null;
      res.status(404).json(response)
    }
    response.success = true;
    response.message = "Posts Delete Successfully"
    response.data = null;
    res.status(200).json(response);

  } catch (error) {
    response.success = false;
    response.message = 'Internal Server Error';
    response.data = null;
    res.status(500).json(response)
  }
}


module.exports.getIpCountry = async (req, res) => {
  try {
    const { Country } = AllModels();

    var data = {};

    const clientIP = req.headers['x-forwarded-for']?.split(',').shift() || req.socket?.remoteAddress;
    await axios.get(`https://ipinfo.io/${clientIP}/json`)
      .then(async (result) => {

        if (result.data && result.data.country) {
          data = await Country.findOne({
            where: {
              iso2: result.data.country
            }
          });
        }

        return res.status(200).json({ data });

      })
      .catch(err => {
        return res.status(400).json({ msg: 'No data found!' });
      });

  } catch (error) {
    return res.status(500).json({
      msg: 'Internal server error',
    });
  }
};


module.exports.getAllPostByAuthorId = async (req, res) => {
  const response = { success: false, message: '', data: null };

  try {
    const { _id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(_id)) {
      response.message = 'Invalid author ID format.';
      return res.status(400).json(response);
    }

    const authorId = new mongoose.Types.ObjectId(_id);

    const pipeline = [
      {
        $match: { author: authorId },
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
          ping_status: 1,
          comment_status: 1,
          sticky: 1,
          template: 1,
          tags: "$tagData",
          starTags: "$starTagData",
          categories: '$categoriesData',
          featured_media: {
            $cond: {
              if: { $isArray: "$featured_media" },
              then: { $arrayElemAt: ["$featured_media", 0] },
              else: "$featured_media",
            },
          },
          format: 1,
          meta: 1,
          post_mailing_queue_ids: 1,
          _links: 1,
          view: 1,
        },
      },
    ];

    const updatedPost = await newModel.aggregate(pipeline);

    response.success = true;
    response.message = 'Get All posted news by Author.';
    response.data = updatedPost;
    res.status(200).json(response);
  } catch (error) {
    console.error('Error retrieving posts by author:', error.message);
    response.success = false;
    response.message = 'Internal Server Error';
    res.status(500).json(response);
  }
};


module.exports.updatePost = async (req, res) => {
  try {
    const _id = req.params._id;

    const { content, title, excerpt, sticky, post_name, template, format, categories, tags, starTags, status, author, comment_status, ping_status, link } = req.body;

    const featured_media = req.file;

    const updateObject = {
      date: new Date(),
      date_gmt: new Date(),
      content: { ...content },
      title: { ...title },
      excerpt,
      author,
      comment_status,
      ping_status,
      sticky,
      post_name,
      template,
      format,
      categories,
      tags,
      starTags,
      status,
      link,
    };

    if (featured_media) {
      updateObject.featured_media = {
        source_url: `/uploads/${encodeURIComponent(featured_media.filename)}`,
      };
    }

    const updatedPostDoc = await newModel.findByIdAndUpdate(_id, { $set: updateObject }, { new: true, useFindAndModify: false });

    const response = {
      success: true,
      message: 'Post updated successfully',
      data: updatedPostDoc,
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('Error in updatePost:', error);
    const response = {
      success: false,
      message: 'Internal Server Error',
      data: null,
    };
    res.status(500).json(response);
  }
};


module.exports.getPostById = async (req, res) => {
  try {
    const { _id } = req.params;

    const pipeline = [
      {
        $match: { _id: new mongoose.Types.ObjectId(_id) },
      },
      {
        $set: { view: { $ifNull: ['$view', 0] } },
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
          from: 'categories',
          localField: 'categories',
          foreignField: 'id',
          as: 'categoriesData',
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
          view: { $add: [{ $ifNull: ['$view', 0] }, 1] },
        },
      },
    ];

    const updatedPost = await newModel.aggregate(pipeline);


    if (!updatedPost || updatedPost.length === 0) {
      const response = {
        success: false,
        message: 'Post not found',
        data: null,
      };
      return res.status(404).json(response);
    }

    await newModel.updateOne({ _id: new mongoose.Types.ObjectId(_id) }, { $inc: { view: 1 } });

    const response = {
      success: true,
      message: 'Post retrieved successfully',
      data: updatedPost[0],
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('Error in getPostById:', error);
    const response = {
      success: false,
      message: 'Internal Server Error',
      data: null,
    };
    res.status(500).json(response);
  }
};


module.exports.getAllPopularPosts = async (req, res) => {
  try {
    const posts = await newModel.aggregate([
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
        $match: {
          view: { $exists: true },
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
          view: {
            $toInt: '$view',
          },
        },
      },
      {
        $sort: {
          view: -1,
        },
      },
      {
        $limit: 100,
      },
    ]).allowDiskUse(true);

    const response = {
      success: true,
      message: 'Popular Posts retrieved successfully',
      data: posts,
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('Error in getAllPopularPosts:', error);
    const response = {
      success: false,
      message: 'Internal Server Error',
      data: null,
    };
    res.status(500).json(response);
  }
};


module.exports.getAllPosts = async (req, res) => {
  try {
    const { page = 1 } = req.query;
    const pageSize = 20;
    const skip = (page - 1) * pageSize;

    const posts = await newModel.aggregate([
      { $sort: { date: -1 } },
      { $skip: skip },
      { $limit: pageSize },
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
    ]);

    const totalPostsCount = await newModel.countDocuments();

    const response = {
      success: true,
      message: 'Posts retrieved successfully',
      data: {
        posts: posts,
        totalPostsCount,
      },
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('Error in getAllPosts:', error);
    const response = {
      success: false,
      message: 'Internal Server Error',
      data: null,
    };
    res.status(500).json(response);
  }
};

module.exports.getLatestPost = async (req, res) => {
  try {
    const latestPosts = await newModel.aggregate([
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
      message: 'Latest posts retrieved successfully',
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




// module.exports.getLatestPost = async (req, res) => {
//   try {
//     const latestPosts = await newModel.aggregate([
//       {
//         $lookup: {
//           from: 'categories',
//           localField: 'categories',
//           foreignField: 'id',
//           as: 'categoriesData',
//         },
//       },
//       {
//         $lookup: {
//           from: 'media',
//           localField: 'featured_media',
//           foreignField: 'id',
//           as: 'mediaData',
//         },
//       },
//       {
//         $project: {
//           _id: 1,
//           id: 1,
//           date: 1,
//           date_gmt: 1,
//           guid: 1,
//           modified: 1,
//           modified_gmt: 1,
//           slug: 1,
//           status: 1,
//           type: 1,
//           link: 1,
//           title: 1,
//           content: 1,
//           excerpt: 1,
//           author: 1,
//           //featured_media: { $arrayElemAt: ['$MediaData', 0] },
//           featured_media: {
//             $cond: {
//               if: {
//                 $and: [
//                   { $isArray: '$mediaData' },
//                   { $gt: [{ $size: '$mediaData' }, 0] },
//                 ],
//               },
//               then: { $mergeObjects: [{ source_url: { $arrayElemAt: ['$mediaData.source_url', 0] } }, '$featured_media'] },
//               else: '$featured_media',
//             },
//           },
//           ping_status: 1,
//           comment_status: 1,
//           sticky: 1,
//           template: 1,
//           categories: '$categoriesData',
//           format: 1,
//           meta: 1,
//           post_mailing_queue_ids: 1,
//           _links: 1,
//           view: 1,
//         },
//       },
//       {
//         $sort: { date: -1 },
//       },
//       {
//         $limit: 10,
//       },
//     ]);

//     const response = {
//       success: true,
//       message: 'Latest posts retrieved successfully',
//       data: latestPosts,
//     };

//     res.status(200).json(response);
//   } catch (error) {
//     console.error('Error in getLatestPosts:', error);
//     const response = {
//       success: false,
//       message: 'Internal Server Error',
//       data: null,
//     };
//     res.status(500).json(response);
//   }
// };

module.exports.searchPostsByTitle = async (req, res) => {
  try {
    const searchTerm = req.query.title;

    const pipeline = [];

    if (searchTerm) {
      const regex = new RegExp(searchTerm, 'i');
      pipeline.push({
        $match: {
          $or: [
            { 'title.english': { $regex: regex } },
            { 'title.arabic': { $regex: regex } },
            { 'title.french': { $regex: regex } },
            { 'title.espanol': { $regex: regex } },
          ],
        },
      });
    }

    pipeline.push(
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
        $limit: 1000,
      },
      {
        $sort: { date: -1 },
      }
    );

    const searchResults = await newModel.aggregate(pipeline);

    const response = {
      success: true,
      message: 'Search results retrieved successfully',
      data: searchResults,
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('Error in searchPostsByTitle:', error);
    const response = {
      success: false,
      message: 'Internal Server Error',
      data: null,
    };
    res.status(500).json(response);
  }
};

