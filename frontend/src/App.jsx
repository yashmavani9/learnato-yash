// frontend/src/App.jsx
import { useState } from "react";
import Home from "./pages/Home";
import Login from "./components/Login";
import "./index.css";

export default function App() {
  const [user, setUser] = useState(localStorage.getItem("user") || null);

  const handleLogin = (name) => setUser(name);
  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  if (!user) return <Login onLogin={handleLogin} />;

  return <Home user={user} onLogout={handleLogout} />;
}
