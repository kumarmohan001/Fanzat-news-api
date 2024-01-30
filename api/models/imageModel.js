const mongoose = require('mongoose');

const mediaSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  id: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  guid: {
    rendered: {
      type: String,
      required: true
    }
  },
  slug: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  link: {
    type: String,
    required: true
  },
  title: {
    rendered: {
      type: String,
      required: true
    }
  },
  author: {
    type: Number,
    required: true
  },
  comment_status: {
    type: String,
    required: true
  },
  ping_status: {
    type: String,
    required: true
  },
  template: {
    type: String
  },
  meta: {
    type: Array
  },
  description: {
    rendered: {
      type: String
    }
  },
  caption: {
    rendered: {
      type: String
    }
  },
  alt_text: {
    type: String
  },
  media_type: {
    type: String,
    required: true
  },
  mime_type: {
    type: String,
    required: true
  },
  media_details: {
    width: {
      type: Number,
      required: true
    },
    height: {
      type: Number,
      required: true
    },
    file: {
      type: String,
      required: true
    },
    filesize: {
      type: Number,
      required: true
    },
    sizes: {
      medium: {
        file: {
          type: String,
          required: true
        },
        width: {
          type: Number,
          required: true
        },
        height: {
          type: Number,
          required: true
        },
        filesize: {
          type: Number,
          required: true
        },
        mime_type: {
          type: String,
          required: true
        },
        source_url: {
          type: String,
          required: true
        }
      },
      thumbnail: {
        file: {
          type: String,
          required: true
        },
        width: {
          type: Number,
          required: true
        },
        height: {
          type: Number,
          required: true
        },
        filesize: {
          type: Number,
          required: true
        },
        mime_type: {
          type: String,
          required: true
        },
        source_url: {
          type: String,
          required: true
        }
      },
      full: {
        file: {
          type: String,
          required: true
        },
        width: {
          type: Number,
          required: true
        },
        height: {
          type: Number,
          required: true
        },
        filesize: {
          type: Number,
          required: true
        },
        mime_type: {
          type: String,
          required: true
        },
        source_url: {
          type: String,
          required: true
        }
      }
    },
    image_meta: {
        aperture: {
          type: String,
          required: true
        },
        credit: {
          type: String,
          required: true
        },
        camera: {
          type: String,
          required: true
        },
        caption: {
          type: String,
          required: true
        },
        created_timestamp: {
          type: String,
          required: true
        },
        copyright: {
          type: String,
          required: true
        },
        focal_length: {
          type: String,
          required: true
        },
        iso: {
          type: String,
          required: true
        },
        shutter_speed: {
          type: String,
          required: true
        },
        title: {
          type: String,
          required: true
        },
        orientation: {
          type: String,
          required: true
        },
        keywords: {
          type: Array
        }
      }
  },
  post: {
    type: Number,
    required: true
  },
  source_url: {
    type: String,
    required: true
  },
  _links: {
    self: [
      {
        href: {
          type: String,
          required: true
        }
      }
    ],
    collection: [
      {
        href: {
          type: String,
          required: true
        }
      }
    ],
    about: [
      {
        href: {
          type: String,
          required: true
        }
      }
    ],
    author: [
      {
        embeddable: {
          type: Boolean,
          required: true
        },
        href: {
          type: String,
          required: true
        }
      }
    ],
    replies: [
      {
        embeddable: {
          type: Boolean,
          required: true
        },
        href: {
          type: String,
          required: true
        }
      }
    ]
  }
});

const MediaModel = mongoose.model('Media', mediaSchema);

module.exports = MediaModel;


