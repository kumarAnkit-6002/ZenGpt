import './App.css';
import Sidebar from "./Sidebar.jsx";
import ChatWindow from "./ChatWindow.jsx";
import LandingPage from "./landingPage.jsx";
import Login from "./Login.jsx";
import Register from "./Register.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";

import { MyContext } from "./MyContext.jsx";
import { AuthProvider } from "./AuthContext.jsx";
import { useState } from 'react';
import { v1 as uuidv1 } from "uuid";

import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  const [prompt, setPrompt] = useState("");
  const [reply, setReply] = useState(null);
  const [currThreadId, setCurrThreadId] = useState(uuidv1());
  const [prevChats, setPrevChats] = useState([]);
  const [newChat, setNewChat] = useState(true);
  const [allThreads, setAllThreads] = useState([]);

  const providerValues = {
    prompt, setPrompt,
    reply, setReply,
    currThreadId, setCurrThreadId,
    newChat, setNewChat,
    prevChats, setPrevChats,
    allThreads, setAllThreads
  };

  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>

          {/* Landing Page */}
          <Route path="/" element={<LandingPage />} />

          {/* Auth pages */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Actual ZenGPT - only reachable when logged in */}
          <Route
            path="/chat"
            element={
              <ProtectedRoute>
                <MyContext.Provider value={providerValues}>
                  <div className="app">
                    <Sidebar />
                    <ChatWindow />
                  </div>
                </MyContext.Provider>
              </ProtectedRoute>
            }
          />

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
