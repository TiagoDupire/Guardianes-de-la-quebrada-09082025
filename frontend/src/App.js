import React, { useState, useEffect } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import axios from "axios";
import GameMenu from "./components/GameMenu";
import Level1 from "./components/Level1";
import Level2 from "./components/Level2";
import Level3 from "./components/Level3";
import Level4 from "./components/Level4";
import Level5 from "./components/Level5";
import GameProvider from "./context/GameContext";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Test backend connection
const testBackend = async () => {
  try {
    const response = await axios.get(`${API}/`);
    console.log("Backend connected:", response.data.message);
  } catch (e) {
    console.error("Backend connection failed:", e);
  }
};

function App() {
  useEffect(() => {
    testBackend();
  }, []);

  return (
    <GameProvider>
      <div className="App">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<GameMenu />} />
            <Route path="/level/1" element={<Level1 />} />
            <Route path="/level/2" element={<Level2 />} />
            <Route path="/level/3" element={<Level3 />} />
            <Route path="/level/4" element={<Level4 />} />
            <Route path="/level/5" element={<Level5 />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </div>
    </GameProvider>
  );
}

export default App;