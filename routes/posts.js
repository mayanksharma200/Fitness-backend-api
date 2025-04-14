import express from "express";
import Post from "../models/Post.js";

const router = express.Router();

// Create a new post
router.post("/", async (req, res) => {
  try {
    const newPost = new Post(req.body);
    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Add this before other routes
router.get('/test', (req, res) => {
  res.json({ message: "API is working!" });
});


//topTwoArticles
// Add this route with your other routes
router.get("/top-articles", async (req, res) => {
  try {
    const topArticles = await Post.find({ position: "TopTwoArticles" });
    res.json(topArticles);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.get("/just-in", async (req, res) => {
  try {
    const justIn = await Post.find({ position: "JustIn" });
    res.json(justIn);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
router.get("/more-top-reads", async (req, res) => {
  try {
    const moreTopReads = await Post.find({ position: "MoreTopReads" });
    res.json(moreTopReads);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//categories
router.get("/top-nutrition", async (req, res) => {
  try {
    const topNutrition = await Post.find({ position: "NutritionTop" });
    res.json(topNutrition);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
router.get("/mid-nutrition", async (req, res) => {
  try {
    const midNutrition = await Post.find({ position: "NutritionMid" });
    res.json(midNutrition);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/sleep-top", async (req, res) => {
  try {
    const sleepTop = await Post.find({ position: "SleepTop" });
    res.json(sleepTop);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
router.get("/sleep-mid", async (req, res) => {
  try {
    const sleepMid = await Post.find({ position: "SleepMid" });
    res.json(sleepMid);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/mental-top", async (req, res) => {
  try {
    const mentalTop = await Post.find({ position: "MentalTop" });
    res.json(mentalTop);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
router.get("/mental-mid", async (req, res) => {
  try {
    const mentalMid = await Post.find({ position: "MentalMid" });
    res.json(mentalMid);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/fitness-top", async (req, res) => {
  try {
    const fitnessTop = await Post.find({ position: "FitnessTop" });
    res.json(fitnessTop);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
router.get("/fitness-mid", async (req, res) => {
  try {
    const fitnessMid = await Post.find({ position: "FitnessMid" });
    res.json(fitnessMid);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/product-top", async (req, res) => {
  try {
    const productTop = await Post.find({ position: "ProductTop" });
    res.json(productTop);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
router.get("/product-mid", async (req, res) => {
  try {
    const productMid = await Post.find({ position: "ProductMid" });
    res.json(productMid);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//viewall top
router.get("/viewall-top", async (req, res) => {
  try {
    const topPosts = await Post.find({
      position: {
        $in: [
          "TopNutrition",
          "SleepTop",
          "MentalTop",
          "FitnessTop",
          "ProductTop",
        ],
      },
    });
    res.json(topPosts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all posts
router.get("/", async (req, res) => {
  try {
    const posts = await Post.find();
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get single post
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update a post
router.put("/:id", async (req, res) => {
  try {
    const updatedPost = await Post.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updatedPost)
      return res.status(404).json({ message: "Post not found" });
    res.json(updatedPost);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a post
router.delete("/:id", async (req, res) => {
  try {
    const deletedPost = await Post.findByIdAndDelete(req.params.id);
    if (!deletedPost)
      return res.status(404).json({ message: "Post not found" });
    res.json({ message: "Post deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// module.exports = router;
export default router;
