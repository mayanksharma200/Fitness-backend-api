import mongoose from "mongoose";

// Schema for hyperlinks in body content
const hyperlinkSchema = new mongoose.Schema(
  {
    keyword: {
      type: String,
      default: "",
    },
    link: {
      type: String,
      default: "",
    },
  },
  { _id: false }
);

// Schema for summary items
const summaryItemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      default: "",
    },
    text: {
      type: String,
      default: "",
    },
  },
  { _id: false }
);

// Schema for body content items
const bodyItemSchema = new mongoose.Schema(
  {
    headline: {
      type: String,
      default: "",
    },
    content: {
      type: String,
      default: "",
    },
    hyperlinks: {
      type: [hyperlinkSchema],
      default: [],
    },
  },
  { _id: false }
);

// Schema for content (contains summary and body)
const contentSchema = new mongoose.Schema(
  {
    summary: {
      type: [summaryItemSchema],
      default: [],
    },
    body: {
      type: [bodyItemSchema],
      default: [],
    },
  },
  { _id: false }
);

// Schema for related studies
const relatedStudySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      default: "",
    },
    link: {
      type: String,
      default: "",
    },
  },
  { _id: false }
);

// Schema for meta information
const metaSchema = new mongoose.Schema(
  {
    author: {
      type: String,
      default: "",
    },
    date: {
      type: String,
      default: "",
    },
    reviewer: {
      type: String,
      default: "",
    },
    readTime: {
      type: String,
      default: "",
    },
  },
  { _id: false }
);

// Main post schema
const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    position: {
      type: String,
      default: "",
      trim: true,
    },
    link: {
      type: String,
      default: "",
      trim: true,
    },
    content: {
      type: contentSchema,
      default: () => ({}),
    },
    meta: {
      type: metaSchema,
      default: () => ({}),
    },
    image: {
      type: String,
      default: "",
      trim: true,
    },
    related_studies: {
      type: [relatedStudySchema],
      default: [],
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        delete ret.__v;
        delete ret.createdAt;
        delete ret.updatedAt;
        return ret;
      },
    },
  }
);

// Create and export the Post model
const Post = mongoose.model("Post", postSchema);
export default Post;
