import { useState } from "react";

export default function MockLogin({ onLogin }) {
  const [username, setUsername] = useState(localStorage.getItem("username") || "");

  const handleLogin = () => {
    if (!username.trim()) {
      alert("Please enter a username");
      return;
    }
    localStorage.setItem("username", username.trim());
    onLogin(username.trim());
  };

  const handleLogout = () => {
    localStorage.removeItem("username");
    setUsername("");
    onLogin(null);
  };

  return (
    <div className="flex justify-between items-center bg-white p-3 rounded-xl shadow mb-5">
      <div className="flex items-center gap-2">
        <input
          type="text"
          placeholder="Enter username..."
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="border px-3 py-2 rounded"
        />
        <button
          onClick={handleLogin}
          className="bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700"
        >
          Login
        </button>
      </div>

      {localStorage.getItem("username") && (
        <div className="text-sm text-gray-600 flex items-center gap-2">
          <span>👤 {localStorage.getItem("username")}</span>
          <button
            onClick={handleLogout}
            className="text-red-600 text-xs underline"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
