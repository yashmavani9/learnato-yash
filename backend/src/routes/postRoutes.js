// backend/routes/postRoutes.js
import express from "express";
import Post from "../models/Post.js";

const router = express.Router();

// POST /posts → Create a post
router.post("/", async (req, res) => {
  try {
    const payload = req.body || {};
    const post = await Post.create(payload);
    const io = req.app.get("io");
    if (io) io.emit("new_post", post);
    res.status(201).json(post);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// GET /posts → Get all posts (supports ?search=keyword & ?sort=votes)
router.get("/", async (req, res) => {
  try {
    const { search, sort } = req.query;
    const filter = search
      ? {
          $or: [
            { title: { $regex: search, $options: "i" } },
            { content: { $regex: search, $options: "i" } },
          ],
        }
      : {};
    let query = Post.find(filter);
    if (sort === "votes") query = query.sort({ upvotes: -1, createdAt: -1 });
    else query = query.sort({ createdAt: -1 });
    const posts = await query.exec();
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /posts/:id → Get single post
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /posts/:id/reply → Add reply
router.post("/:id/reply", async (req, res) => {
  try {
    const { content, author } = req.body || {};
    if (!content) return res.status(400).json({ message: "Reply content required" });

    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const reply = { content, author: author || "Anonymous", createdAt: new Date() };
    post.replies.push(reply);
    await post.save();

    const io = req.app.get("io");
    if (io) io.emit("new_reply", { postId: post._id.toString(), reply });

    res.status(201).json({ reply, post });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// POST /posts/:id/upvote → Upvote post (only once per user)
router.post("/:id/upvote", async (req, res) => {
  try {
    const { user } = req.body || {};
    if (!user) return res.status(400).json({ message: "User required" });

    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    //Prevent duplicate upvotes
    if (post.upvotedBy.includes(user)) {
      return res.status(400).json({ message: "You already upvoted this post" });
    }

    post.upvotes += 1;
    post.upvotedBy.push(user);
    await post.save();

    const io = req.app.get("io");

    //Send updated upvotedBy list
    if (io)
      io.emit("post_upvoted", {
        postId: post._id.toString(),
        upvotes: post.upvotes,
        upvotedBy: post.upvotedBy,
      });

    res.json({
      postId: post._id.toString(),
      upvotes: post.upvotes,
      upvotedBy: post.upvotedBy,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// POST /posts/:id/markAnswered → Only author can mark as answered
router.post("/:id/markAnswered", async (req, res) => {
  try {
    const { user } = req.body || {};
    if (!user) return res.status(400).json({ message: "User required" });

    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    // Only the author can mark as answered
    if (post.author !== user) {
      return res.status(403).json({ message: "Only the author can mark this post as answered" });
    }

    post.isAnswered = true;
    await post.save();

    const io = req.app.get("io");
    if (io)
      io.emit("post_answered", {
        postId: post._id.toString(),
        isAnswered: true,
      });

    res.json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// GET /posts/:id/similar → simple "AI" suggestions based on title keywords
router.get("/:id/similar", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    //Build a simple regex from title words (ignore small words)
    const words = (post.title || "")
      .split(/\s+/)
      .map((w) => w.replace(/[^\w]/g, ""))
      .filter((w) => w.length > 2)
      .slice(0, 6);
    if (words.length === 0) return res.json([]);

    const regex = words.join("|");
    const similar = await Post.find({
      _id: { $ne: post._id },
      $or: [{ title: { $regex: regex, $options: "i" } }, { content: { $regex: regex, $options: "i" } }],
    })
      .limit(5)
      .sort({ createdAt: -1 });

    res.json(similar);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
