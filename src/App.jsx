import { useState } from "react";
import Landing from "./components/Landing";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Dashboard from "./components/Dashboard";

export default function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [page, setPage] = useState("landing");

  if (token) return <Dashboard token={token} setToken={setToken} />;

  if (page === "login") return <Login setToken={setToken} setPage={setPage} />;
  if (page === "signup") return <Signup setPage={setPage} />;

  return <Landing setPage={setPage} />;
}
