import { useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const login = async () => {
    try {
      // ✅ FastAPI expects FORM DATA (not JSON)
      const formData = new URLSearchParams();
      formData.append("username", email); // ⚠️ must be 'username'
      formData.append("password", password);

      const res = await API.post("/auth/login", formData, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      // ✅ Save token + role
      localStorage.setItem("token", res.data.access_token);
      localStorage.setItem("role", res.data.role);

      // ✅ Redirect
      navigate("/dashboard");

    } catch (err) {
      console.error("LOGIN ERROR:", err.response?.data || err.message);

      alert(err.response?.data?.detail || "Login failed");
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h2>Login</h2>

      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ display: "block", margin: "10px auto", padding: "8px" }}
      />

      <input
        placeholder="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ display: "block", margin: "10px auto", padding: "8px" }}
      />

      <button
        onClick={login}
        style={{ padding: "10px 20px", cursor: "pointer" }}
      >
        Login
      </button>
    </div>
  );
}