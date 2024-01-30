const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
  {
    name: {
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
    id: {
      type: Number,
      unique: true,
      required: true
    },
    count: {
      type: Number,
    },
    description: {
      type: String,
    },
    link: {
      type: String,
    },
    taxonomy: {
      type: String,
    },
    slug: {
      type: String,
    },
    type: {
      type: String,
      required: true,
      default: 0,
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
    },
    parent: {
      type: Number,
    },
    meta: {
      type: Array,
    },
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
      up: [
        {
          href: String,
        },
      ],
      wp_post_type: [
        {
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
  { timestamps: true }
);
categorySchema.statics.validateIdUniqueness = async function (id) {
  const existingCategory = await this.findOne({ id: id });
  if (existingCategory) {
    return { valid: false, message: 'The provided ID is already in use. Please choose a different one.' };
  }
  return { valid: false, message: 'The ID is required.' };
};

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;




