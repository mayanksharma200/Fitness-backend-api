import express from "express";
import mongoose from "mongoose";
import multer from "multer";
import { Readable } from "stream";

const router = express.Router();
const mongoURI = process.env.MONGODB_URI;

const conn = mongoose.createConnection(mongoURI);

let gridfsBucket;
conn.once("open", () => {
  gridfsBucket = new mongoose.mongo.GridFSBucket(conn.db, {
    bucketName: "videos",
  });
});

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB limit
});

router.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  const readableStream = new Readable();
  readableStream.push(req.file.buffer);
  readableStream.push(null);

  const uploadStream = gridfsBucket.openUploadStream(req.file.originalname, {
    contentType: req.file.mimetype,
  });

  readableStream
    .pipe(uploadStream)
    .on("error", (error) => {
      console.error("Error uploading file:", error);
      res.status(500).json({ message: "Upload failed", error: error.message });
    })
    .on("finish", () => {
      res
        .status(201)
        .json({ fileId: uploadStream.id, filename: req.file.originalname });
    });
});

// List videos metadata
router.get("/", async (req, res) => {
  try {
    if (!gridfsBucket) {
      return res.status(503).json({ message: "Video service not ready" });
    }
    const files = await conn.db.collection("videos.files").find().toArray();
    if (!files || files.length === 0) {
      return res.status(404).json({ message: "No videos found" });
    }
    res.json(files);
  } catch (err) {
    console.error("Error fetching files:", err);
    res.status(500).json({ message: err.message });
  }
});

// Stream video by filename with HTTP Range support
router.get("/:filename", async (req, res) => {
  if (!gridfsBucket) {
    return res.status(503).json({ message: "Video service not ready" });
  }

  try {
    const file = await conn.db
      .collection("videos.files")
      .findOne({ filename: req.params.filename });
    if (!file) {
      return res.status(404).json({ message: "No file exists" });
    }

    if (!["video/mp4", "video/webm", "video/ogg"].includes(file.contentType)) {
      return res.status(400).json({ message: "Not a video file" });
    }

    const range = req.headers.range;
    if (!range) {
      // No range header, stream entire video
      res.set("Content-Type", file.contentType);
      const downloadStream = gridfsBucket.openDownloadStreamByName(
        file.filename
      );
      return downloadStream.pipe(res);
    }

    // Parse Range header
    const parts = range.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : file.length - 1;
    const chunkSize = end - start + 1;

    res.status(206);
    res.set({
      "Content-Range": `bytes ${start}-${end}/${file.length}`,
      "Accept-Ranges": "bytes",
      "Content-Length": chunkSize,
      "Content-Type": file.contentType,
    });

    const downloadStream = gridfsBucket.openDownloadStreamByName(
      file.filename,
      {
        start,
        end: end + 1, // GridFS end is exclusive, so add 1
      }
    );

    downloadStream.pipe(res);
  } catch (err) {
    console.error("Error streaming video:", err);
    res.status(500).json({ message: "Error streaming video" });
  }
});

export default router;
