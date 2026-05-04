import { useState, useEffect } from "react";
import Landing from "./components/Landing";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Dashboard from "./components/Dashboard";

export default function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [page, setPage] = useState("landing");
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === "dark" ? "light" : "dark"));
  };

  const renderContent = () => {
    if (token) return <Dashboard token={token} setToken={setToken} />;
    if (page === "login") return <Login setToken={setToken} setPage={setPage} />;
    if (page === "signup") return <Signup setPage={setPage} />;
    return <Landing setPage={setPage} />;
  };

  return (
    <div className="app-root">
      {renderContent()}
      
      {/* 🌓 Global Theme Toggle */}
      <button 
        className="theme-toggle" 
        onClick={toggleTheme} 
        aria-label="Toggle Theme"
        title={`Switch to ${theme === "dark" ? "Light" : "Night"} Mode`}
        style={{ fontSize: "0.75rem", fontWeight: "bold" }}
      >
        {theme === "dark" ? "LIGHT" : "NIGHT"}
      </button>
    </div>
  );
}
