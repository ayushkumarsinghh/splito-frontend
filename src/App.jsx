import { useState } from "react";
import Landing from "./components/Landing";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Dashboard from "./components/Dashboard";
import LineWaves from "./components/LineWaves/LineWaves";

export default function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [page, setPage] = useState("landing");

  const renderContent = () => {
    if (token) return <Dashboard token={token} setToken={setToken} />;
    if (page === "login") return <Login setToken={setToken} setPage={setPage} />;
    if (page === "signup") return <Signup setPage={setPage} />;
    return <Landing setPage={setPage} />;
  };

  return (
    <div style={{ position: "relative", minHeight: "100vh", color: "white" }}>
      <LineWaves
        speed={0.3}
        innerLineCount={32}
        outerLineCount={36}
        warpIntensity={1}
        rotation={-45}
        edgeFadeWidth={0}
        colorCycleSpeed={1}
        brightness={0.2}
        color1="#6366f1"
        color2="#a855f7"
        color3="#ec4899"
        enableMouseInteraction
        mouseInfluence={2}
      />
      <div style={{ position: "relative", zIndex: 1 }}>
        {renderContent()}
      </div>
    </div>
  );
}
