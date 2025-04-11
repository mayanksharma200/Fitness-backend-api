import mongoose from "mongoose";

const summaryItemSchema = new mongoose.Schema({
  title: String,
  text: String,
});

const bodyItemSchema = new mongoose.Schema({
  headline: String,
  content: String,
});

const contentSchema = new mongoose.Schema({
  summary: [summaryItemSchema],
  body: [bodyItemSchema],
});

const relatedStudySchema = new mongoose.Schema({
  title: String,
  link: String,
});

const metaSchema = new mongoose.Schema({
  author: String,
  date: String,
  reviewer: String,
  readTime: String,
});

const postSchema = new mongoose.Schema({
  title: String,
  position: String,
  content: contentSchema,
  meta: metaSchema,
  image: String,
  related_studies: [relatedStudySchema], // Added this field
});

const Post = mongoose.model("Post", postSchema);
export default Post;
