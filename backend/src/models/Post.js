// backend/models/Post.js
import mongoose from "mongoose";

const replySchema = new mongoose.Schema(
  {
    content: { type: String, required: true },
    author: { type: String, default: "Anonymous" },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const postSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: String, default: "Anonymous" },
    upvotes: { type: Number, default: 0 },
    upvotedBy: { type: [String], default: [] }, 
    replies: { type: [replySchema], default: [] },
    isAnswered: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("Post", postSchema);
