
const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  id: Number,
  date: Date,
  date_gmt: Date,
  guid: {
    rendered: String,
  },
  modified: Date,
  modified_gmt: Date,
  slug: String,
  status: {
    type: String,
    enum: ["pending", "publish", "approved", "reject"],
    default: "pending"
  },
  type: String,
  link: String,
  title: {
    english: {
      type: String,
    },
    arabic: {
      type: String,
    },
    french: {
      type: String,
    },
    espanol: {
      type: String,
    },
  },
  content: {
    english: {
      type: String,
    },
    arabic: {
      type: String,
    },
    french: {
      type: String,
    },
    espanol: {
      type: String,
    },
  },
  excerpt: {
    rendered: String,
    protected: Boolean,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref : "User"
  },
  featured_media: {
    source_url: {
      type: Object,
    },
  },
  comment_status: String,
  ping_status: String,
  sticky: Boolean,
  template: String,
  format: String,
  meta: {
    footnotes: String,
  },
  categories: [
    {
      type: Number,
      ref: 'Category',
    },
  ],

  tags: [
    {
      type: Number,
      ref: 'Tag',
    },
  ],
  starTags: [
    {
      type: Number,
      ref: 'startag',
    },
  ],
  post_mailing_queue_ids: [Number],
  _links: {
    self: [
      {
        href: String,
      },
    ],
    collection: [
      {
        href: String,
      },
    ],
    about: [
      {
        href: String,
      },
    ],
    author: [
      {
        embeddable: Boolean,
        href: String,
      },
    ],
    replies: [
      {
        embeddable: Boolean,
        href: String,
      },
    ],
    version_history: [
      {
        count: Number,
        href: String,
      },
    ],
    predecessor_version: [
      {
        id: Number,
        href: String,
      },
    ],
    wp: {
      featuredmedia: [
        {
          embeddable: Boolean,
          href: String,
        },
      ],
      attachment: [
        {
          href: String,
        },
      ],
      term: [
        {
          taxonomy: String,
          embeddable: Boolean,
          href: String,
        },
      ],
      curies: [
        {
          name: String,
          href: String,
          templated: Boolean,
        },
      ],
    },
  },
  view: {
    type: Number,
    default: 0,

  }
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;





// featured_media: {
  //   type:  Number,
  //   ref : "Media",
  // },