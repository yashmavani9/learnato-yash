// frontend/src/components/PostForm.jsx
import { useState } from "react";
import API from "../api";

export default function PostForm({ onPostCreated, user }) {
  const [form, setForm] = useState({
    title: "",
    content: "",
    author: user || "",
  });
  
  // if user prop changes (login), we keep author synced
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.content.trim())
      return alert("Title and content required");
    try {
      const payload = { ...form, author: form.author || user || "Anonymous" };
      await API.post("/posts", payload);
      setForm({ title: "", content: "", author: user || "" });
      if (onPostCreated) onPostCreated();
    } catch (err) {
      console.error(err);
      alert("Failed to create post");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white/70 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white/50 mb-8 transition hover:shadow-2xl"
    >
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Create New Post</h2>

      <input
        name="title"
        placeholder="Post title"
        value={form.title}
        onChange={handleChange}
        className="p-3 w-full rounded-xl border border-gray-300 bg-white/80 shadow-inner focus:ring-2 focus:ring-blue-500 focus:outline-none transition mb-3"
      />

      <textarea
        name="content"
        placeholder="Write something..."
        value={form.content}
        onChange={handleChange}
        className="p-3 w-full rounded-xl border border-gray-300 bg-white/80 shadow-inner focus:ring-2 focus:ring-blue-500 transition mb-2"
      />

      <input
        name="author"
        placeholder="Your name (optional)"
        value={form.author}
        className="p-3 w-full rounded-xl border border-gray-300 bg-white/80 shadow-inner focus:ring-2 focus:ring-blue-500 transition mb-3"
      />

      <div className="flex justify-end">
        <button
          type="submit"
          className="px-5 py-2 bg-blue-600 text-white rounded-xl font-semibold shadow-lg 
      hover:bg-blue-700 hover:scale-105 transition active:scale-95"
        >
          Post
        </button>
      </div>
    </form>
  );
}
