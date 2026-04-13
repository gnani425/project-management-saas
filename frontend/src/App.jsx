import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Billing from "./pages/Billing";
import Admin from "./pages/Admin";
import Profile from "./pages/Profile";

// 🔐 Check if logged in
const isAuthenticated = () => {
  return !!localStorage.getItem("token");
};

// 👑 Check admin role
const isAdmin = () => {
  return localStorage.getItem("role") === "admin";
};

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* 🔓 PUBLIC ROUTES */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* 🔐 USER PROTECTED ROUTES */}
        <Route
          path="/dashboard"
          element={isAuthenticated() ? <Dashboard /> : <Navigate to="/login" />}
        />

        <Route
          path="/billing"
          element={isAuthenticated() ? <Billing /> : <Navigate to="/login" />}
        />

        <Route
          path="/profile"
          element={isAuthenticated() ? <Profile /> : <Navigate to="/login" />}
        />

        {/* 👑 ADMIN ROUTE */}
        <Route
          path="/admin"
          element={
            isAuthenticated() && isAdmin()
              ? <Admin />
              : <Navigate to="/dashboard" />
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;