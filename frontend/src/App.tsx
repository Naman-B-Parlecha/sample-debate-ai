import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./pages/ProtectedRoute.tsx";
import LoginPage from "./pages/LoginPage.tsx";
import SignUpPage from "./pages/SignUpPage.tsx";
import CreateDebatePage from "./pages/CreateRoom.tsx";
import DebateRoomPage from "./pages/DebateRoom.tsx";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<SignUpPage />} />
        <Route element={<ProtectedRoute />}>
            <Route path="/" element={<div>dsadsad</div>} />
            <Route path="/create-room" element={<CreateDebatePage />} />
            <Route path="/debate/:roomId" element={<DebateRoomPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;