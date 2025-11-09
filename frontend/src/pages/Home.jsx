// frontend/src/pages/Home.jsx
import { useState, useRef } from "react";
import PostForm from "../components/PostForm";
import PostList from "../components/PostList";
import PostDetails from "../components/PostDetails";

export default function Home({ user, onLogout }) {
  const [selectedPost, setSelectedPost] = useState(null);
  const refreshCounterRef = useRef(0);

  const triggerRefresh = () => {
    refreshCounterRef.current += 1;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50 pb-20">
      {/* NAVBAR */}
      <header className="w-full max-w-6xl mx-auto flex justify-between items-center py-6 px-6">
        <h1 className="text-3xl font-semibold tracking-tight">
          <span className="text-blue-600">Learnato</span> Forum
        </h1>

        <div className="flex items-center gap-4">
          <span className="text-gray-700 font-medium">@ {user}</span>
          <button
            onClick={onLogout}
            className="bg-red-600 text-white px-5 py-2 rounded-lg shadow-md hover:bg-red-700 transition"
          >
            Logout
          </button>
        </div>
      </header>

      {/* MAIN CONTENT WRAPPER */}
      <main className="w-full max-w-5xl mx-auto px-6 mt-6">
        {selectedPost ? (
          <PostDetails
            post={selectedPost}
            onBack={() => setSelectedPost(null)}
            user={user}
            onRefresh={triggerRefresh}
          />
        ) : (
          <>
            <PostForm onPostCreated={triggerRefresh} user={user} />
            <PostList
              onSelectPost={setSelectedPost}
              refreshSignal={refreshCounterRef}
              user={user}
            />
          </>
        )}
      </main>
    </div>
  );
}
