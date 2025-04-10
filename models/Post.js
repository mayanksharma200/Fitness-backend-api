import mongoose from "mongoose";

const summaryItemSchema = new mongoose.Schema({
  title: String,
  position: String,
  text: String,
});

const contentSchema = new mongoose.Schema({
  summary: [summaryItemSchema],
  body: [String],
});

const metaSchema = new mongoose.Schema({
  author: String,
  date: String,
  reviewer: String,
  readTime: String,
});

// models/Post.js
const postSchema = new mongoose.Schema({
  title: String,
  position: String,  // Add this at the root level
  content: contentSchema,
  meta: metaSchema,
  image: String,
});

const Post = mongoose.model("Post", postSchema);
export default Post;
