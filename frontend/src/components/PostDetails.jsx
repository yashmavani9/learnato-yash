// frontend/src/components/PostDetails.jsx
import { useEffect, useState } from "react";
import API from "../api";
import { socket } from "../socket";

export default function PostDetails({ post, onBack, user, onRefresh }) {
  const [details, setDetails] = useState(null);
  const [reply, setReply] = useState("");
  const [similar, setSimilar] = useState([]);

  const fetchPost = async () => {
    try {
      const res = await API.get(`/posts/${post._id}`);
      setDetails(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchSimilar = async () => {
    try {
      const res = await API.get(`/posts/${post._id}/similar`);
      setSimilar(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const addReply = async () => {
    if (!reply.trim()) return;
    try {
      await API.post(`/posts/${post._1d || post._id}/reply`, {
        content: reply.trim(),
        author: user || "Anonymous",
      });
      setReply("");
      await fetchPost();
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error(err);
    }
  };
  
  const markAnswered = async () => {
    try {
      await API.post(`/posts/${post._id}/markAnswered`, { user });
      await fetchPost();
      if (onRefresh) onRefresh();
    } catch (err) {
      if (err.response?.data?.message) alert(err.response.data.message);
      else console.error(err);
    }
  };

  useEffect(() => {
    fetchPost();
    fetchSimilar();

    socket.on("new_reply", ({ postId }) => {
      if (postId === post._id) fetchPost();
    });
    socket.on("post_answered", ({ postId }) => {
      if (postId === post._id) fetchPost();
    });
    socket.on("post_upvoted", ({ postId }) => {
      if (postId === post._id) fetchPost();
    });

    return () => {
      socket.off("new_reply");
      socket.off("post_answered");
      socket.off("post_upvoted");
    };
  }, [post]);

  if (!details) return <p>Loading...</p>;

  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/50">
      <button
        onClick={onBack}
        className="text-blue-600 font-semibold mb-4 hover:underline hover:text-blue-800"
      >
        ← Back
      </button>

      <h2 className="text-3xl font-bold flex items-center gap-3 mb-2">
        {details.title}
        {details.isAnswered && (
          <span className="text-green-600 bg-green-100 px-2 py-1 rounded-lg text-sm">
            ✔ Answered
          </span>
        )}
      </h2>

      <p className="text-gray-700 text-lg mb-3">{details.content}</p>

      <div className="text-sm text-gray-500 mb-6">
        By {details.author} • Votes {details.upvotes}
      </div>

      {/* Mark Answered */}
      {!details.isAnswered && (
        <button
          onClick={details.author === user ? markAnswered : null}
          disabled={details.author !== user}
          className={`px-5 py-2 rounded-xl font-semibold shadow-md transition
      ${
        details.author === user
          ? "bg-green-600 text-white hover:bg-green-700 hover:scale-105 active:scale-95"
          : "bg-gray-200 text-gray-500 cursor-not-allowed"
      }`}
        >
          Mark as Answered
        </button>
      )}

      {/* Replies */}
      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-3">Replies</h3>

        <div className="space-y-3">
          {details.replies?.map((r, i) => (
            <div key={i} className="bg-gray-50 p-3 rounded-xl border">
              <div className="text-gray-800">{r.content}</div>
              <div className="text-xs text-gray-500 mt-1">— {r.author}</div>
            </div>
          ))}
        </div>

        {/* Add reply */}
        <div className="flex gap-3 mt-5">
          <input
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            placeholder="Write a reply..."
            className="flex-1 p-3 rounded-xl border bg-white/70 shadow-inner 
        focus:ring-2 focus:ring-blue-500 transition"
          />

          <button
            onClick={addReply}
            className="px-5 py-2 bg-blue-600 text-white rounded-xl shadow-lg 
        hover:bg-blue-700 hover:scale-105 active:scale-95 transition"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
