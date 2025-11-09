// frontend/src/components/Login.jsx
import { useState } from "react";

export default function Login({ onLogin }) {
  const [name, setName] = useState("");

  const submit = () => {
    if (!name.trim()) return alert("Enter your name");
    localStorage.setItem("user", name.trim());
    onLogin(name.trim());
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-white to-blue-100 px-6">

      {/* HERO TITLE */}
      <div className="w-full max-w-2xl text-center mb-10 mt-20">
        <h1 className="text-5xl sm:text-6xl font-semibold tracking-tight mb-4">
          Welcome to <span className="text-blue-600 text-6xl">Learnato</span>
        </h1>

        <p className="text-gray-600 text-xl max-w-md mx-auto">
          Enter your display name to continue
        </p>
      </div>

      {/* CARD */}
      <div className="w-full max-w-lg bg-white p-8 rounded-2xl shadow-md border border-gray-100 text-center">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your display name"
          className="w-full px-4 py-3 border rounded-lg mb-5 text-lg
                     focus:ring-2 focus:ring-blue-500 outline-none transition"
        />

        <button
          onClick={submit}
          className="w-full bg-blue-600 text-white py-3 rounded-lg text-lg font-medium
                     shadow-md hover:bg-blue-700 transition"
        >
          Continue →
        </button>
      </div>

      {/* SUBTEXT */}
      <p className="mt-10 text-gray-500 text-center">
        A clean & simple way to join the community
      </p>

      {/* FOOTER */}
      <footer className="mt-24 pb-6 text-center text-gray-500">
        <span>
          <a
            href="https://yashmavani.tech"
            target="_blank"
            className="text-gray-700 font-semibold hover:text-blue-600 transition"
          >
            Yash Mavani
          </a>{" "}
          Production
        </span>
      </footer>
    </div>
  );
}
