import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";

import SplashScreen from "./components/SplashScreen";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import Profile from "./components/Profile";
import Admin from "./components/Admin";
import Register from "./components/Register";
import Explore from "./components/Explore";
import Search from "./components/Search";
import CreatorDashboard from "./components/CreatorDashboard";
import ChatList from "./components/ChatList";
import Chat from "./components/Chat";



function App() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2500); // ⏱ shows splash for 2.5 seconds

    return () => clearTimeout(timer);
  }, []);

  // 🔹 SHOW SPLASH FIRST
  if (showSplash) {
    return <SplashScreen />;
  }

  // 🔹 LOAD APP AFTER SPLASH
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="/register" element={<Register />} />
      <Route path="/explore" element={<Explore />} />
      <Route path="/search" element={<Search />} />
      <Route path="/creator" element={<CreatorDashboard />} />
      <Route path="/chat" element={<ChatList />} />
      <Route path="/chat/:email" element={<Chat />} />
    </Routes>
  );
}

export default App;
