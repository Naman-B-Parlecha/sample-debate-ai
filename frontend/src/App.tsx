import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./pages/ProtectedRoute.tsx";
import LoginPage from "./pages/LoginPage.tsx";
import SignUpPage from "./pages/SignUpPage.tsx";
import CreateDebatePage from "./pages/CreateRoom.tsx";
import DebateRoomPage from "./pages/DebateRoom.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import LeaderBoard from "./pages/LeaderBoard.tsx";
import JoinRoom from "./pages/JoinRoom.tsx";
import ProfilePage from "./pages/ProfilePage.tsx";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<SignUpPage />} />
        <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/create-room" element={<CreateDebatePage />} />
            <Route path="/debate/:roomId" element={<DebateRoomPage />} />
            <Route path="/leaderboard" element={<LeaderBoard />} />
            <Route path="/join-room" element={<JoinRoom />} />
            <Route path="/profile" element={<ProfilePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;