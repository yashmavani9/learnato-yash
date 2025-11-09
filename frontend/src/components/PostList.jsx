// frontend/src/components/PostList.jsx
import { useEffect, useState } from "react";
import API from "../api";
import { socket } from "../socket";

export default function PostList({ onSelectPost, refreshSignal, user }) {
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("date");

  const fetchPosts = async () => {
    try {
      const q = new URLSearchParams();
      if (search) q.set("search", search);
      if (sort === "votes") q.set("sort", "votes");
      const res = await API.get(`/posts?${q.toString()}`);
      setPosts(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpvote = async (id) => {
    try {
      await API.post(`/posts/${id}/upvote`, { user });
    } catch (err) {
      if (err.response?.data?.message) alert(err.response.data.message);
      else console.error(err);
    }
  };

  useEffect(() => {
    fetchPosts();

    socket.on("new_post", (post) => setPosts((p) => [post, ...p]));

    socket.on("post_upvoted", ({ postId, upvotes, upvotedBy }) =>
      setPosts((p) =>
        p.map((x) =>
          x._id === postId ? { ...x, upvotes, upvotedBy } : x
        )
      )
    );

    socket.on("post_answered", ({ postId, isAnswered }) =>
      setPosts((p) =>
        p.map((x) =>
          x._id === postId ? { ...x, isAnswered } : x
        )
      )
    );

    socket.on("new_reply", ({ postId, reply }) =>
      setPosts((p) =>
        p.map((x) =>
          x._id === postId
            ? { ...x, replies: [...(x.replies || []), reply] }
            : x
        )
      )
    );

    return () => {
      socket.off("new_post");
      socket.off("post_upvoted");
      socket.off("post_answered");
      socket.off("new_reply");
    };
  }, []);

  useEffect(() => {
    const t = setTimeout(fetchPosts, 250);
    return () => clearTimeout(t);
  }, [search, sort]);

  useEffect(() => {
    if (!refreshSignal) return;
    fetchPosts();
  }, [refreshSignal?.current]);

  return (
    <div>
      {/* Search + Sort */}
      <div className="flex gap-3 mb-6">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search posts..."
          className="flex-1 px-4 py-3 rounded-xl border bg-white shadow-sm focus:ring-2 
                     focus:ring-blue-500 outline-none"
        />

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="px-4 py-3 rounded-xl border bg-white shadow-sm focus:ring-2 focus:ring-blue-500"
        >
          <option value="date">Newest</option>
          <option value="votes">Top votes</option>
        </select>
      </div>

      {/* POSTS */}
      <div className="space-y-5">
        {posts.map((p) => {
          const hasUpvoted = p.upvotedBy?.includes(user);

          return (
            <div
              key={p._id}
              className="bg-white border border-gray-200 shadow-sm rounded-2xl p-6 hover:shadow-lg hover:-translate-y-[3px] transition"
            >
              <div className="flex gap-6">
                {/* LEFT: UPVOTE */}
                <div className="flex flex-col items-center">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleUpvote(p._id);
                    }}
                    className={`px-3 py-2 rounded-xl border shadow-sm transition cursor-pointer
                      ${
                        hasUpvoted
                          ? "bg-blue-50 text-blue-700 border-blue-300 hover:bg-blue-100"
                          : "bg-gray-50 text-gray-600 border-gray-300 hover:bg-gray-100"
                      }
                      active:scale-90`}
                  >
                    <span className="text-sm font-semibold">
                      {p.upvotes || 0} {"Upvotes"} 
                    </span>
                  </button>
                </div>

                {/* RIGHT: MAIN CONTENT */}
                <div className="flex-1" onClick={() => onSelectPost(p)}>
                  <h3 className="text-xl font-semibold flex items-center gap-2">
                    {p.title}
                    {p.isAnswered && (
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 mt-1 rounded-lg font-medium">
                        Answered
                      </span>
                    )}
                  </h3>

                  <p className="text-gray-700 mt-2">
                    {p.content.length > 200
                      ? p.content.slice(0, 200) + "..."
                      : p.content}
                  </p>

                  <div className="text-sm text-gray-500 mt-3">
                    {p.replies?.length || 0} replies • By {p.author}
                  </div>
                </div>

                {/* VIEW BUTTON */}
                <div className="flex items-start">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectPost(p);
                    }}
                    className="bg-gray-700 text-white px-4 py-2 rounded-xl shadow-md hover:bg-gray-900 
                               hover:-translate-y-[2px] transition font-medium cursor-pointer"
                  >
                    View →
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
