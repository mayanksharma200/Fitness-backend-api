import express from "express";
import Post from "../models/Post.js";
import axios from "axios";

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
          "NutritionTop",
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
//viewall Mid
router.get("/viewall-mid", async (req, res) => {
  try {
    const midPosts = await Post.find({
      position: {
        $in: [
          "NutritionMid",
          "SleepMid",
          "MentalMid",
          "FitnessMid",
          "ProductMid",
        ],
      },
    });
    res.json(midPosts);
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


const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

router.post("/generate-content", async (req, res) => {
  try {
    const { title, source, imageUrl, position, sections = 5 } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        error: "Title is required",
      });
    }

    if (!GEMINI_API_KEY) {
      return res.status(501).json({
        success: false,
        error: "AI service not configured",
      });
    }

    const prompt = {
      contents: [
        {
          parts: [
            {
              text: `As a health and wellness content writer in Humanize behaviour, create a comprehensive, in-depth article with multiple sections based on these requirements: (NOT TO LOOK LIKE AI GENERATED CONTENT)

          ARTICLE TITLE: ${title}
          ${source ? `SOURCE: ${source}` : ""}
          ${imageUrl ? `IMAGE CONTEXT: ${imageUrl}` : ""}
          ${
            position
              ? `CATEGORY: ${position
                  .replace(/Top|Mid/g, "")
                  .replace(/([A-Z])/g, " $1")
                  .trim()}`
              : ""
          }
          
          CONTENT REQUIREMENTS:
          - Generate 3 concise summary bullet points
          - Create ${sections} detailed body sections with headlines and comprehensive content
          - Each section should be approximately 1200 words (very detailed and thorough)
          - Include 5-7 relevant keywords per section for hyperlinks
          - Maintain professional yet accessible tone
          - Ensure logical flow between sections
          - Include subsections with H3 headings where appropriate
          - Provide statistics, expert quotes, and practical examples where relevant
          
          OUTPUT FORMAT (as valid JSON):
          {
            "summary": [
              {"title": "Key point", "text": "Brief summary text..."},
              ...
            ],
            "body": [
              {
                "headline": "Section 1 Headline",
                "content": "Very detailed content for this section (approximately 1200 words in Humanize language)...",
                "keywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"],
                "subsections": [
                  {
                    "subheading": "Subsection 1",
                    "content": "Detailed content for this subsection..."
                  },
                  ...
                ]
              },
              ...
            ]
          }`,
            },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 8000, // Increased to allow for longer content
      },
    };

    const response = await axios.post(
      `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
      prompt,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const generatedText = response.data.candidates[0].content.parts[0].text;

    try {
      // Clean the response to ensure valid JSON
      const jsonStart = generatedText.indexOf("{");
      const jsonEnd = generatedText.lastIndexOf("}") + 1;
      const jsonString = generatedText.slice(jsonStart, jsonEnd);

      const generatedContent = JSON.parse(jsonString);

      res.json({
        success: true,
        content: generatedContent,
      });
    } catch (e) {
      console.error("Failed to parse JSON:", e);
      res.json({
        success: true,
        rawContent: generatedText,
      });
    }
  } catch (error) {
    console.error("Content generation error:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});
// module.exports = router;
export default router;
